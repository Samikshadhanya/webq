import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// Get all quizzes
export async function GET() {
  try {
    const result = await sql`
      SELECT q.*, u.name as creator_name FROM quizzes q
      LEFT JOIN users u ON q.created_by = u.id
      ORDER BY q.created_at DESC
    `;
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

// Create a quiz
export async function POST(request: NextRequest) {
  try {
    const { title, description, category, difficulty, timeLimit, userId, questions } = await request.json();

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

    return NextResponse.json(
      { quiz_id: quizId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}
