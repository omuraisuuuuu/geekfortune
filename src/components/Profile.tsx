import { User } from '../App';

interface ProfileProps {
  user: User;
  onBack: () => void;
}

export function Profile({ user, onBack }: ProfileProps) {
  const averageScore = user.gamesPlayed > 0 
    ? Math.round(user.totalScore / user.gamesPlayed) 
    : 0;

  return (
    <div className="pixel-container max-w-2xl w-full">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="pixel-button px-4 py-2 bg-gradient-to-b from-[#4c1d95] to-[#3b0764] border-[#6b21a8] text-[#c084fc] hover:from-[#581c87] hover:to-[#4c1d95]">
          ← BACK
        </button>
        <h1 className="pixel-title text-3xl">PROFILE</h1>
        <div className="w-24" />
      </div>

      <div className="text-center mb-8 p-8 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#7c3aed] relative">
        <div className="absolute top-3 left-3 right-3 bottom-3 border border-[#6b21a8] pointer-events-none opacity-30"></div>
        <div className="text-7xl mb-4 relative z-10">{user.avatar}</div>
        <h2 className="text-[#e9d5ff] mb-2 text-2xl relative z-10" style={{ textShadow: '0 0 10px #a855f7' }}>{user.username}</h2>
        <p className="text-[#7c3aed] text-xs relative z-10">GEEK FORTUNE PLAYER</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="pixel-button p-6 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-[#6b21a8] text-center">
          <p className="text-[#7c3aed] mb-2 text-xs">GAMES PLAYED</p>
          <p className="text-[#c084fc] text-3xl font-bold">{user.gamesPlayed}</p>
        </div>
        
        <div className="pixel-button p-6 bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7] text-center">
          <p className="text-[#e9d5ff] mb-2 text-xs">AVERAGE SCORE</p>
          <p className="text-[#e9d5ff] text-3xl font-bold">{averageScore}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-center mb-4">
          <span className="text-[#c084fc] text-sm">★ MODE STATISTICS ★</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div 
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #0f0d24 100%)',
              border: '3px solid #eab308',
              borderRadius: '4px',
              padding: '16px 12px'
            }}
          >
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: 'linear-gradient(90deg, #eab308, #f59e0b)' }}
            />
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <p style={{ color: '#eab308', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px' }}>QUICK</p>
              <div 
                className="py-2 px-3 mb-2"
                style={{ background: 'rgba(234, 179, 8, 0.2)', borderRadius: '4px' }}
              >
                <p style={{ color: '#fde047', fontSize: '20px', fontWeight: 'bold' }}>{user.bestScoreQuick}</p>
                <p style={{ color: '#c084fc', fontSize: '10px' }}>BEST SCORE</p>
              </div>
              <p style={{ color: '#e9d5ff', fontSize: '12px' }}>{user.gamesPlayedQuick} games</p>
            </div>
          </div>

          <div 
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #0f0d24 100%)',
              border: '3px solid #22c55e',
              borderRadius: '4px',
              padding: '16px 12px'
            }}
          >
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: 'linear-gradient(90deg, #22c55e, #4ade80)' }}
            />
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p style={{ color: '#22c55e', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px' }}>CLASSIC</p>
              <div 
                className="py-2 px-3 mb-2"
                style={{ background: 'rgba(34, 197, 94, 0.2)', borderRadius: '4px' }}
              >
                <p style={{ color: '#4ade80', fontSize: '20px', fontWeight: 'bold' }}>{user.bestScoreStandard}</p>
                <p style={{ color: '#c084fc', fontSize: '10px' }}>BEST SCORE</p>
              </div>
              <p style={{ color: '#e9d5ff', fontSize: '12px' }}>{user.gamesPlayedStandard} games</p>
            </div>
          </div>

          <div 
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #0f0d24 100%)',
              border: '3px solid #ef4444',
              borderRadius: '4px',
              padding: '16px 12px'
            }}
          >
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: 'linear-gradient(90deg, #ef4444, #f87171)' }}
            />
            <div className="text-center">
              <div className="text-3xl mb-2">♾️</div>
              <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px' }}>ENDLESS</p>
              <div 
                className="py-2 px-3 mb-2"
                style={{ background: 'rgba(239, 68, 68, 0.2)', borderRadius: '4px' }}
              >
                <p style={{ color: '#f87171', fontSize: '20px', fontWeight: 'bold' }}>{user.bestScoreEndless}</p>
                <p style={{ color: '#c084fc', fontSize: '10px' }}>BEST SCORE</p>
              </div>
              <p style={{ color: '#e9d5ff', fontSize: '12px' }}>{user.gamesPlayedEndless} games</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#6b21a8] relative">
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#6b21a8] pointer-events-none opacity-30"></div>
        <h3 className="text-[#c084fc] mb-4 text-center relative z-10">★ ACHIEVEMENTS ★</h3>
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className={`p-3 text-center border-2 transition-all flex items-center gap-3 ${
            user.gamesPlayed >= 1 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95] opacity-50'
          }`}>
            <div className="text-2xl">🎮</div>
            <div className="text-left">
              <p className="text-xs text-[#e9d5ff] font-bold">First Steps</p>
              <p className="text-[10px] text-[#c084fc]">Play your first game</p>
            </div>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all flex items-center gap-3 ${
            user.gamesPlayed >= 10 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95] opacity-50'
          }`}>
            <div className="text-2xl">🔥</div>
            <div className="text-left">
              <p className="text-xs text-[#e9d5ff] font-bold">Dedicated</p>
              <p className="text-[10px] text-[#c084fc]">Play 10 games</p>
            </div>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all flex items-center gap-3 ${
            user.gamesPlayed >= 25 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95] opacity-50'
          }`}>
            <div className="text-2xl">⭐</div>
            <div className="text-left">
              <p className="text-xs text-[#e9d5ff] font-bold">Veteran</p>
              <p className="text-[10px] text-[#c084fc]">Play 25 games</p>
            </div>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all flex items-center gap-3 ${
            user.bestScore >= 500 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95] opacity-50'
          }`}>
            <div className="text-2xl">🏅</div>
            <div className="text-left">
              <p className="text-xs text-[#e9d5ff] font-bold">Rising Star</p>
              <p className="text-[10px] text-[#c084fc]">Score 500+ points</p>
            </div>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all flex items-center gap-3 ${
            user.bestScore >= 1000 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95] opacity-50'
          }`}>
            <div className="text-2xl">👑</div>
            <div className="text-left">
              <p className="text-xs text-[#e9d5ff] font-bold">Champion</p>
              <p className="text-[10px] text-[#c084fc]">Score 1000+ points</p>
            </div>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all flex items-center gap-3 ${
            user.bestScore >= 2000 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95] opacity-50'
          }`}>
            <div className="text-2xl">💎</div>
            <div className="text-left">
              <p className="text-xs text-[#e9d5ff] font-bold">Legend</p>
              <p className="text-[10px] text-[#c084fc]">Score 2000+ points</p>
            </div>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all flex items-center gap-3 ${
            user.gamesPlayedQuick >= 5 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95] opacity-50'
          }`}>
            <div className="text-2xl">⚡</div>
            <div className="text-left">
              <p className="text-xs text-[#e9d5ff] font-bold">Speed Demon</p>
              <p className="text-[10px] text-[#c084fc]">Play 5 Quick games</p>
            </div>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all flex items-center gap-3 ${
            user.gamesPlayedStandard >= 5 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95] opacity-50'
          }`}>
            <div className="text-2xl">🎯</div>
            <div className="text-left">
              <p className="text-xs text-[#e9d5ff] font-bold">Sharpshooter</p>
              <p className="text-[10px] text-[#c084fc]">Play 5 Classic games</p>
            </div>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all flex items-center gap-3 ${
            user.gamesPlayedEndless >= 5 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95] opacity-50'
          }`}>
            <div className="text-2xl">♾️</div>
            <div className="text-left">
              <p className="text-xs text-[#e9d5ff] font-bold">Survivor</p>
              <p className="text-[10px] text-[#c084fc]">Play 5 Endless games</p>
            </div>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all flex items-center gap-3 ${
            user.gamesPlayedQuick >= 1 && user.gamesPlayedStandard >= 1 && user.gamesPlayedEndless >= 1
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95] opacity-50'
          }`}>
            <div className="text-2xl">🌟</div>
            <div className="text-left">
              <p className="text-xs text-[#e9d5ff] font-bold">Explorer</p>
              <p className="text-[10px] text-[#c084fc]">Try all game modes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
