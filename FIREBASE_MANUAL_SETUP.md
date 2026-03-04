# Firebase Manual Setup Guide

If the automated script doesn't work, follow this manual guide.

## Step 1: Create Collections

Go to Firebase Console → Your Project → Firestore Database

Click "Start collection" and create these collections:
1. `quizzes`
2. `users`
3. `quiz_responses`
4. `leaderboard`

---

## Step 2: Add Sample Quiz Documents

### Add First Quiz

**Collection:** `quizzes`
**Document ID:** Leave as auto-generated or use `quiz_001`

**Content:**
```json
{
  "quiz_id": "quiz_001",
  "title": "Mathematics Fundamentals",
  "description": "Test your basic math skills including algebra, geometry, and arithmetic",
  "category": "Mathematics",
  "difficulty": "Medium",
  "time_limit": 1800,
  "created_by": "demo_user",
  "created_at": "2024-03-04T00:00:00.000Z",
  "end_time": "2024-04-04T00:00:00.000Z",
  "max_participants": 100,
  "shuffle_questions": true,
  "allow_late_entries": false,
  "participants": [],
  "questions": [
    {
      "question_id": "q1",
      "text": "What is the value of 15 × 12?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "180"},
        {"id": "opt2", "text": "190"},
        {"id": "opt3", "text": "160"},
        {"id": "opt4", "text": "200"}
      ],
      "correct_option_ids": ["opt1"],
      "explanation": "15 × 12 = 180. This is a basic multiplication problem."
    },
    {
      "question_id": "q2",
      "text": "What is the square root of 144?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "10"},
        {"id": "opt2", "text": "12"},
        {"id": "opt3", "text": "14"},
        {"id": "opt4", "text": "16"}
      ],
      "correct_option_ids": ["opt2"],
      "explanation": "√144 = 12 because 12 × 12 = 144"
    },
    {
      "question_id": "q3",
      "text": "If x + 5 = 12, what is the value of x?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "5"},
        {"id": "opt2", "text": "7"},
        {"id": "opt3", "text": "17"},
        {"id": "opt4", "text": "2"}
      ],
      "correct_option_ids": ["opt2"],
      "explanation": "x = 12 - 5 = 7"
    },
    {
      "question_id": "q4",
      "text": "What is 25% of 200?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "25"},
        {"id": "opt2", "text": "50"},
        {"id": "opt3", "text": "75"},
        {"id": "opt4", "text": "100"}
      ],
      "correct_option_ids": ["opt2"],
      "explanation": "25% of 200 = 0.25 × 200 = 50"
    },
    {
      "question_id": "q5",
      "text": "What is the area of a rectangle with length 10 and width 5?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "15"},
        {"id": "opt2", "text": "30"},
        {"id": "opt3", "text": "50"},
        {"id": "opt4", "text": "100"}
      ],
      "correct_option_ids": ["opt3"],
      "explanation": "Area = length × width = 10 × 5 = 50"
    }
  ]
}
```

---

### Add Second Quiz

**Collection:** `quizzes`
**Document ID:** Leave as auto-generated or use `quiz_002`

**Content:**
```json
{
  "quiz_id": "quiz_002",
  "title": "General Science Quiz",
  "description": "Explore basic concepts in physics, chemistry, and biology",
  "category": "Science",
  "difficulty": "Medium",
  "time_limit": 2400,
  "created_by": "demo_user",
  "created_at": "2024-03-04T00:00:00.000Z",
  "end_time": "2024-04-04T00:00:00.000Z",
  "max_participants": 100,
  "shuffle_questions": true,
  "allow_late_entries": false,
  "participants": [],
  "questions": [
    {
      "question_id": "q1",
      "text": "What is the chemical symbol for Gold?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "Go"},
        {"id": "opt2", "text": "Au"},
        {"id": "opt3", "text": "Gd"},
        {"id": "opt4", "text": "Ag"}
      ],
      "correct_option_ids": ["opt2"],
      "explanation": "The chemical symbol for Gold is Au, derived from its Latin name 'Aurum'"
    },
    {
      "question_id": "q2",
      "text": "What is the powerhouse of the cell?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "Nucleus"},
        {"id": "opt2", "text": "Mitochondria"},
        {"id": "opt3", "text": "Chloroplast"},
        {"id": "opt4", "text": "Ribosome"}
      ],
      "correct_option_ids": ["opt2"],
      "explanation": "The mitochondria is known as the powerhouse of the cell because it produces energy in the form of ATP"
    },
    {
      "question_id": "q3",
      "text": "What is the SI unit of force?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "Kilogram"},
        {"id": "opt2", "text": "Newton"},
        {"id": "opt3", "text": "Joule"},
        {"id": "opt4", "text": "Pascal"}
      ],
      "correct_option_ids": ["opt2"],
      "explanation": "The Newton (N) is the SI unit of force"
    },
    {
      "question_id": "q4",
      "text": "What is the process by which plants make their own food?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "Respiration"},
        {"id": "opt2", "text": "Fermentation"},
        {"id": "opt3", "text": "Photosynthesis"},
        {"id": "opt4", "text": "Digestion"}
      ],
      "correct_option_ids": ["opt3"],
      "explanation": "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy"
    },
    {
      "question_id": "q5",
      "text": "What is the most abundant element in the universe?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "Oxygen"},
        {"id": "opt2", "text": "Hydrogen"},
        {"id": "opt3", "text": "Carbon"},
        {"id": "opt4", "text": "Nitrogen"}
      ],
      "correct_option_ids": ["opt2"],
      "explanation": "Hydrogen is the most abundant element in the universe"
    }
  ]
}
```

---

### Add Third Quiz

**Collection:** `quizzes`
**Document ID:** Leave as auto-generated or use `quiz_003`

**Content:**
```json
{
  "quiz_id": "quiz_003",
  "title": "World History Quiz",
  "description": "Test your knowledge of important historical events and figures",
  "category": "History",
  "difficulty": "Hard",
  "time_limit": 2400,
  "created_by": "demo_user",
  "created_at": "2024-03-04T00:00:00.000Z",
  "end_time": "2024-04-04T00:00:00.000Z",
  "max_participants": 100,
  "shuffle_questions": true,
  "allow_late_entries": false,
  "participants": [],
  "questions": [
    {
      "question_id": "q1",
      "text": "In which year did World War II end?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "1943"},
        {"id": "opt2", "text": "1944"},
        {"id": "opt3", "text": "1945"},
        {"id": "opt4", "text": "1946"}
      ],
      "correct_option_ids": ["opt3"],
      "explanation": "World War II ended in 1945 with the surrender of Japan in September"
    },
    {
      "question_id": "q2",
      "text": "Who was the first President of the United States?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "Thomas Jefferson"},
        {"id": "opt2", "text": "George Washington"},
        {"id": "opt3", "text": "John Adams"},
        {"id": "opt4", "text": "Benjamin Franklin"}
      ],
      "correct_option_ids": ["opt2"],
      "explanation": "George Washington was the first President of the United States, serving from 1789 to 1797"
    },
    {
      "question_id": "q3",
      "text": "What year did the Berlin Wall fall?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "1987"},
        {"id": "opt2", "text": "1988"},
        {"id": "opt3", "text": "1989"},
        {"id": "opt4", "text": "1990"}
      ],
      "correct_option_ids": ["opt3"],
      "explanation": "The Berlin Wall fell on November 9, 1989"
    },
    {
      "question_id": "q4",
      "text": "The Great Wall of China was built primarily to protect against invasions from which direction?",
      "difficulty": "Medium",
      "options": [
        {"id": "opt1", "text": "South"},
        {"id": "opt2", "text": "North"},
        {"id": "opt3", "text": "East"},
        {"id": "opt4", "text": "West"}
      ],
      "correct_option_ids": ["opt2"],
      "explanation": "The Great Wall of China was built to protect against invasions from the north, particularly from Mongol tribes"
    },
    {
      "question_id": "q5",
      "text": "Who wrote the Declaration of Independence?",
      "difficulty": "Easy",
      "options": [
        {"id": "opt1", "text": "George Washington"},
        {"id": "opt2", "text": "Benjamin Franklin"},
        {"id": "opt3", "text": "Thomas Jefferson"},
        {"id": "opt4", "text": "John Adams"}
      ],
      "correct_option_ids": ["opt3"],
      "explanation": "Thomas Jefferson was the primary author of the Declaration of Independence, adopted on July 4, 1776"
    }
  ]
}
```

---

## Step 3: Create Demo User

**Collection:** `users`
**Document ID:** `demo_user`

**Content:**
```json
{
  "user_id": "demo_user",
  "name": "Demo User",
  "email": "demo@example.com",
  "role": "student",
  "profile_pic": "https://via.placeholder.com/128",
  "created_at": "2024-03-04T00:00:00.000Z",
  "last_login": "2024-03-04T00:00:00.000Z"
}
```

---

## Step 4: Leave Other Collections Empty

**quiz_responses**: Leave empty (will be populated when users take quizzes)
**leaderboard**: Leave empty (will be updated when quizzes are completed)

---

## Step 5: Test in Firestore Console

1. Go to Firestore Database
2. You should see:
   - `quizzes` collection with 3 documents
   - `users` collection with 1 document (demo_user)
   - `quiz_responses` collection (empty)
   - `leaderboard` collection (empty)

3. Click on each quiz to verify questions are present

---

## Step 6: Add Firestore Security Rules (Optional)

In Firebase Console → Firestore Database → Rules tab

Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Everyone can read quizzes
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.created_by;
    }
    
    // Users can read/write their own responses
    match /quiz_responses/{responseId} {
      allow read, write: if request.auth.uid == resource.data.user_id;
    }
    
    // Everyone can read leaderboard
    match /leaderboard/{userId} {
      allow read: if request.auth != null;
    }
  }
}
```

---

## Step 7: Verify Setup

1. Run: `npm run dev`
2. Navigate to http://localhost:5173
3. Log in with email/password or Google
4. Check if quizzes appear in the quiz list
5. Try taking a quiz
6. Check if results save properly

---

## Notes

- Each field in Firestore must match the exact names shown above (case-sensitive)
- Timestamps should be in ISO 8601 format: "2024-03-04T00:00:00.000Z"
- Arrays must have the correct structure: options with `id` and `text`
- The `created_by` field should match a valid user_id

---

## If You Get Stuck

Use the automated script instead:
```bash
node scripts/setupFirestore.js
```

This does everything automatically!
