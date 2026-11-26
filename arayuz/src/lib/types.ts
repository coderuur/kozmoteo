export interface BeliefScore {
  name: string;
  percentage: number;
}

export interface BookRecommendation {
  title: string;
  author: string;
  note: string;
}

export interface MovieRecommendation {
  title: string;
  year: number;
  director: string;
  note: string;
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
  books?: BookRecommendation[];
  movies?: MovieRecommendation[];
  extended_essay?: string[];
}

export interface ChatMessageItem {
  id: number | string;
  sender: 'user' | 'partner' | 'system';
  sender_name: string;
  text: string;
  time: string;
}

export interface MatchSessionData {
  session_id: string;
  room_token?: string;
  partner_name: string;
  partner_archetype: string;
  partner_gender: string;
  compatibility: number;
  similarity_percentage?: number;
  greeting: string;
  match_type?: string;
}

export interface VoiceVerificationResult {
  valid: boolean;
  pitch_hz: number;
  detected_gender: string;
  message: string;
}
