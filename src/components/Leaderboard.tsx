import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../App';
import { supabase } from '../lib/supabase';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('leaderboard')
          .select('*')
          .order('score', { ascending: false })
          .limit(10);

        if (fetchError) {
          console.error('Error loading leaderboard:', fetchError);
          setError('Error loading leaderboard');
          return;
        }

        if (data) {
          const formattedEntries: LeaderboardEntry[] = data.map((entry) => ({
            id: entry.id,
            username: entry.username,
            avatar: entry.avatar,
            score: entry.score,
            date: entry.date,
          }));
          setEntries(formattedEntries);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error loading leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const getMedalEmoji = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return `${rank + 1}.`;
  };

  return (
    <div className="pixel-container leaderboard-container" style={{ width: '920px', minHeight: '600px', maxHeight: '800px', display: 'flex', flexDirection: 'column' }}>
      <div className="flex justify-between items-center mb-12 pb-6 border-b-2 border-[#6b21a8]/50">
        <button onClick={onBack} className="pixel-button px-6 py-3 bg-gradient-to-b from-[#4c1d95] to-[#3b0764] border-[#6b21a8] text-[#c084fc] hover:from-[#581c87] hover:to-[#4c1d95]">
          ← BACK
        </button>
        <h1 className="pixel-title text-4xl">LEADERBOARD</h1>
        <div className="w-32" />
      </div>

      <div className="mb-8 text-center">
        <div className="inline-block px-6 py-2 border-2 border-[#7c3aed] bg-[#1e1b4b]/50">
          <p className="text-[#c084fc] text-xs">★ TOP 10 ALL-TIME ★</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-12 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#6b21a8]">
          <p className="text-[#c084fc] mb-2">Loading leaderboard...</p>
        </div>
      ) : error ? (
        <div className="text-center p-12 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#6b21a8]">
          <p className="text-white mb-2 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="pixel-button px-4 py-2 mt-4 bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7] text-[#e9d5ff]"
          >
            Refresh
          </button>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center p-12 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#6b21a8]">
          <p className="text-[#c084fc] mb-2">No results yet!</p>
          <p className="text-[#7c3aed] text-xs">Be the first to play!</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto" style={{ maxHeight: '500px' }}>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`pixel-button p-4 flex items-center justify-between transition-all ${
                index === 0 
                  ? 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] border-[#c084fc]' 
                  : index === 1
                  ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] border-[#a855f7]'
                  : index === 2
                  ? 'bg-gradient-to-r from-[#581c87] to-[#6b21a8] border-[#9333ea]'
                  : 'bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-[#6b21a8]'
              }`}
              style={{ minHeight: '60px' }}
            >
              <div className="flex items-center gap-4">
                <span className={`w-12 text-center ${index < 3 ? 'text-2xl' : ''}`}>
                  {getMedalEmoji(index)}
                </span>
                <span className="text-2xl">{entry.avatar}</span>
                <span className="text-[#e9d5ff]">{entry.username}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`${index < 3 ? 'text-[#e9d5ff]' : 'text-[#c084fc]'}`}>
                  {entry.score} PTS
                </span>
                <span className="text-[#7c3aed] text-xs w-20 text-left">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}