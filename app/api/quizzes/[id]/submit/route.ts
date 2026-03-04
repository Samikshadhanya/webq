import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = parseInt(params.id);
    const { userId, responses, score } = await request.json();

    const result = await sql`
      INSERT INTO quiz_responses (user_id, quiz_id, responses, score, completed_at)
      VALUES (${userId}, ${quizId}, ${JSON.stringify(responses)}, ${score}, NOW())
      RETURNING id
    `;

    return NextResponse.json(
      { response_id: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
