export interface User {
  user_id: string;
  role: 'student' | 'teacher';
  email: string;
  name: string;
  profile_pic: string;
  created_at: string;
  last_login: string;
  total_points?: number;
  streak_days?: number;
  quizzes_taken?: number;
  avg_score?: number;
  total_time?: number;
  auth_provider?: 'google' | 'microsoft' | 'facebook' | 'email';
}

export interface Achievement {
  achievement_id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: 'completion' | 'score' | 'speed' | 'streak' | 'points' | 'category';
}

export interface UserAchievement {
  user_id: string;
  achievement_id: string;
  earned_date: string;
  progress: number;
}

export interface GamificationStats {
  total_points: number;
  streak_days: number;
  last_quiz_date: string;
  achievements_earned: string[];
  next_milestone: {
    name: string;
    progress: number;
    required: number;
  };
}

export interface Quiz {
  quiz_id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  created_by: string;
  created_at: string;
  start_time: string;
  end_time: string;
  time_limit: number;
  max_participants: number;
  shuffle_questions: boolean;
  allow_late_entries: boolean;
  participants: string[];
  questions: Question[];
}

export interface Question {
  question_id: string;
  question_text: string;
  options: Option[];
  correct_option_ids: string[];
  marks: number;
}

export interface Option {
  option_id: string;
  text: string;
}

export interface QuizResponse {
  user_id: string;
  quiz_id: string;
  started_at: string;
  responses: {
    question_id: string;
    selected_option_ids: string[];
    time_taken: number;
  }[];
  completed_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  score: number;
  time_taken: number;
}

export interface QuizAnalytics {
  quiz_id: string;
  total_participants: number;
  completed: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  average_time_taken: number;
  question_stats: {
    question_id: string;
    correct_attempts: number;
    incorrect_attempts: number;
    skipped: number;
  }[];
}
