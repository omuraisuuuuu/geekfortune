import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { MainMenu } from './components/MainMenu';
import { GamePage } from './components/GamePage';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { PixelBackground } from './components/PixelBackground';
import { MusicPlayer } from './components/MusicPlayer';
import { supabase } from './lib/supabase';

function PageTransition({ children, pageKey }: { children: React.ReactNode; pageKey: string }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(false);
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
    return () => cancelAnimationFrame(timer);
  }, [pageKey]);
  
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.25s ease-out',
      }}
    >
      {children}
    </div>
  );
}

export type Page = 'login' | 'menu' | 'game' | 'leaderboard' | 'profile';
export type GameMode = 'quick' | 'standard' | 'endless';

export interface User {
  id: string;
  username: string;
  avatar: string;
  totalScore: number;
  gamesPlayed: number;
  bestScore: number;
  bestScoreQuick: number;
  bestScoreStandard: number;
  bestScoreEndless: number;
  gamesPlayedQuick: number;
  gamesPlayedStandard: number;
  gamesPlayedEndless: number;
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
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  useEffect(() => {
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
              bestScoreQuick: data.best_score_quick || 0,
              bestScoreStandard: data.best_score_standard || 0,
              bestScoreEndless: data.best_score_endless || 0,
              gamesPlayedQuick: data.games_played_quick || 0,
              gamesPlayedStandard: data.games_played_standard || 0,
              gamesPlayedEndless: data.games_played_endless || 0,
            });
            setCurrentPage('menu');
          } else {
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
    localStorage.setItem('geekFortuneUserId', user.id);
    setCurrentPage('menu');
  };

  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    setCurrentPage('game');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('geekFortuneUserId');
    setCurrentPage('login');
  };

  const handleGameComplete = async (score: number, mode: GameMode) => {
    if (!currentUser) return;

    try {
      const updatedTotalScore = currentUser.totalScore + score;
      const updatedGamesPlayed = currentUser.gamesPlayed + 1;
      const updatedBestScore = Math.max(currentUser.bestScore, score);

      const modeUpdates: Record<string, number> = {};
      let updatedModeGames = 0;
      let updatedModeBestScore = 0;

      if (mode === 'quick') {
        updatedModeGames = currentUser.gamesPlayedQuick + 1;
        updatedModeBestScore = Math.max(currentUser.bestScoreQuick, score);
        modeUpdates.games_played_quick = updatedModeGames;
        modeUpdates.best_score_quick = updatedModeBestScore;
      } else if (mode === 'standard') {
        updatedModeGames = currentUser.gamesPlayedStandard + 1;
        updatedModeBestScore = Math.max(currentUser.bestScoreStandard, score);
        modeUpdates.games_played_standard = updatedModeGames;
        modeUpdates.best_score_standard = updatedModeBestScore;
      } else {
        updatedModeGames = currentUser.gamesPlayedEndless + 1;
        updatedModeBestScore = Math.max(currentUser.bestScoreEndless, score);
        modeUpdates.games_played_endless = updatedModeGames;
        modeUpdates.best_score_endless = updatedModeBestScore;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          total_score: updatedTotalScore,
          games_played: updatedGamesPlayed,
          best_score: updatedBestScore,
          ...modeUpdates,
        })
        .eq('id', currentUser.id);

      if (updateError) {
        console.error('Error updating user:', updateError);
        alert('Error saving statistics. Please try again.');
        return;
      }

      const updatedUser: User = {
        ...currentUser,
        totalScore: updatedTotalScore,
        gamesPlayed: updatedGamesPlayed,
        bestScore: updatedBestScore,
        bestScoreQuick: mode === 'quick' ? updatedModeBestScore : currentUser.bestScoreQuick,
        bestScoreStandard: mode === 'standard' ? updatedModeBestScore : currentUser.bestScoreStandard,
        bestScoreEndless: mode === 'endless' ? updatedModeBestScore : currentUser.bestScoreEndless,
        gamesPlayedQuick: mode === 'quick' ? updatedModeGames : currentUser.gamesPlayedQuick,
        gamesPlayedStandard: mode === 'standard' ? updatedModeGames : currentUser.gamesPlayedStandard,
        gamesPlayedEndless: mode === 'endless' ? updatedModeGames : currentUser.gamesPlayedEndless,
      };
      setCurrentUser(updatedUser);

      const modeTable = mode === 'quick' ? 'quick_leaderboard' : mode === 'standard' ? 'standard_leaderboard' : 'endless_leaderboard';
      const { error: leaderboardError } = await supabase
        .from(modeTable)
        .insert({
          user_id: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          score: score,
        });

      if (leaderboardError) {
        console.error('Error adding to leaderboard:', leaderboardError);
      }

      setGameMode(null);
      setCurrentPage('menu');
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Error saving results. Please check your internet connection.');
    }
  };

  const handleBackToMenu = () => {
    setGameMode(null);
    setCurrentPage('menu');
  };
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
      <PageTransition pageKey={currentPage}>
        {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
        {currentPage === 'menu' && currentUser && (
          <MainMenu
            user={currentUser}
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
            onStartGame={handleStartGame}
          />
        )}
        {currentPage === 'game' && gameMode && currentUser && (
          <GamePage mode={gameMode} user={currentUser} onComplete={handleGameComplete} onBack={handleBackToMenu} />
        )}
        {currentPage === 'leaderboard' && <Leaderboard onBack={() => setCurrentPage('menu')} />}
        {currentPage === 'profile' && currentUser && (
          <Profile user={currentUser} onBack={() => setCurrentPage('menu')} />
        )}
      </PageTransition>
    </div>
  );
}

export default App;