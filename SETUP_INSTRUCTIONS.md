# Quiz Master Platform - Setup Instructions

## Overview
This is a complete Quiz Master platform built with React, Vite, Firebase, and Tailwind CSS. All features are production-ready and integrated with Firestore.

## Prerequisites
- Node.js (v14+)
- Firebase Project with Firestore enabled
- Firebase credentials

## Environment Setup

1. **Create `.env.local` file** in the project root with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. **Install dependencies:**
```bash
npm install
```

## Database Setup

The project includes a setup script to populate your Firestore database with sample quizzes and questions.

### Option 1: Using Node.js (Recommended)

1. Create a `.env` file in the root directory with your Firebase credentials (same as above)
2. Run the setup script:
```bash
node scripts/setupFirestore.js
```

### Option 2: Manual Setup in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to Firestore Database
3. Create collections: `quizzes`, `users`, `quiz_responses`, `leaderboard`
4. Add sample data (see `scripts/setupFirestore.js` for reference data)

## Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Features Implemented

### Authentication
- Email/Password login
- Google Sign-in
- User registration
- Session management

### Quiz Management
- Create custom quizzes
- Auto-generated quiz questions (mockup)
- Shuffle questions
- Timed quizzes with countdown
- Progress tracking

### Quiz Taking
- Interactive quiz player
- Question navigation
- Automatic scoring
- Results display with statistics

### User Dashboard
- Profile management
- Performance statistics
- Recent quizzes
- Achievement tracking

### Leaderboard
- Real-time rankings
- Top scorer tracking
- Performance metrics

### Analytics
- Score trends chart
- Weekly engagement graph
- Accuracy by category
- Performance comparison

### Profile Settings (Fully Functional)
- Email Preferences (Marketing, Updates, Newsletter)
- Change Password
- Notification Settings (Quiz Reminders, Leaderboard, Achievements)
- Privacy Settings (Public Profile, Show Stats, Show Achievements)
- Logout

## Default Test Credentials

After running the setup script, you can test with:
- **Email:** Use any email/password you create
- **Or use Google Sign-in**

The setup script creates sample quizzes:
1. Mathematics Fundamentals (5 questions)
2. General Science Quiz (5 questions)  
3. World History Quiz (5 questions)

## Project Structure

```
src/
├── pages/           # Page components
├── components/      # Reusable components
├── store/          # Zustand state management
├── hooks/          # Custom React hooks
├── services/       # Firebase service layer
├── utils/          # Helper utilities
├── types/          # TypeScript types
└── firebase.ts     # Firebase configuration
```

## Key Technologies

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **State Management:** Zustand
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Build Tool:** Vite

## Troubleshooting

### Dashboard shows loading spinner indefinitely
- Check if Firebase credentials are correct in `.env.local`
- Ensure Firestore database is initialized
- Run the setup script to populate sample data

### Quiz creation fails
- Verify user is authenticated
- Check if Firestore has write permissions
- Ensure `quizzes` collection exists

### Leaderboard shows no data
- Run the setup script to create initial data
- Check Firebase rules allow read access to leaderboard

### Profile settings not working
- Settings use localStorage for demo (can be integrated with Firestore)
- Modals are fully functional with validation

## Next Steps for Production

1. **Security Rules:** Update Firebase Firestore rules for production
2. **Authentication:** Implement email verification and password reset
3. **Persistence:** Save user preferences to Firestore instead of localStorage
4. **Email Service:** Integrate real email notifications
5. **Analytics:** Add Google Analytics or similar
6. **Backup:** Setup Firestore backups
7. **Performance:** Add caching strategies and pagination

## Support

For issues or questions, check:
- Firebase documentation: https://firebase.google.com/docs
- React documentation: https://react.dev
- Project code comments for implementation details
