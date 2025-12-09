# Geek Fortune - Complete Code Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Files Explanation](#core-files-explanation)
6. [Supabase Database Integration](#supabase-database-integration)
7. [Vercel Deployment](#vercel-deployment)
8. [Application Flow](#application-flow)
9. [Component Details](#component-details)
10. [Styling System](#styling-system)

---

## Project Overview

Geek Fortune is a retro-style quiz game application that tests players' knowledge of pop culture across three categories: videogames, music, and movies. The application features user authentication, score tracking, leaderboards, and a pixel-art aesthetic inspired by classic arcade games.

### Key Features
- User registration and login with password hashing
- Quiz game with 10 questions per session (3 movies, 4 videogames, 3 music)
- Real-time score tracking and statistics
- Global leaderboard system
- User profiles with achievements
- Pixel-art retro UI design
- Background music player
- Responsive design for mobile devices

---

## Architecture

The application follows a **Single Page Application (SPA)** architecture using React with TypeScript. The state management is handled through React hooks (useState, useEffect), and data persistence is managed through Supabase (PostgreSQL database).

### Application Flow
```
User → Login/Register → Main Menu → Game/Leaderboard/Profile → Back to Menu
```

### State Management
- **Local State**: React hooks (useState) for component-level state
- **Persistent State**: Supabase database for user data and leaderboard
- **Session State**: localStorage for user ID persistence across page reloads

---

## Technology Stack

### Frontend
- **React 18.3.1**: UI library
- **TypeScript**: Type safety
- **Vite 6.3.5**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library

### Backend & Database
- **Supabase**: Backend-as-a-Service (BaaS)
  - PostgreSQL database
  - Row Level Security (RLS)
  - RESTful API

### Deployment
- **Vercel**: Hosting platform
  - Automatic deployments from Git
  - Serverless functions support
  - Edge network distribution

---

## Project Structure

```
geek-fortune-project/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx          # Authentication UI
│   │   ├── MainMenu.tsx            # Main navigation menu
│   │   ├── GamePage.tsx            # Quiz game logic
│   │   ├── Leaderboard.tsx        # Leaderboard display
│   │   ├── Profile.tsx             # User profile page
│   │   ├── PixelBackground.tsx    # Animated background
│   │   ├── MusicPlayer.tsx        # Background music controls
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   └── ui/                     # Reusable UI components (Radix UI)
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client configuration
│   │   └── password.ts            # Password hashing utilities
│   ├── styles/
│   │   └── globals.css            # Global styles
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Tailwind CSS imports
├── setup_new_supabase.sql         # Database schema
├── vercel.json                    # Vercel deployment config
├── vite.config.ts                 # Vite build configuration
├── package.json                   # Dependencies
└── index.html                     # HTML entry point
```

---

## Core Files Explanation

### `src/main.tsx`
**Purpose**: Application entry point that initializes React and renders the root App component.

**Key Code**:
```typescript
createRoot(document.getElementById("root")!).render(<App />);
```

**Explanation**: Uses React 18's `createRoot` API to mount the App component to the DOM element with id "root".

---

### `src/App.tsx`
**Purpose**: Main application component that manages routing, user state, and page navigation.

**Key Features**:
- **State Management**: 
  - `currentPage`: Tracks which page to display (login, menu, game, leaderboard, profile)
  - `currentUser`: Stores authenticated user data
  - `isLoading`: Loading state during initial user check

- **User Persistence**: 
  - On app load, checks localStorage for saved user ID
  - Fetches user data from Supabase if ID exists
  - Automatically logs user in if valid session found

- **Game Completion Handler**:
  - Updates user statistics (total_score, games_played, best_score) in Supabase
  - Adds entry to leaderboard table
  - Updates local user state

**Data Flow**:
1. User logs in → `handleLogin` saves user ID to localStorage
2. User completes game → `handleGameComplete` updates database
3. User logs out → `handleLogout` clears localStorage and resets state

---

### `src/lib/supabase.ts`
**Purpose**: Configures and exports the Supabase client for database operations.

**Configuration**:
- Reads Supabase URL and anonymous key from environment variables
- Falls back to hardcoded values if env vars not set
- Creates a Supabase client instance using `@supabase/supabase-js`

**Environment Variables**:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous/public key

**Usage**: Imported throughout the app to perform database operations:
```typescript
import { supabase } from './lib/supabase';
const { data, error } = await supabase.from('users').select('*');
```

---

### `src/lib/password.ts`
**Purpose**: Provides password hashing and verification functions using Web Crypto API.

**Functions**:
- `hashPassword(password: string)`: Hashes password using SHA-256
- `verifyPassword(password: string, hash: string)`: Compares password with stored hash

**Security Note**: Uses SHA-256 (client-side). For production, consider server-side hashing with bcrypt or similar.

**Implementation**:
1. Converts password string to Uint8Array
2. Uses `crypto.subtle.digest('SHA-256', data)` to hash
3. Converts hash buffer to hexadecimal string

---

### `src/components/LoginPage.tsx`
**Purpose**: Handles user authentication (login and registration).

**Features**:
- **Registration Mode**: 
  - Username input (max 20 characters)
  - Password input
  - Avatar selection (8 emoji options)
  - Password hashing before storage
  - Username uniqueness validation

- **Login Mode**:
  - Username and password input
  - Password verification against stored hash
  - Error handling for invalid credentials

**Database Operations**:
- **Register**: `supabase.from('users').insert({...})`
- **Login**: `supabase.from('users').select('*').eq('username', ...).single()`

**State Management**:
- `isRegistering`: Toggles between login/register forms
- `username`, `password`: Form inputs
- `selectedAvatar`: Chosen avatar emoji
- `isLoading`: Prevents duplicate submissions
- `error`: Displays error messages

---

### `src/components/MainMenu.tsx`
**Purpose**: Displays main navigation menu after user login.

**Features**:
- Shows user avatar and username
- Displays best score
- Navigation buttons:
  - Start Game
  - Leaderboard
  - Profile
  - Logout

**Props**:
- `user`: Current user object
- `onNavigate`: Function to change pages
- `onLogout`: Function to log out user

---

### `src/components/GamePage.tsx`
**Purpose**: Implements the quiz game logic and UI.

**Question Selection Algorithm**:
1. Filters all 100 questions by category (movies, videogames, music)
2. Shuffles each category array
3. Selects 3 movies, 4 videogames, 3 music questions
4. Combines and shuffles final selection
5. Total: 10 questions per game

**Game Flow**:
1. User selects an answer
2. User clicks "SUBMIT ANSWER"
3. Shows correct/incorrect feedback
4. Updates score if correct
5. User clicks "NEXT QUESTION" or "FINISH"
6. On completion, calls `onComplete(score)`

**State Management**:
- `questions`: Array of 10 selected questions
- `currentQuestionIndex`: Current question (0-9)
- `score`: Accumulated points
- `selectedAnswer`: User's selected option index
- `showResult`: Whether to show answer feedback

**Scoring**:
- Each question worth 100 points
- Points added only for correct answers
- Final score sent to parent component

**UI Features**:
- Progress bar showing question number
- Category badge with color coding
- Answer buttons with visual feedback (green=correct, red=incorrect)
- Score display in header

---

### `src/components/Leaderboard.tsx`
**Purpose**: Displays top 10 all-time high scores.

**Data Fetching**:
- On component mount, fetches leaderboard from Supabase
- Query: `supabase.from('leaderboard').select('*').order('score', { ascending: false }).limit(10)`
- Sorts by score descending, limits to 10 entries

**Display Features**:
- Medal emojis for top 3 (🥇🥈🥉)
- Shows username, avatar, score, and date
- Special styling for top 3 positions
- Loading and error states
- Empty state when no entries exist

**State Management**:
- `entries`: Array of leaderboard entries
- `isLoading`: Loading state
- `error`: Error message if fetch fails

---

### `src/components/Profile.tsx`
**Purpose**: Displays user statistics and achievements.

**Statistics Displayed**:
- Games Played: Total number of games completed
- Best Score: Highest score achieved
- Total Score: Sum of all scores
- Average Score: Total Score / Games Played

**Achievements System**:
- 🎮 First Game: Played at least 1 game
- 🔟 10 Games: Played at least 10 games
- ⭐ 500+ Score: Best score of 500 or higher
- 💎 Perfect Score: Best score of 1000 (all questions correct)

**Visual Design**:
- Large avatar display
- Gradient cards for statistics
- Achievement badges with unlock states

---

### `src/components/PixelBackground.tsx`
**Purpose**: Creates animated pixel star background effect.

**Implementation**:
- Generates 50 random star positions on mount
- Each star has random x, y position, delay, and size
- Uses CSS animations for floating effect
- Adds grid overlay for retro aesthetic

**CSS Classes**:
- `.pixel-stars`: Container for all stars
- `.pixel-star`: Individual star element with animation

---

### `src/components/MusicPlayer.tsx`
**Purpose**: Provides background music controls.

**Features**:
- Play/Pause button
- Mute/Unmute button
- Volume set to 30% by default
- Looping audio
- Uses external royalty-free music URL

**Implementation**:
- Uses HTML5 `<audio>` element
- React refs to control audio playback
- State management for play/pause and mute status

---

## Supabase Database Integration

### Database Schema

The application uses two main tables:

#### `users` Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  avatar TEXT NOT NULL,
  password_hash TEXT,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields**:
- `id`: Unique user identifier (UUID)
- `username`: Unique username (max 20 chars in UI)
- `avatar`: Emoji character representing user
- `password_hash`: SHA-256 hashed password
- `total_score`: Sum of all game scores
- `games_played`: Total number of games completed
- `best_score`: Highest score achieved
- `created_at`: Account creation timestamp

#### `leaderboard` Table
```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  score INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields**:
- `id`: Unique entry identifier
- `user_id`: Foreign key to users table
- `username`: Snapshot of username at time of entry
- `avatar`: Snapshot of avatar at time of entry
- `score`: Score achieved in this game
- `date`: Timestamp when game was completed

**Cascade Delete**: If a user is deleted, their leaderboard entries are automatically removed.

### Row Level Security (RLS)

RLS is enabled on both tables with the following policies:

**Users Table**:
- `Anyone can read users`: Allows SELECT for all users
- `Anyone can insert users`: Allows INSERT for registration
- `Anyone can update users`: Allows UPDATE for score updates

**Leaderboard Table**:
- `Anyone can read leaderboard`: Allows SELECT for viewing leaderboard
- `Anyone can insert leaderboard`: Allows INSERT for adding new scores

**Note**: These policies allow public access. For production, consider more restrictive policies based on authentication.

### Database Operations

#### User Registration
```typescript
const { data, error } = await supabase
  .from('users')
  .insert({
    username: username.trim(),
    password_hash: passwordHash,
    avatar: selectedAvatar,
    total_score: 0,
    games_played: 0,
    best_score: 0,
  })
  .select()
  .single();
```

#### User Login
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('username', username.trim())
  .single();
```

#### Update User Statistics
```typescript
const { error } = await supabase
  .from('users')
  .update({
    total_score: updatedTotalScore,
    games_played: updatedGamesPlayed,
    best_score: updatedBestScore,
  })
  .eq('id', currentUser.id);
```

#### Add Leaderboard Entry
```typescript
const { error } = await supabase
  .from('leaderboard')
  .insert({
    user_id: currentUser.id,
    username: currentUser.username,
    avatar: currentUser.avatar,
    score: score,
  });
```

#### Fetch Leaderboard
```typescript
const { data, error } = await supabase
  .from('leaderboard')
  .select('*')
  .order('score', { ascending: false })
  .limit(10);
```

### Indexes

For performance optimization, indexes are created:
- `idx_users_username`: Index on `users.username` for fast login lookups
- `idx_leaderboard_score`: Index on `leaderboard.score` for fast sorting
- `idx_leaderboard_date`: Index on `leaderboard.date` for date-based queries

---

## Vercel Deployment

### Configuration File: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Explanation**:
- **buildCommand**: Command to run during deployment (`npm run build`)
- **outputDirectory**: Where Vite outputs the built files (`dist/`)
- **rewrites**: SPA routing configuration - all routes redirect to `index.html` for client-side routing

### Deployment Process

1. **Connect Repository**: Link GitHub repository to Vercel
2. **Build Settings**: Vercel auto-detects Vite configuration
3. **Environment Variables**: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel dashboard
4. **Automatic Deployments**: Every push to main branch triggers deployment
5. **Preview Deployments**: Pull requests get preview URLs

### Build Process

1. **Install Dependencies**: `npm install`
2. **Build Application**: `npm run build`
   - Vite compiles TypeScript
   - Bundles React components
   - Optimizes assets
   - Outputs to `dist/` directory
3. **Deploy**: Vercel uploads `dist/` to CDN

### Environment Variables Setup

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`: `https://qxkmwmrjsyjxmtydahct.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Routing Configuration

The `rewrites` rule in `vercel.json` ensures that:
- Direct URL access (e.g., `/game`) works correctly
- Browser refresh on any route doesn't return 404
- All routes are handled by React Router (or in this case, state-based routing)

---

## Application Flow

### 1. Initial Load
```
User opens app → main.tsx renders App.tsx
→ App.tsx checks localStorage for user ID
→ If found: Fetch user from Supabase → Show MainMenu
→ If not found: Show LoginPage
```

### 2. Registration Flow
```
User enters username/password/avatar → Click Register
→ Hash password → Insert into Supabase users table
→ On success: Save user ID to localStorage → Show MainMenu
→ On error: Display error message
```

### 3. Login Flow
```
User enters username/password → Click Login
→ Fetch user from Supabase by username
→ Verify password hash
→ On success: Save user ID to localStorage → Show MainMenu
→ On error: Display error message
```

### 4. Game Flow
```
User clicks "START GAME" → GamePage loads
→ Select 10 random questions
→ User answers questions (10 total)
→ On completion: Update user stats in Supabase
→ Add entry to leaderboard
→ Return to MainMenu
```

### 5. Leaderboard Flow
```
User clicks "LEADERBOARD" → Leaderboard component loads
→ Fetch top 10 scores from Supabase
→ Display sorted list with medals
```

### 6. Profile Flow
```
User clicks "PROFILE" → Profile component loads
→ Display user statistics from currentUser state
→ Show achievement badges based on stats
```

### 7. Logout Flow
```
User clicks "LOGOUT" → Clear localStorage
→ Reset currentUser state
→ Navigate to LoginPage
```

---

## Component Details

### State Management Pattern

Each component manages its own local state using React hooks:

```typescript
const [state, setState] = useState<Type>(initialValue);
```

**Shared State**: User data is passed down as props from `App.tsx` to child components.

**Persistent State**: User ID stored in `localStorage` for session persistence.

### Event Handling

Components use callback props for parent-child communication:

```typescript
// Parent (App.tsx)
<GamePage onComplete={handleGameComplete} onBack={() => setCurrentPage('menu')} />

// Child (GamePage.tsx)
interface GamePageProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}
```

### Error Handling

- **Try-Catch Blocks**: Wrap async operations
- **Error States**: Display user-friendly error messages
- **Console Logging**: Log errors for debugging
- **Fallback UI**: Show loading/error states in components

---

## Styling System

### CSS Architecture

1. **Tailwind CSS**: Utility classes for layout and spacing
2. **Custom CSS**: Pixel-art specific styles in `index.css`
3. **CSS Variables**: Theme colors and spacing

### Pixel-Art Design System

**Color Palette**:
- Background: `#0a0015` (dark purple)
- Primary: `#7c3aed` (purple)
- Secondary: `#6b21a8` (darker purple)
- Accent: `#a855f7` (bright purple)
- Text: `#e9d5ff` (light purple)

**Key CSS Classes**:
- `.pixel-container`: Main content container with border and glow
- `.pixel-button`: Retro-styled buttons with shadow effects
- `.pixel-title`: Animated glowing title text
- `.pixel-input`: Styled form inputs
- `.pixel-stars`: Animated background stars

### Responsive Design

Mobile breakpoints defined in `index.css`:
- `@media (max-width: 639px)`: Mobile-specific styles
- Adjusts font sizes, padding, and layout for small screens
- Leaderboard and profile pages optimized for mobile

### Animations

- **Glow Pulse**: Title text pulsing effect
- **Stars Float**: Background stars floating animation
- **Scan Line**: CRT monitor scan line effect
- **Button Press**: 3D button press effect on click

---

## Security Considerations

### Current Implementation

1. **Password Hashing**: SHA-256 (client-side)
2. **RLS Policies**: Public read/write access
3. **Input Validation**: Username length limits, required fields

### Production Recommendations

1. **Server-Side Authentication**: Move password hashing to backend
2. **JWT Tokens**: Use Supabase Auth for secure sessions
3. **Rate Limiting**: Prevent brute force attacks
4. **Input Sanitization**: Validate and sanitize all user inputs
5. **HTTPS**: Ensure all connections are encrypted
6. **CORS Configuration**: Restrict API access to authorized domains

---

## Performance Optimizations

1. **Code Splitting**: Vite automatically splits code by route
2. **Asset Optimization**: Images and fonts optimized during build
3. **Lazy Loading**: Components loaded on demand
4. **Database Indexes**: Fast query performance
5. **Caching**: Browser caching for static assets

---

## Future Enhancements

1. **Supabase Auth**: Replace custom auth with Supabase Auth
2. **Real-time Updates**: Use Supabase Realtime for live leaderboard
3. **Question Categories**: Allow users to choose categories
4. **Difficulty Levels**: Easy, medium, hard question sets
5. **Social Features**: Share scores, friend system
6. **Achievement System**: More achievements, rewards
7. **Sound Effects**: Add game sound effects
8. **Animations**: More visual feedback and animations

---

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check Supabase URL and key in environment variables
   - Verify RLS policies are set correctly
   - Check network connectivity

2. **Build Errors**:
   - Clear `node_modules` and reinstall
   - Check TypeScript errors
   - Verify all dependencies are installed

3. **Deployment Issues**:
   - Verify `vercel.json` configuration
   - Check build logs in Vercel dashboard
   - Ensure environment variables are set

4. **Authentication Issues**:
   - Clear localStorage and try again
   - Check password hashing is working
   - Verify user exists in database

---

## Conclusion

Geek Fortune is a well-structured React application that demonstrates:
- Modern React patterns with TypeScript
- Supabase integration for backend services
- Vercel deployment for hosting
- Pixel-art UI design
- User authentication and data persistence
- Real-time score tracking and leaderboards

The codebase is maintainable, scalable, and follows React best practices. The separation of concerns between components, utilities, and configuration makes it easy to extend and modify.

