import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        profile_pic VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create quizzes table
    await sql`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        difficulty VARCHAR(50) NOT NULL,
        time_limit INTEGER DEFAULT 1800,
        created_by INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `;

    // Create quiz questions table
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_options INTEGER[] NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
      )
    `;

    // Create quiz responses table
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_responses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        quiz_id INTEGER NOT NULL,
        responses JSONB NOT NULL,
        score INTEGER,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Get all quizzes
export async function getQuizzes() {
  try {
    const result = await sql`
      SELECT * FROM quizzes ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
}

// Get quiz with questions
export async function getQuizWithQuestions(quizId: number) {
  try {
    const quizResult = await sql`
      SELECT * FROM quizzes WHERE id = ${quizId}
    `;
    
    if (quizResult.rows.length === 0) return null;

    const questionsResult = await sql`
      SELECT * FROM quiz_questions WHERE quiz_id = ${quizId}
    `;

    return {
      ...quizResult.rows[0],
      questions: questionsResult.rows,
    };
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return null;
  }
}

// Create quiz
export async function createQuiz(data: any) {
  try {
    const { title, description, category, difficulty, timeLimit, userId, questions } = data;
    
    const quizResult = await sql`
      INSERT INTO quizzes (title, description, category, difficulty, time_limit, created_by)
      VALUES (${title}, ${description}, ${category}, ${difficulty}, ${timeLimit}, ${userId})
      RETURNING id
    `;

    const quizId = quizResult.rows[0].id;

    // Insert questions
    for (const q of questions) {
      await sql`
        INSERT INTO quiz_questions (quiz_id, question_text, options, correct_options)
        VALUES (${quizId}, ${q.text}, ${JSON.stringify(q.options)}, ${JSON.stringify(q.correctOptions)})
      `;
    }

    return quizId;
  } catch (error) {
    console.error('Error creating quiz:', error);
    return null;
  }
}

// Submit quiz response
export async function submitQuizResponse(userId: number, quizId: number, responses: any, score: number) {
  try {
    const result = await sql`
      INSERT INTO quiz_responses (user_id, quiz_id, responses, score, completed_at)
      VALUES (${userId}, ${quizId}, ${JSON.stringify(responses)}, ${score}, NOW())
      RETURNING id
    `;
    return result.rows[0].id;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return null;
  }
}

// Get user stats
export async function getUserStats(userId: number) {
  try {
    const result = await sql`
      SELECT 
        COUNT(*) as total_quizzes,
        AVG(score) as average_score,
        MAX(score) as max_score
      FROM quiz_responses
      WHERE user_id = ${userId}
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}
