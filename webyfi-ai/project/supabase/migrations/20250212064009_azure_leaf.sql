/*
  # Initial Schema Setup for Quiz Application

  1. New Tables
    - `quizzes`: Stores quiz metadata
    - `quiz_questions`: Stores questions for each quiz
    - `quiz_responses`: Stores user responses to quizzes
    - `user_profiles`: Stores additional user information

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  quiz_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  time_limit integer NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  start_time timestamptz,
  end_time timestamptz,
  max_participants integer,
  shuffle_questions boolean DEFAULT false,
  allow_late_entries boolean DEFAULT false
);

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  question_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_option_ids text[] NOT NULL,
  marks integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create quiz responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  response_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  quiz_id uuid NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  responses jsonb NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  score integer,
  time_taken integer -- in seconds
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  profile_pic text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for quizzes
CREATE POLICY "Public quizzes are viewable by everyone"
  ON quizzes FOR SELECT
  USING (true);

CREATE POLICY "Teachers can create quizzes"
  ON quizzes FOR INSERT
  TO authenticated
  USING ((SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'teacher');

-- Policies for quiz questions
CREATE POLICY "Questions are viewable with quiz"
  ON quiz_questions FOR SELECT
  USING (true);

-- Policies for quiz responses
CREATE POLICY "Users can view their own responses"
  ON quiz_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit responses"
  ON quiz_responses FOR INSERT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);