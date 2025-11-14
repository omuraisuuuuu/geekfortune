import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { MainMenu } from './components/MainMenu';
import { GamePage } from './components/GamePage';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { PixelBackground } from './components/PixelBackground';
import { MusicPlayer } from './components/MusicPlayer';
import { supabase } from './lib/supabase';

export type Page = 'login' | 'menu' | 'game' | 'leaderboard' | 'profile';

export interface User {
  id: string;
  username: string;
  avatar: string;
  totalScore: number;
  gamesPlayed: number;
  bestScore: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  score: number;
  date: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from Supabase on app load
    const loadUser = async () => {
      try {
        const savedUserId = localStorage.getItem('geekFortuneUserId');
        if (savedUserId) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', savedUserId)
            .single();

          if (data && !error) {
            setCurrentUser({
              id: data.id,
              username: data.username,
              avatar: data.avatar,
              totalScore: data.total_score || 0,
              gamesPlayed: data.games_played || 0,
              bestScore: data.best_score || 0,
            });
            setCurrentPage('menu');
          } else {
            // User not found, clear localStorage
            localStorage.removeItem('geekFortuneUserId');
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    // Save only user ID to localStorage
    localStorage.setItem('geekFortuneUserId', user.id);
    setCurrentPage('menu');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('geekFortuneUserId');
    setCurrentPage('login');
  };

  const handleGameComplete = async (score: number) => {
    if (!currentUser) return;

    try {
      // Update user statistics in Supabase
      const updatedTotalScore = currentUser.totalScore + score;
      const updatedGamesPlayed = currentUser.gamesPlayed + 1;
      const updatedBestScore = Math.max(currentUser.bestScore, score);

      const { error: updateError } = await supabase
        .from('users')
        .update({
          total_score: updatedTotalScore,
          games_played: updatedGamesPlayed,
          best_score: updatedBestScore,
        })
        .eq('id', currentUser.id);

      if (updateError) {
        console.error('Error updating user:', updateError);
        alert('Error saving statistics. Please try again.');
        return;
      }

      // Update local state
      const updatedUser: User = {
        ...currentUser,
        totalScore: updatedTotalScore,
        gamesPlayed: updatedGamesPlayed,
        bestScore: updatedBestScore,
      };
      setCurrentUser(updatedUser);

      // Add entry to leaderboard in Supabase
      const { error: leaderboardError } = await supabase
        .from('leaderboard')
        .insert({
          user_id: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          score: score,
        });

      if (leaderboardError) {
        console.error('Error adding to leaderboard:', leaderboardError);
        // Don't interrupt execution, as user statistics are already updated
      }

      setCurrentPage('menu');
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Error saving results. Please check your internet connection.');
    }
  };

  // Show loading during initial user check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0015] flex items-center justify-center p-4">
        <PixelBackground />
        <div className="text-center">
          <p className="text-[#c084fc] text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0015] flex items-center justify-center p-4">
      <PixelBackground />
      <MusicPlayer />
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'menu' && currentUser && (
        <MainMenu user={currentUser} onNavigate={setCurrentPage} onLogout={handleLogout} />
      )}
      {currentPage === 'game' && <GamePage onComplete={handleGameComplete} onBack={() => setCurrentPage('menu')} />}
      {currentPage === 'leaderboard' && <Leaderboard onBack={() => setCurrentPage('menu')} />}
      {currentPage === 'profile' && currentUser && (
        <Profile user={currentUser} onBack={() => setCurrentPage('menu')} />
      )}
    </div>
  );
}

export default App;