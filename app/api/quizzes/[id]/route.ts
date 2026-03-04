import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = parseInt(params.id);

    const quizResult = await sql`
      SELECT * FROM quizzes WHERE id = ${quizId}
    `;

    if (quizResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    const questionsResult = await sql`
      SELECT id, question_text, options FROM quiz_questions WHERE quiz_id = ${quizId}
    `;

    return NextResponse.json({
      ...quizResult.rows[0],
      questions: questionsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
