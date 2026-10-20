import React, { useState, useEffect, useRef } from 'react';
import { MatchSessionData, ChatMessageItem } from '../lib/types';
import { getApiUrl, getWebSocketUrl } from '../lib/api';
import { playTone, playCosmicChime } from '../lib/audio';

interface ChatRoomProps {
  session: MatchSessionData;
  initialMessages: ChatMessageItem[];
  soundEnabled: boolean;
  onRevealSuccess?: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  session,
  initialMessages,
  soundEnabled,
  onRevealSuccess
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [revealRequested, setRevealRequested] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Otomatik aşağı kaydırma
  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket ve Polling Bağlantısı
  useEffect(() => {
    const wsUrl = getWebSocketUrl(`/ws/chat/${session.session_id}`);
    let ws: WebSocket | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            setMessages(prev => {
              if (prev.some(m => m.id === data.id)) return prev;
              return [...prev, data];
            });
            if (data.sender === 'partner') {
              playTone(480, 'sine', 0.5, soundEnabled);
            }
          } else if (data.type === 'reveal') {
            setIsRevealed(true);
            playCosmicChime(soundEnabled);
            if (onRevealSuccess) onRevealSuccess();
          }
        } catch (e) {}
      };

      ws.onerror = () => {
        startPolling();
      };
    } catch (e) {
      startPolling();
    }

    function startPolling() {
      if (pollInterval) return;
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`${getApiUrl()}/api/chat/messages/${session.session_id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.messages && data.messages.length > 0) {
              setMessages(data.messages);
            }
            if (data.is_revealed) {
              setIsRevealed(true);
            }
          }
        } catch (e) {}
      }, 2500);
    }

    return () => {
      if (ws) ws.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [session.session_id]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const text = input.trim();
    setInput('');
    setIsSending(true);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessageItem = {
      id: Date.now(),
      sender: 'user',
      sender_name: 'Sen',
      text: text,
      time: nowTime
    };

    setMessages(prev => [...prev, userMsg]);
    playTone(600, 'sine', 0.3, soundEnabled);

    // WebSocket aktifse soketten gönder
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        sender_name: 'Sen',
        text: text
      }));
      setIsSending(false);
      return;
    }

    // Değilse REST üzerinden gönder
    try {
      const res = await fetch(`${getApiUrl()}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.session_id,
          sender_name: 'Sen',
          text: text
        })
      });

      const data = await res.json();
      if (data.reply) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'partner',
              sender_name: session.partner_name,
              text: data.reply,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          playTone(480, 'sine', 0.5, soundEnabled);
        }, 900);
      }
    } catch (e) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'partner',
            sender_name: session.partner_name,
            text: 'Bu derin bakış açın evrendeki dengeyi çok güzel yansıtıyor.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        playTone(480, 'sine', 0.5, soundEnabled);
      }, 900);
    } finally {
      setIsSending(false);
    }
  };

  const handleReveal = async () => {
    setRevealRequested(true);
    try {
      await fetch(`${getApiUrl()}/api/chat/reveal/${session.session_id}`, { method: 'POST' });
    } catch (e) {}
    setTimeout(() => {
      setRevealRequested(false);
      setIsRevealed(true);
      playCosmicChime(soundEnabled);
      // Karşı tarafla açığa çıktığını sistem mesajı olarak da ekle
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'system',
          sender_name: 'Kozmik Sistem',
          text: '✦ Anonimlik kaldırıldı! Karşılıklı felsefi profiller açığa çıktı.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div style={{ backgroundColor: '#0a0a0c', padding: '20px', borderRadius: '8px', border: isRevealed ? '1px solid #D4AF37' : '1px solid #4a4a52' }}>
      {/* Üst Bilgi Başlığı */}
      {!isRevealed ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #2a2a30', paddingBottom: '10px' }}>
          <div>
            <span style={{ color: '#D4AF37', fontSize: '14px', fontWeight: 'bold' }}>{session.partner_name}</span>
            <span style={{ color: '#6b7280', fontSize: '11px', display: 'block' }}>Uyum: %{session.compatibility} • Tamamen Anonim</span>
          </div>
          <span style={{ fontSize: '11px', color: '#28a745' }}>● Bağlı</span>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #D4AF37', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1a1a1e', border: '1px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              🌌
            </div>
            <div>
              <span style={{ color: '#D4AF37', fontSize: '14px', fontWeight: 'bold' }}>{session.partner_name}</span>
              <span style={{ color: '#28a745', fontSize: '11px', display: 'block' }}>✦ Anonimlik Kaldırıldı • Arketip: {session.partner_archetype} (%{session.compatibility})</span>
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#28a745', backgroundColor: 'rgba(40, 167, 69, 0.1)', padding: '4px 8px', borderRadius: '12px', border: '1px solid #28a745' }}>
            ● Açık İletişim
          </span>
        </div>
      )}

      {/* Mesaj Akışı */}
      <div
        ref={chatScrollRef}
        className="hide-scroll"
        style={{ backgroundColor: '#121215', height: '260px', padding: '15px', borderRadius: '6px', marginBottom: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : (msg.sender === 'system' ? 'center' : 'flex-start'),
              maxWidth: '82%'
            }}
          >
            {msg.sender === 'system' ? (
              <span style={{ color: '#D4AF37', fontSize: '12px', fontStyle: 'italic', textAlign: 'center', display: 'block', padding: '6px 12px', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: '12px' }}>
                {msg.text}
              </span>
            ) : (
              <div
                style={{
                  backgroundColor: msg.sender === 'user' ? '#1f1f26' : '#18181f',
                  border: `1px solid ${msg.sender === 'user' ? '#D4AF37' : '#2a2a30'}`,
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280', marginBottom: '4px', gap: '10px' }}>
                  <span>{msg.sender_name}</span>
                  <span>{msg.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#e5e7eb', lineHeight: '1.4' }}>{msg.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mesaj Girişi */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Felsefi bir mesaj yaz..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          style={{ flex: 1, padding: '10px 14px', backgroundColor: '#1a1a1e', border: '1px solid #4a4a52', color: '#e5e7eb', borderRadius: '4px', fontSize: '13px' }}
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          style={{ padding: '0 18px', backgroundColor: '#D4AF37', color: '#0a0a0c', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {isSending ? '...' : 'Gönder'}
        </button>
      </div>

      {/* Anonimlik Butonu veya Açık İletişim Bilgisi */}
      {!isRevealed ? (
        <button
          onClick={handleReveal}
          disabled={revealRequested}
          style={{ padding: '10px', backgroundColor: revealRequested ? '#2a2a30' : 'transparent', border: '1px solid #D4AF37', color: revealRequested ? '#9ca3af' : '#D4AF37', cursor: revealRequested ? 'not-allowed' : 'pointer', width: '100%', borderRadius: '4px', fontSize: '12px' }}
        >
          {revealRequested ? 'Karşı Tarafın Onayı Bekleniyor...' : '👁 Anonimliği Bozmayı Teklif Et'}
        </button>
      ) : (
        <div style={{ padding: '8px 12px', backgroundColor: 'rgba(212, 175, 55, 0.08)', border: '1px dashed #D4AF37', borderRadius: '4px', textAlign: 'center', fontSize: '12px', color: '#D4AF37' }}>
          ✦ Anonimlik kaldırıldı. Doğrudan açık kimlikle sohbet ediyorsunuz.
        </div>
      )}
    </div>
  );
};
