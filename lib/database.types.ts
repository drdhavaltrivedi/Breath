export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          onboarding_complete: boolean;
          notifications_enabled: boolean;
          heart_rate_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          onboarding_complete?: boolean;
          notifications_enabled?: boolean;
          heart_rate_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          onboarding_complete?: boolean;
          notifications_enabled?: boolean;
          heart_rate_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      breathing_sessions: {
        Row: {
          id: string;
          user_id: string;
          problem_title: string;
          protocol: string;
          duration_seconds: number;
          completed: boolean;
          estimated_hr_reduction: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          problem_title: string;
          protocol: string;
          duration_seconds: number;
          completed?: boolean;
          estimated_hr_reduction?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          problem_title?: string;
          protocol?: string;
          duration_seconds?: number;
          completed?: boolean;
          estimated_hr_reduction?: number;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type BreathingSessionRow = Database['public']['Tables']['breathing_sessions']['Row'];
export type BreathingSessionInsert = Database['public']['Tables']['breathing_sessions']['Insert'];
