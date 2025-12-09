# Geek Fortune

A retro-style quiz game application that tests your knowledge of pop culture across videogames, music, and movies.

## 🎮 Live Demo

**Deployed Site**: [geekfortune-52ia0f70h-omuraisus-projects.vercel.app](geekfortune-52ia0f70h-omuraisus-projects.vercel.app)

## 🗄️ Database

**Supabase Dashboard**: [View Database](https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/editor/17451?schema=public)

## 📁 Project Structure

```
geek-fortune-project/
├── src/
│   ├── components/          # React components
│   │   ├── LoginPage.tsx    # Authentication
│   │   ├── MainMenu.tsx     # Main navigation
│   │   ├── GamePage.tsx     # Quiz game
│   │   ├── Leaderboard.tsx  # Score rankings
│   │   ├── Profile.tsx      # User statistics
│   │   ├── PixelBackground.tsx
│   │   └── MusicPlayer.tsx
│   ├── lib/                 # Utilities
│   │   ├── supabase.ts      # Database client
│   │   └── password.ts      # Password hashing
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── setup_new_supabase.sql   # Database schema
├── vercel.json              # Deployment config
└── vite.config.ts           # Build config
```

## 🚀 Features

- User registration and authentication
- Quiz game with 100 questions (30 movies, 40 videogames, 30 music)
- Real-time score tracking
- Global leaderboard
- User profiles with achievements
- Pixel-art retro UI design
- Background music player
- Responsive mobile design

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel

## 📦 Installation

```bash
npm install
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📝 Environment Variables

Create a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 How It Works

1. **Authentication**: Users register/login with username and password
2. **Gameplay**: Each game consists of 10 randomly selected questions
3. **Scoring**: 100 points per correct answer
4. **Leaderboard**: Top 10 scores displayed globally
5. **Profile**: Track games played, best score, and achievements

## 🗃️ Database Schema

- **users**: User accounts with statistics
- **leaderboard**: Game score entries

See `setup_new_supabase.sql` for complete schema.

## 🚢 Deployment

The project is configured for Vercel deployment. Push to main branch to trigger automatic deployment.

