export interface BeliefScore {
  name: string;
  percentage: number;
}

export interface MatchResult {
  similarity_percentage: number;
  belief_name: string;
  description: string;
  belief_base_vector: number[];
  secondary_matches: BeliefScore[];
  details: string;
  figures: string[];
  quotes: string[];
  daily_reflection: string;
  archetype: string;
}

export interface ChatMessageItem {
  id: number;
  sender: 'user' | 'partner' | 'system';
  sender_name: string;
  text: string;
  time: string;
}

export interface MatchSessionData {
  session_id: string;
  partner_name: string;
  partner_archetype: string;
  partner_gender: string;
  compatibility: number;
  greeting: string;
}

export interface VoiceVerificationResult {
  valid: boolean;
  pitch_hz: number;
  detected_gender: string;
  message: string;
}
