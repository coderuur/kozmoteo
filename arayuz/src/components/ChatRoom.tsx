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

const ICEBREAKERS = [
  'Evren sence bir simülasyon mu, yoksa aşkın bir bilinç mi?',
  'Kader mi yoksa kendi seçimlerimiz mi hayatı yönlendirir?',
  'Ölüm son mu, yoksa kozmik bir dönüşüm mü?',
  'Ahlak evrensel bir gerçeklik midir, yoksa toplumsal icat mı?'
];

export const ChatRoom: React.FC<ChatRoomProps> = ({
  session,
  initialMessages,
  soundEnabled,
  onRevealSuccess
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [revealRequested, setRevealRequested] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPartnerTyping]);

  useEffect(() => {
    const tokenQuery = session.room_token ? `?room_token=${encodeURIComponent(session.room_token)}` : '';
    const wsUrl = getWebSocketUrl(`/ws/chat/${session.session_id}${tokenQuery}`);
    let ws: WebSocket | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            setIsPartnerTyping(false);
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
          } else if (data.type === 'typing') {
            setIsPartnerTyping(true);
          }
        } catch (e) {
          console.error('Mesaj parse hatası:', e);
        }
      };

      ws.onerror = () => {
        // Fallback polling
        pollInterval = setInterval(async () => {
          try {
            const res = await fetch(`${getApiUrl()}/api/chat/messages/${session.session_id}`, {
              headers: session.room_token ? { 'X-Room-Token': session.room_token } : {}
            });
            if (res.ok) {
              const data = await res.json();
              if (data.messages && data.messages.length > 0) {
                setMessages(prev => {
                  const existingIds = new Set(prev.map(m => m.id));
                  const newMsgs = data.messages.filter((m: ChatMessageItem) => !existingIds.has(m.id));
                  return [...prev, ...newMsgs];
                });
              }
              if (data.is_revealed) {
                setIsRevealed(true);
              }
            }
          } catch (e) {
            // sessiz geç
          }
        }, 3000);
      };
    } catch (err) {
      console.error('WebSocket bağlantı hatası:', err);
    }

    return () => {
      if (ws) ws.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [session.session_id, session.room_token, soundEnabled, onRevealSuccess]);

  const handleSendText = async (textToSend: string) => {
    const cleanText = textToSend.trim();
    if (!cleanText || isSending) return;

    setIsSending(true);
    setInput('');
    playTone(520, 'triangle', 0.3, soundEnabled);

    const userMsg: ChatMessageItem = {
      id: `u-${Date.now()}`,
      sender: 'user',
      sender_name: 'Sen',
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsPartnerTyping(true);

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          action: 'message',
          session_id: session.session_id,
          sender: 'user',
          text: cleanText
        }));
      } else {
        const res = await fetch(`${getApiUrl()}/api/chat/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(session.room_token ? { 'X-Room-Token': session.room_token } : {})
          },
          body: JSON.stringify({
            session_id: session.session_id,
            sender: 'user',
            text: cleanText
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            setIsPartnerTyping(false);
            setMessages(prev => [...prev, data.reply]);
          }
        }
      }
    } catch (e) {
      console.error('Mesaj iletim hatası:', e);
    } finally {
      setIsSending(false);
      setTimeout(() => setIsPartnerTyping(false), 4000);
    }
  };

  const handleSend = () => handleSendText(input);

  const handleReveal = async () => {
    setRevealRequested(true);
    playTone(600, 'sine', 0.6, soundEnabled);

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          action: 'reveal',
          session_id: session.session_id,
          sender: 'user'
        }));
      } else {
        await fetch(`${getApiUrl()}/api/chat/reveal/${session.session_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(session.room_token ? { 'X-Room-Token': session.room_token } : {})
          },
          body: JSON.stringify({
            session_id: session.session_id,
            sender: 'user'
          })
        });
      }
    } catch (e) {
      console.error('Anonimlik kaldırma talebi iletilemedi:', e);
    }
  };

  return (
    <div style={{
      backgroundColor: '#16161c',
      border: '1px solid #D4AF37',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '25px',
      boxShadow: '0 0 35px rgba(212, 175, 55, 0.15)'
    }}>
      {/* Başlık ve Eşleşme Bilgisi */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2a30', paddingBottom: '12px', marginBottom: '15px' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {session.match_type === 'duo_date' ? '❤️ Kozmik Flört Eşleşmesi' : '🤝 Ruhsal Dostluk Ağı'}
          </span>
          <h3 style={{ margin: '4px 0 0 0', color: '#D4AF37', fontSize: '18px' }}>
            {isRevealed ? session.partner_name : '✦ Anonim Yolcu'}
          </h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' }} />
            Canlı Frekans Bağlantısı
          </span>
          <span style={{ fontSize: '11px', color: '#6b7280' }}>
            Uyumluluk: %{session.compatibility || session.similarity_percentage || 90}
          </span>
        </div>
      </div>

      {/* Mesaj Akışı */}
      <div
        ref={chatScrollRef}
        className="hide-scroll"
        style={{
          backgroundColor: '#0f0f13',
          height: '280px',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          border: '1px solid #22222a'
        }}
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
              <span style={{
                color: '#D4AF37',
                fontSize: '12px',
                fontStyle: 'italic',
                textAlign: 'center',
                display: 'block',
                padding: '6px 14px',
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                border: '1px dashed rgba(212, 175, 55, 0.3)',
                borderRadius: '14px'
              }}>
                {msg.text}
              </span>
            ) : (
              <div
                style={{
                  backgroundColor: msg.sender === 'user' ? '#1f1d28' : '#171622',
                  border: `1px solid ${msg.sender === 'user' ? '#D4AF37' : '#332d4a'}`,
                  borderRadius: '10px',
                  padding: '9px 13px',
                  boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(212, 175, 55, 0.1)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#71717a', marginBottom: '4px', gap: '12px' }}>
                  <span style={{ fontWeight: 'bold', color: msg.sender === 'user' ? '#FFE8A3' : '#a1a1aa' }}>
                    {msg.sender_name}
                  </span>
                  <span>{msg.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#f1f5f9', lineHeight: '1.45' }}>{msg.text}</p>
              </div>
            )}
          </div>
        ))}

        {/* Eşleşilen Kişi Yazıyor Animasyonu */}
        {isPartnerTyping && (
          <div style={{ alignSelf: 'flex-start', padding: '6px 12px', background: 'rgba(212, 175, 55, 0.08)', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)', fontSize: '11px', color: '#FFE699', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>✦ Karşı taraf felsefi cevabını şekillendiriyor</span>
            <span style={{ letterSpacing: '2px', fontWeight: 'bold' }}>...</span>
          </div>
        )}
      </div>

      {/* Felsefi Buz Kırıcılar (Icebreakers) */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🎲 Felsefi Buz Kırıcılar (Tek Tıkla Sor):</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {ICEBREAKERS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendText(q)}
              disabled={isSending}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                backgroundColor: '#1b1926',
                border: '1px solid #3d3558',
                borderRadius: '16px',
                color: '#d1d5db',
                fontSize: '11px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#D4AF37')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#3d3558')}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Mesaj Girişi */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
        <input
          type="text"
          placeholder="Felsefi bir mesaj veya soru yaz..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          style={{
            flex: 1,
            padding: '11px 16px',
            backgroundColor: '#111018',
            border: '1px solid #3d3558',
            color: '#f8fafc',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          style={{
            padding: '0 22px',
            backgroundColor: '#D4AF37',
            color: '#0a0a0c',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          {isSending ? '...' : 'Gönder'}
        </button>
      </div>

      {/* Anonimlik Butonu veya Açık İletişim Bilgisi */}
      {!isRevealed ? (
        <button
          onClick={handleReveal}
          disabled={revealRequested}
          style={{
            padding: '11px',
            backgroundColor: revealRequested ? '#222030' : 'transparent',
            border: '1px solid #D4AF37',
            color: revealRequested ? '#9ca3af' : '#D4AF37',
            cursor: revealRequested ? 'not-allowed' : 'pointer',
            width: '100%',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
        >
          {revealRequested ? 'Karşı Tarafın Onayı Bekleniyor...' : '👁 Anonimliği Bozmayı Teklif Et'}
        </button>
      ) : (
        <div style={{
          padding: '10px 14px',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          border: '1px dashed #D4AF37',
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#FFE699',
          fontWeight: 'bold'
        }}>
          ✦ Tebrikler! Anonimlik karşılıklı kaldırıldı. Gerçek kimliklerinizle derin bağlar kurabilirsiniz.
        </div>
      )}
    </div>
  );
};
