# Firebase Firestore Collections Setup Guide

## Quick Start - Run This Script

If Node.js is installed, run:
```bash
node scripts/setupFirestore.js
```

This automatically creates all collections and adds sample data.

---

## Manual Setup (If script doesn't work)

### Step 1: Create Collections in Firebase Console

Go to [Firebase Console](https://console.firebase.google.com) → Your Project → Firestore Database

Create these 4 collections:

1. `quizzes`
2. `users`
3. `quiz_responses`
4. `leaderboard`

---

## Collection 1: `quizzes`

Create a new document for each quiz.

### Document ID: `auto_id` (or custom)

### Sample Document Structure:

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
      "options": [
        { "id": "opt1", "text": "180" },
        { "id": "opt2", "text": "190" },
        { "id": "opt3", "text": "160" },
        { "id": "opt4", "text": "200" }
      ],
      "correct_option_ids": ["opt1"],
      "explanation": "15 × 12 = 180. This is a basic multiplication problem.",
      "difficulty": "Easy"
    },
    {
      "question_id": "q2",
      "text": "What is the square root of 144?",
      "options": [
        { "id": "opt1", "text": "10" },
        { "id": "opt2", "text": "12" },
        { "id": "opt3", "text": "14" },
        { "id": "opt4", "text": "16" }
      ],
      "correct_option_ids": ["opt2"],
      "explanation": "√144 = 12 because 12 × 12 = 144",
      "difficulty": "Easy"
    }
  ]
}
```

### Add More Quizzes:

Create additional documents for:
- General Science Quiz (Science)
- World History Quiz (History)
- Or any other topics you want

---

## Collection 2: `users`

Create documents with user profiles.

### Document ID: Use Firebase Auth UID (or custom ID)

### Sample Document Structure:

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

### Notes:
- `user_id` must match Firebase Auth UID when users register
- `profile_pic` can be any image URL
- `role` can be: "student", "teacher", "admin"

---

## Collection 3: `quiz_responses`

Records user quiz attempts.

### Document ID: `auto_id` (Firebase auto-generates)

### Sample Document Structure:

```json
{
  "user_id": "demo_user",
  "quiz_id": "quiz_001",
  "started_at": "2024-03-04T10:00:00.000Z",
  "completed_at": "2024-03-04T10:15:30.000Z",
  "score": 85,
  "time_taken": 930,
  "responses": [
    {
      "question_id": "q1",
      "selected_option_ids": ["opt1"],
      "time_taken": 45
    },
    {
      "question_id": "q2",
      "selected_option_ids": ["opt2"],
      "time_taken": 52
    }
  ]
}
```

### Notes:
- `score` is calculated as percentage (0-100)
- `time_taken` is in seconds
- `responses` array contains user's answers
- Multiple documents allowed per user (for each quiz attempt)

---

## Collection 4: `leaderboard`

Aggregated user scores for ranking.

### Document ID: `user_id` (same as users collection)

### Sample Document Structure:

```json
{
  "user_id": "demo_user",
  "name": "Demo User",
  "email": "demo@example.com",
  "score": 850,
  "time_taken": 3600,
  "quizzes_completed": 5,
  "average_score": 85,
  "rank": 1,
  "last_updated": "2024-03-04T10:30:00.000Z"
}
```

### Notes:
- Rank is calculated dynamically
- Can be updated via Cloud Functions or manually
- Score = sum of all quiz scores
- average_score = total_score / quizzes_completed

---

## Data Types Reference

| Field | Type | Example |
|-------|------|---------|
| quiz_id | String | "quiz_001" |
| title | String | "Math Quiz" |
| time_limit | Number | 1800 (seconds) |
| participants | Array | [] or ["user1", "user2"] |
| shuffle_questions | Boolean | true |
| created_at | String (ISO 8601) | "2024-03-04T00:00:00.000Z" |
| options | Array of Objects | [{ id: "opt1", text: "Answer" }] |
| correct_option_ids | Array | ["opt1"] |
| score | Number | 85 |

---

## Firestore Rules (Security)

Add these rules to Firestore for basic security:

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

## Automated Setup Script

Instead of manual creation, use the provided script:

```bash
# Make sure you have Node.js installed
node scripts/setupFirestore.js
```

This script:
- ✓ Connects to your Firebase project
- ✓ Creates all collections
- ✓ Adds 3 sample quizzes
- ✓ Creates a demo user profile
- ✓ Outputs confirmation messages

---

## Categories Available

Use these for quiz categories:
- Science
- History
- Mathematics
- Literature
- Geography

(You can add more if needed)

---

## Difficulty Levels

Standard levels:
- Easy
- Medium
- Hard

---

## Time Limits (in seconds)

Common durations:
- 10 minutes = 600 seconds
- 20 minutes = 1200 seconds
- 30 minutes = 1800 seconds
- 60 minutes = 3600 seconds

---

## Testing the Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click "Firestore Database"
4. Check if these collections exist:
   - quizzes (with sample quizzes)
   - users (with demo user)
   - quiz_responses (empty initially)
   - leaderboard (empty initially)

5. Run the app:
   ```bash
   npm run dev
   ```

6. Log in and verify quizzes load from Firestore

---

## Troubleshooting

**Collections not appearing?**
- Refresh Firebase Console
- Check project connection in setupFirestore.js
- Verify .env credentials are correct

**Quiz not loading in app?**
- Verify collection name is lowercase: "quizzes"
- Check document structure matches schema
- Ensure quiz_id field exists in document

**Empty leaderboard?**
- Leaderboard updates when quiz_responses are created
- Take a quiz to trigger leaderboard update
- Or manually add test data using Firebase Console

**Authentication errors?**
- Enable Email/Password auth in Firebase Console
- Enable Google Sign-in in Firebase Console
- Check .env credentials match project

---

## Production Considerations

1. **Backup Data**: Use Firebase's automated backups
2. **Index Queries**: Firebase suggests indexes automatically
3. **Scale**: Firestore handles millions of documents
4. **Cost**: Monitor read/write operations in Firebase Console
5. **Archival**: Archive old quiz_responses to reduce costs
