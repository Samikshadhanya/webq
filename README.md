# Quiz Master - Online Quiz Platform

A modern, fully-functional online quiz platform built with Next.js, PostgreSQL (Neon), and deployed on Vercel.

## Features

✅ **User Authentication** - Secure registration and login with JWT
✅ **Create Quizzes** - Users can create custom quizzes with multiple questions
✅ **Take Quizzes** - Interactive quiz-taking experience with timer
✅ **Track Progress** - Dashboard with statistics and quiz history
✅ **Leaderboards** - Compete with other users (expandable)
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Beautiful UI** - Dark theme with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT + HTTP-Only Cookies
- **Deployment**: Vercel
- **UI Components**: Lucide Icons, Framer Motion

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL account (free tier available at neon.tech)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd quiz-master
npm install
```

### 2. Setup Database

Create a `.env.local` file with your Neon database URL:

```
POSTGRES_PRISMA_URL=postgresql://user:password@db.neon.tech/dbname
POSTGRES_URL_NON_POOLING=postgresql://user:password@db.neon.tech/dbname
JWT_SECRET=your-secret-key-min-32-chars
```

### 3. Initialize Database

```bash
# Run the seed script to create tables and sample quizzes
npx ts-node scripts/seed.ts
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Default Credentials

- Email: `admin@quizmaster.com`
- Password: `admin123`

## Deployment to Vercel

### Option 1: Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and select your GitHub repository
4. Add environment variables:
   - `POSTGRES_PRISMA_URL` (from Neon)
   - `POSTGRES_URL_NON_POOLING` (from Neon)
   - `JWT_SECRET` (generate a strong random string)
5. Click "Deploy"

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
# Follow the prompts to connect your Neon database
vercel env add POSTGRES_PRISMA_URL
vercel env add POSTGRES_URL_NON_POOLING
vercel env add JWT_SECRET
```

## Project Structure

```
quiz-master/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   └── quizzes/        # Quiz endpoints
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   ├── register/           # Register page
│   ├── quiz/[id]/          # Quiz taking page
│   ├── quizzes/            # Browse quizzes page
│   ├── create-quiz/        # Create quiz page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── lib/
│   └── db.ts              # Database utilities
├── scripts/
│   └── seed.ts            # Database seeding script
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.ts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes` - Create new quiz
- `GET /api/quizzes/[id]` - Get quiz with questions
- `POST /api/quizzes/[id]/submit` - Submit quiz response

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email
- `password` - Hashed password
- `name` - User name
- `created_at` - Creation timestamp

### Quizzes Table
- `id` - Primary key
- `title` - Quiz title
- `description` - Quiz description
- `category` - Quiz category
- `difficulty` - Easy/Medium/Hard
- `time_limit` - Time in seconds
- `created_by` - Creator user ID

### Quiz Questions Table
- `id` - Primary key
- `quiz_id` - Associated quiz
- `question_text` - Question text
- `options` - JSON array of options
- `correct_options` - Array of correct option indices

### Quiz Responses Table
- `id` - Primary key
- `user_id` - User who took quiz
- `quiz_id` - Quiz taken
- `responses` - JSON of user answers
- `score` - Quiz score
- `completed_at` - Completion time

## Security

- Passwords are hashed with bcryptjs
- JWT tokens for session management
- HTTP-Only cookies for token storage
- SQL injection prevention with parameterized queries
- CORS enabled for API access
- Environment variables for sensitive data

## Future Enhancements

- [ ] Email verification
- [ ] Password reset
- [ ] User profiles and avatars
- [ ] Quiz sharing and collaboration
- [ ] Advanced leaderboards with rankings
- [ ] Quiz analytics and insights
- [ ] Category-based filtering
- [ ] Quiz ratings and reviews
- [ ] Bulk quiz import/export
- [ ] Admin dashboard

## Troubleshooting

### Database Connection Issues
1. Verify Neon database URL is correct
2. Check network access is enabled in Neon console
3. Ensure environment variables are set

### Deployment Issues
1. Check Vercel build logs
2. Verify environment variables are set in Vercel dashboard
3. Run `npm run build` locally to test

### Login Issues
1. Ensure database is initialized with `npx ts-node scripts/seed.ts`
2. Try default credentials first
3. Check JWT_SECRET is set and consistent

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the database schema
3. Check browser console for errors
4. Verify environment variables are set

## License

MIT

---

**Happy Quizzing! 🎉**
