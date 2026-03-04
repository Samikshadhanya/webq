import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample quiz data
const sampleQuizzes = [
  {
    title: 'Mathematics Fundamentals',
    description: 'Test your basic math skills including algebra, geometry, and arithmetic',
    category: 'Mathematics',
    difficulty: 'Medium',
    time_limit: 1800,
    created_by: 'demo_user',
    shuffle_questions: true,
    allow_late_entries: false,
    max_participants: 100,
    participants: [],
    created_at: new Date().toISOString(),
    end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    questions: [
      {
        question_id: 'q1',
        text: 'What is the value of 15 × 12?',
        options: [
          { id: 'opt1', text: '180' },
          { id: 'opt2', text: '190' },
          { id: 'opt3', text: '160' },
          { id: 'opt4', text: '200' },
        ],
        correct_option_ids: ['opt1'],
        explanation: '15 × 12 = 180. This is a basic multiplication problem.',
        difficulty: 'Easy',
      },
      {
        question_id: 'q2',
        text: 'What is the square root of 144?',
        options: [
          { id: 'opt1', text: '10' },
          { id: 'opt2', text: '12' },
          { id: 'opt3', text: '14' },
          { id: 'opt4', text: '16' },
        ],
        correct_option_ids: ['opt2'],
        explanation: '√144 = 12 because 12 × 12 = 144',
        difficulty: 'Easy',
      },
      {
        question_id: 'q3',
        text: 'If x + 5 = 12, what is the value of x?',
        options: [
          { id: 'opt1', text: '5' },
          { id: 'opt2', text: '7' },
          { id: 'opt3', text: '17' },
          { id: 'opt4', text: '2' },
        ],
        correct_option_ids: ['opt2'],
        explanation: 'x = 12 - 5 = 7',
        difficulty: 'Easy',
      },
      {
        question_id: 'q4',
        text: 'What is 25% of 200?',
        options: [
          { id: 'opt1', text: '25' },
          { id: 'opt2', text: '50' },
          { id: 'opt3', text: '75' },
          { id: 'opt4', text: '100' },
        ],
        correct_option_ids: ['opt2'],
        explanation: '25% of 200 = 0.25 × 200 = 50',
        difficulty: 'Easy',
      },
      {
        question_id: 'q5',
        text: 'What is the area of a rectangle with length 10 and width 5?',
        options: [
          { id: 'opt1', text: '15' },
          { id: 'opt2', text: '30' },
          { id: 'opt3', text: '50' },
          { id: 'opt4', text: '100' },
        ],
        correct_option_ids: ['opt3'],
        explanation: 'Area = length × width = 10 × 5 = 50',
        difficulty: 'Easy',
      },
    ],
  },
  {
    title: 'General Science Quiz',
    description: 'Explore basic concepts in physics, chemistry, and biology',
    category: 'Science',
    difficulty: 'Medium',
    time_limit: 2400,
    created_by: 'demo_user',
    shuffle_questions: true,
    allow_late_entries: false,
    max_participants: 100,
    participants: [],
    created_at: new Date().toISOString(),
    end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    questions: [
      {
        question_id: 'q1',
        text: 'What is the chemical symbol for Gold?',
        options: [
          { id: 'opt1', text: 'Go' },
          { id: 'opt2', text: 'Au' },
          { id: 'opt3', text: 'Gd' },
          { id: 'opt4', text: 'Ag' },
        ],
        correct_option_ids: ['opt2'],
        explanation: 'The chemical symbol for Gold is Au, derived from its Latin name "Aurum"',
        difficulty: 'Easy',
      },
      {
        question_id: 'q2',
        text: 'What is the powerhouse of the cell?',
        options: [
          { id: 'opt1', text: 'Nucleus' },
          { id: 'opt2', text: 'Mitochondria' },
          { id: 'opt3', text: 'Chloroplast' },
          { id: 'opt4', text: 'Ribosome' },
        ],
        correct_option_ids: ['opt2'],
        explanation: 'The mitochondria is known as the powerhouse of the cell because it produces energy in the form of ATP',
        difficulty: 'Easy',
      },
      {
        question_id: 'q3',
        text: 'What is the SI unit of force?',
        options: [
          { id: 'opt1', text: 'Kilogram' },
          { id: 'opt2', text: 'Newton' },
          { id: 'opt3', text: 'Joule' },
          { id: 'opt4', text: 'Pascal' },
        ],
        correct_option_ids: ['opt2'],
        explanation: 'The Newton (N) is the SI unit of force',
        difficulty: 'Easy',
      },
      {
        question_id: 'q4',
        text: 'What is the process by which plants make their own food?',
        options: [
          { id: 'opt1', text: 'Respiration' },
          { id: 'opt2', text: 'Fermentation' },
          { id: 'opt3', text: 'Photosynthesis' },
          { id: 'opt4', text: 'Digestion' },
        ],
        correct_option_ids: ['opt3'],
        explanation: 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy',
        difficulty: 'Easy',
      },
      {
        question_id: 'q5',
        text: 'What is the most abundant element in the universe?',
        options: [
          { id: 'opt1', text: 'Oxygen' },
          { id: 'opt2', text: 'Hydrogen' },
          { id: 'opt3', text: 'Carbon' },
          { id: 'opt4', text: 'Nitrogen' },
        ],
        correct_option_ids: ['opt2'],
        explanation: 'Hydrogen is the most abundant element in the universe',
        difficulty: 'Easy',
      },
    ],
  },
  {
    title: 'World History Quiz',
    description: 'Test your knowledge of important historical events and figures',
    category: 'History',
    difficulty: 'Hard',
    time_limit: 2400,
    created_by: 'demo_user',
    shuffle_questions: true,
    allow_late_entries: false,
    max_participants: 100,
    participants: [],
    created_at: new Date().toISOString(),
    end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    questions: [
      {
        question_id: 'q1',
        text: 'In which year did World War II end?',
        options: [
          { id: 'opt1', text: '1943' },
          { id: 'opt2', text: '1944' },
          { id: 'opt3', text: '1945' },
          { id: 'opt4', text: '1946' },
        ],
        correct_option_ids: ['opt3'],
        explanation: 'World War II ended in 1945 with the surrender of Japan in September',
        difficulty: 'Easy',
      },
      {
        question_id: 'q2',
        text: 'Who was the first President of the United States?',
        options: [
          { id: 'opt1', text: 'Thomas Jefferson' },
          { id: 'opt2', text: 'George Washington' },
          { id: 'opt3', text: 'John Adams' },
          { id: 'opt4', text: 'Benjamin Franklin' },
        ],
        correct_option_ids: ['opt2'],
        explanation: 'George Washington was the first President of the United States, serving from 1789 to 1797',
        difficulty: 'Easy',
      },
      {
        question_id: 'q3',
        text: 'What year did the Berlin Wall fall?',
        options: [
          { id: 'opt1', text: '1987' },
          { id: 'opt2', text: '1988' },
          { id: 'opt3', text: '1989' },
          { id: 'opt4', text: '1990' },
        ],
        correct_option_ids: ['opt3'],
        explanation: 'The Berlin Wall fell on November 9, 1989',
        difficulty: 'Easy',
      },
      {
        question_id: 'q4',
        text: 'The Great Wall of China was built primarily to protect against invasions from which direction?',
        options: [
          { id: 'opt1', text: 'South' },
          { id: 'opt2', text: 'North' },
          { id: 'opt3', text: 'East' },
          { id: 'opt4', text: 'West' },
        ],
        correct_option_ids: ['opt2'],
        explanation: 'The Great Wall of China was built to protect against invasions from the north, particularly from Mongol tribes',
        difficulty: 'Medium',
      },
      {
        question_id: 'q5',
        text: 'Who wrote the Declaration of Independence?',
        options: [
          { id: 'opt1', text: 'George Washington' },
          { id: 'opt2', text: 'Benjamin Franklin' },
          { id: 'opt3', text: 'Thomas Jefferson' },
          { id: 'opt4', text: 'John Adams' },
        ],
        correct_option_ids: ['opt3'],
        explanation: 'Thomas Jefferson was the primary author of the Declaration of Independence, adopted on July 4, 1776',
        difficulty: 'Easy',
      },
    ],
  },
];

async function setupFirestore() {
  try {
    console.log('Starting Firestore setup...');
    
    const batch = writeBatch(db);
    
    // Add quizzes
    for (const quiz of sampleQuizzes) {
      const quizRef = doc(collection(db, 'quizzes'));
      batch.set(quizRef, {
        ...quiz,
        quiz_id: quizRef.id,
      });
      console.log(`Added quiz: ${quiz.title}`);
    }
    
    // Create demo user profile
    const demoUserRef = doc(db, 'users', 'demo_user');
    batch.set(demoUserRef, {
      user_id: 'demo_user',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'student',
      profile_pic: 'https://via.placeholder.com/128',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    });
    console.log('Added demo user profile');
    
    // Commit batch
    await batch.commit();
    console.log('Firestore setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up Firestore:', error);
    process.exit(1);
  }
}

setupFirestore();
