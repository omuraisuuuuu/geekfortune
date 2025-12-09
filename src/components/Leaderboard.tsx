import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../App';
import { supabase } from '../lib/supabase';

interface LeaderboardProps {
  onBack: () => void;
}

type LeaderboardMode = 'quick' | 'standard' | 'endless';

const modeConfig: Record<LeaderboardMode, { table: string; label: string; icon: string; color: string }> = {
  quick: { table: 'quick_leaderboard', label: 'QUICK', icon: '⚡', color: '#eab308' },
  standard: { table: 'standard_leaderboard', label: 'CLASSIC', icon: '🎯', color: '#22c55e' },
  endless: { table: 'endless_leaderboard', label: 'ENDLESS', icon: '♾️', color: '#ef4444' },
};

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<LeaderboardMode>('quick');

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from(modeConfig[selectedMode].table)
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
  }, [selectedMode]);

  const getMedalEmoji = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return `${rank + 1}.`;
  };

  const config = modeConfig[selectedMode];

  return (
    <div className="pixel-container leaderboard-container" style={{ width: '920px', minHeight: '600px', maxHeight: '800px', display: 'flex', flexDirection: 'column' }}>
      <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-[#6b21a8]/50">
        <button onClick={onBack} className="pixel-button px-6 py-3 bg-gradient-to-b from-[#4c1d95] to-[#3b0764] border-[#6b21a8] text-[#c084fc] hover:from-[#581c87] hover:to-[#4c1d95]">
          ← BACK
        </button>
        <h1 className="pixel-title text-4xl">LEADERBOARD</h1>
        <div className="w-32" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {(Object.keys(modeConfig) as LeaderboardMode[]).map((mode) => {
          const cfg = modeConfig[mode];
          const isSelected = selectedMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className="pixel-button p-3 transition-all"
              style={{
                background: isSelected 
                  ? `linear-gradient(to bottom, ${cfg.color}33, ${cfg.color}11)` 
                  : 'linear-gradient(to bottom, #1e1b4b, #110f2d)',
                border: `3px solid ${isSelected ? cfg.color : '#4c1d95'}`,
                color: isSelected ? cfg.color : '#7c3aed'
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">{cfg.icon}</span>
                <span className="text-sm font-bold">{cfg.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-6 text-center">
        <div 
          className="inline-block px-6 py-2 border-2"
          style={{ 
            borderColor: config.color,
            background: `${config.color}15`
          }}
        >
          <p style={{ color: config.color }} className="text-xs">
            {config.icon} TOP 10 {config.label} {config.icon}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-12 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#6b21a8]">
          <p className="text-[#c084fc] mb-2">Loading leaderboard...</p>
        </div>
      ) : error ? (
        <div className="text-center p-12 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#6b21a8]">
          <p className="text-[#e9d5ff] mb-2 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="pixel-button px-4 py-2 mt-4 bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7] text-[#e9d5ff]"
          >
            REFRESH
          </button>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center p-12 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#6b21a8]">
          <p className="text-[#c084fc] mb-2">No results yet!</p>
          <p className="text-[#7c3aed] text-xs">Be the first to play {config.label} mode!</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto" style={{ maxHeight: '400px' }}>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="pixel-button p-4 flex items-center justify-between transition-all"
              style={{
                background: index === 0 
                  ? `linear-gradient(to right, ${config.color}40, ${config.color}20)` 
                  : index === 1
                  ? `linear-gradient(to right, ${config.color}30, ${config.color}10)`
                  : index === 2
                  ? `linear-gradient(to right, ${config.color}20, ${config.color}05)`
                  : 'linear-gradient(to bottom, #1e1b4b, #110f2d)',
                borderColor: index < 3 ? config.color : '#6b21a8',
                borderWidth: '2px'
              }}
            >
              <div className="flex items-center gap-4">
                <span className={`w-12 text-center ${index < 3 ? 'text-2xl' : 'text-[#c084fc]'}`}>
                  {getMedalEmoji(index)}
                </span>
                <span className="text-2xl">{entry.avatar}</span>
                <span className="text-[#e9d5ff]">{entry.username}</span>
              </div>
              <div className="flex items-center gap-4 pr-2">
                <span 
                  className="font-bold"
                  style={{ color: index < 3 ? config.color : '#c084fc' }}
                >
                  {entry.score} PTS
                </span>
                <span className="text-[#7c3aed] text-xs min-w-[80px] text-right whitespace-nowrap">
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
