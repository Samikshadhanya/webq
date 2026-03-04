# Quiz Master - Complete Online Quiz Platform

A production-ready, fully-featured online quiz platform with real-time analytics, leaderboards, and comprehensive user management.

## Quick Setup (2 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Create `.env.local` with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Setup Firestore Database
```bash
node scripts/setupFirestore.js
```

This creates:
- 3 sample quizzes with 5 questions each
- Demo user profile
- All required Firestore collections
- Fully populated and ready to use

### 4. Run the App
```bash
npm run dev
```

Visit `http://localhost:5173` and start exploring!

---

## 🎯 Features

### User Management
- ✓ Email/Password authentication
- ✓ Google Sign-in integration
- ✓ User registration
- ✓ Profile management
- ✓ Session persistence

### Quiz System
- ✓ Create custom quizzes
- ✓ Auto-generated questions (mockup)
- ✓ Question shuffling
- ✓ Timed quizzes with countdown
- ✓ 5 question categories
- ✓ 3 difficulty levels

### Quiz Taking
- ✓ Interactive quiz player
- ✓ Real-time timer
- ✓ Question navigation
- ✓ Quick jump to any question
- ✓ Automatic scoring
- ✓ Detailed results

### Analytics & Insights
- ✓ Score progression chart
- ✓ Weekly engagement graph
- ✓ Category-wise accuracy
- ✓ Performance trends
- ✓ Time tracking

### Social Features
- ✓ Real-time leaderboard
- ✓ User rankings
- ✓ Top scorer display
- ✓ Performance comparison

### Profile Management
- ✓ Email preferences (marketing, updates, newsletter)
- ✓ Change password with validation
- ✓ Notification settings (reminders, leaderboard, achievements)
- ✓ Privacy controls (public profile, show stats, show achievements)
- ✓ Account settings
- ✓ Logout

### Dashboard
- ✓ Key metrics overview
- ✓ Quizzes taken tracker
- ✓ Average score display
- ✓ Time spent tracking
- ✓ Achievement showcase
- ✓ Available quizzes listing

---

## 📁 Project Structure

```
quiz-master/
├── src/
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Login.tsx       # Authentication
│   │   ├── Register.tsx    # User registration
│   │   ├── QuizList.tsx    # Browse quizzes
│   │   ├── QuizCreate.tsx  # Create quiz
│   │   ├── QuizTake.tsx    # Take quiz
│   │   ├── Leaderboard.tsx # Rankings
│   │   ├── Analytics.tsx   # Statistics
│   │   └── Profile.tsx     # User profile
│   │
│   ├── components/         # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── QuizTimer.tsx
│   │   ├── QuizResults.tsx
│   │   ├── LeaderboardTable.tsx
│   │   ├── PerformanceChart.tsx
│   │   ├── EngagementStats.tsx
│   │   ├── ProfileStats.tsx
│   │   └── UserActivityChart.tsx
│   │
│   ├── services/
│   │   └── firebaseService.ts # Database operations
│   │
│   ├── store/              # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── quizStore.ts
│   │   ├── leaderboardStore.ts
│   │   └── analyticsStore.ts
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useFirestore.ts
│   │   └── useLeaderboardListener.ts
│   │
│   ├── utils/              # Helper functions
│   │   ├── quizHelpers.ts
│   │   └── analyticsHelpers.ts
│   │
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   │
│   ├── App.tsx             # Main app component
│   ├── firebase.ts         # Firebase config
│   └── main.tsx            # Entry point
│
├── scripts/
│   └── setupFirestore.js   # Database initialization
│
├── public/                 # Static assets
├── .env.example           # Environment template
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Build | Vite |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| State Mgmt | Zustand |
| Charts | Recharts |
| Animations | Framer Motion |
| HTTP | Fetch API |

---

## 📊 Database Schema

### `quizzes` Collection
```
{
  quiz_id: string
  title: string
  description: string
  category: string (Science|History|Mathematics|Literature|Geography)
  difficulty: string (Easy|Medium|Hard)
  time_limit: number (seconds)
  created_by: string (user_id)
  created_at: timestamp
  questions: [{
    question_id: string
    text: string
    options: [{id: string, text: string}]
    correct_option_ids: [string]
    explanation: string
  }]
}
```

### `users` Collection
```
{
  user_id: string (Firebase UID)
  name: string
  email: string
  role: string (student|teacher|admin)
  profile_pic: string (URL)
  created_at: timestamp
  last_login: timestamp
}
```

### `quiz_responses` Collection
```
{
  user_id: string
  quiz_id: string
  started_at: timestamp
  completed_at: timestamp
  score: number (0-100)
  time_taken: number (seconds)
  responses: [{
    question_id: string
    selected_option_ids: [string]
    time_taken: number
  }]
}
```

### `leaderboard` Collection
```
{
  user_id: string
  name: string
  score: number
  time_taken: number
  quizzes_completed: number
  average_score: number
  rank: number
  last_updated: timestamp
}
```

---

## 🚀 Getting Started Guide

### Step 1: Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing
3. Enable Firestore Database
4. Enable Authentication (Email/Password + Google)
5. Copy your credentials

### Step 2: Environment Configuration
Create `.env.local` in project root:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=myproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=myproject
VITE_FIREBASE_STORAGE_BUCKET=myproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Step 3: Initialize Database
```bash
# Install dependencies
npm install

# Populate Firestore with sample data
node scripts/setupFirestore.js

# Should see: "Firestore setup completed successfully!"
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Login & Explore
- Open `http://localhost:5173`
- Use email/password or Google Sign-in
- Browse available quizzes
- Take a quiz
- Check analytics and leaderboard
- Manage profile settings

---

## 📝 Sample Quizzes Included

### 1. Mathematics Fundamentals
- **Category**: Mathematics
- **Difficulty**: Medium
- **Questions**: 5
- **Topics**: Arithmetic, Algebra, Geometry
- **Time Limit**: 30 minutes

### 2. General Science Quiz
- **Category**: Science
- **Difficulty**: Medium
- **Questions**: 5
- **Topics**: Physics, Chemistry, Biology
- **Time Limit**: 40 minutes

### 3. World History Quiz
- **Category**: History
- **Difficulty**: Hard
- **Questions**: 5
- **Topics**: Historical events, Famous figures
- **Time Limit**: 40 minutes

---

## 🎮 How to Use

### Creating a Quiz
1. Click "Create Quiz" button
2. Fill in quiz details (title, description, category)
3. Select difficulty and time limit
4. System auto-generates questions
5. Review and confirm
6. Quiz goes live immediately

### Taking a Quiz
1. Browse available quizzes
2. Click "Start Quiz"
3. Answer questions (can go back/forward)
4. Submit when complete
5. View results with score breakdown
6. See time taken and accuracy

### Profile Management
1. Go to Profile page
2. Click settings buttons:
   - **Email Preferences**: Manage subscriptions
   - **Change Password**: Update credentials
   - **Notifications**: Configure alerts
   - **Privacy**: Control data sharing

---

## 🔐 Security Features

- ✓ Firebase Authentication
- ✓ Firestore Security Rules
- ✓ Session management
- ✓ Password hashing (Firebase)
- ✓ HTTPS only
- ✓ CORS protection
- ✓ XSS prevention

---

## 📱 Responsive Design

Works seamlessly on:
- Desktop (1920px+)
- Tablet (768px+)
- Mobile (320px+)

---

## ⚡ Performance

- Vite for fast builds
- React lazy loading
- Firestore indexing
- Optimized bundle size
- Real-time synchronization

---

## 🧪 Testing the Features

### Test Email Preferences
1. Go to Profile
2. Click "Email Preferences"
3. Toggle checkboxes
4. Click "Save"
5. See success message

### Test Change Password
1. Go to Profile
2. Click "Change Password"
3. Enter old/new password
4. Click "Update"
5. See validation

### Test Notifications
1. Go to Profile
2. Click "Notifications"
3. Toggle alert preferences
4. Click "Save"

### Test Privacy Settings
1. Go to Profile
2. Click "Privacy"
3. Control sharing options
4. Click "Save"

---

## 📈 Analytics Features

- Score progression over time
- Weekly engagement tracking
- Category-wise accuracy
- Performance trends
- Time analysis
- Comparative statistics

---

## 🎯 Next Steps for Production

1. **Deploy to Vercel**
   ```bash
   npm run build
   ```
   Then push to GitHub and deploy via Vercel

2. **Add Email Notifications**
   - Firebase Cloud Functions
   - SendGrid or similar service

3. **Implement Real Payments**
   - Stripe integration
   - Subscription plans

4. **Advanced Admin Panel**
   - Quiz management
   - User analytics
   - Content moderation

5. **Mobile App**
   - React Native
   - Offline support

---

## 🐛 Troubleshooting

### Dashboard shows loading spinner
**Solution**: Run `node scripts/setupFirestore.js`

### Quiz list is empty
**Solution**: Ensure quizzes were created in setup script

### Can't login
**Solution**: Check Firebase credentials in .env.local

### Leaderboard shows no data
**Solution**: Complete at least one quiz

### Settings modals not appearing
**Solution**: Ensure Profile page loaded correctly

---

## 📞 Support

For issues:
1. Check SETUP_INSTRUCTIONS.md
2. Review FIREBASE_COLLECTIONS.md
3. Check browser console for errors
4. Verify Firebase credentials

---

## 📄 License

MIT License - Use freely for personal and commercial projects

---

## 🎉 You're All Set!

The Quiz Master platform is now ready to use. All features are fully integrated with Firebase Firestore and production-ready.

Enjoy creating and taking quizzes! 🚀
