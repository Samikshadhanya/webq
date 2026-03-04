import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create tables
    console.log('📋 Creating tables...');
    
    await sql`
      DROP TABLE IF EXISTS quiz_responses CASCADE;
    `;
    
    await sql`
      DROP TABLE IF EXISTS quiz_questions CASCADE;
    `;
    
    await sql`
      DROP TABLE IF EXISTS quizzes CASCADE;
    `;
    
    await sql`
      DROP TABLE IF EXISTS users CASCADE;
    `;

    await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        profile_pic VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE quizzes (
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

    await sql`
      CREATE TABLE quiz_questions (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_options INTEGER[] NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      )
    `;

    await sql`
      CREATE TABLE quiz_responses (
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

    console.log('✅ Tables created');

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const userResult = await sql`
      INSERT INTO users (email, password, name)
      VALUES ('admin@quizmaster.com', ${hashedPassword}, 'Admin User')
      RETURNING id
    `;

    const adminId = userResult.rows[0].id;
    console.log('✅ Admin user created');

    // Create sample quizzes
    console.log('📝 Creating sample quizzes...');

    const quizzes = [
      {
        title: 'General Knowledge - Easy',
        description: 'Test your general knowledge with easy questions',
        category: 'General Knowledge',
        difficulty: 'Easy',
        questions: [
          {
            text: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
            correctOptions: [2],
          },
          {
            text: 'Which planet is the largest in our solar system?',
            options: ['Saturn', 'Jupiter', 'Neptune', 'Mars'],
            correctOptions: [1],
          },
          {
            text: 'What is the smallest country in the world?',
            options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
            correctOptions: [1],
          },
          {
            text: 'Which ocean is the deepest?',
            options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
            correctOptions: [3],
          },
          {
            text: 'What is the chemical symbol for gold?',
            options: ['Go', 'Gd', 'Au', 'Ag'],
            correctOptions: [2],
          },
        ],
      },
      {
        title: 'Science Basics - Medium',
        description: 'Challenge your scientific knowledge',
        category: 'Science',
        difficulty: 'Medium',
        questions: [
          {
            text: 'What is the speed of light?',
            options: ['3×10^8 m/s', '2×10^8 m/s', '4×10^8 m/s', '1×10^8 m/s'],
            correctOptions: [0],
          },
          {
            text: 'How many bones are in the adult human body?',
            options: ['186', '206', '226', '246'],
            correctOptions: [1],
          },
          {
            text: 'What is the most abundant element in the universe?',
            options: ['Oxygen', 'Hydrogen', 'Carbon', 'Nitrogen'],
            correctOptions: [1],
          },
          {
            text: 'What is the SI unit of force?',
            options: ['Joule', 'Watt', 'Newton', 'Pascal'],
            correctOptions: [2],
          },
          {
            text: 'At what temperature does water freeze?',
            options: ['273 K', '273 °C', '0 K', '100 K'],
            correctOptions: [0],
          },
        ],
      },
      {
        title: 'History Challenge - Hard',
        description: 'Prove your historical expertise',
        category: 'History',
        difficulty: 'Hard',
        questions: [
          {
            text: 'In what year did the Berlin Wall fall?',
            options: ['1987', '1989', '1991', '1993'],
            correctOptions: [1],
          },
          {
            text: 'Who was the first Emperor of Rome?',
            options: ['Julius Caesar', 'Augustus', 'Nero', 'Tiberius'],
            correctOptions: [1],
          },
          {
            text: 'What year did the Titanic sink?',
            options: ['1912', '1915', '1920', '1925'],
            correctOptions: [0],
          },
          {
            text: 'Which ancient wonder of the world still stands?',
            options: ['Colossus of Rhodes', 'Great Pyramid of Giza', 'Hanging Gardens', 'Lighthouse of Alexandria'],
            correctOptions: [1],
          },
          {
            text: 'In what year did World War II end?',
            options: ['1944', '1945', '1946', '1947'],
            correctOptions: [1],
          },
        ],
      },
    ];

    for (const quiz of quizzes) {
      const quizResult = await sql`
        INSERT INTO quizzes (title, description, category, difficulty, created_by, time_limit)
        VALUES (${quiz.title}, ${quiz.description}, ${quiz.category}, ${quiz.difficulty}, ${adminId}, 1800)
        RETURNING id
      `;

      const quizId = quizResult.rows[0].id;

      for (const question of quiz.questions) {
        await sql`
          INSERT INTO quiz_questions (quiz_id, question_text, options, correct_options)
          VALUES (
            ${quizId},
            ${question.text},
            ${JSON.stringify(question.options)},
            ${JSON.stringify(question.correctOptions)}
          )
        `;
      }
    }

    console.log('✅ Sample quizzes created');
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
