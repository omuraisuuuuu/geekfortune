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
        <div className="w-24" /> {/* Spacer */}
      </div>

      {/* Avatar and Username */}
      <div className="text-center mb-8 p-8 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#7c3aed] relative">
        <div className="absolute top-3 left-3 right-3 bottom-3 border border-[#6b21a8] pointer-events-none opacity-30"></div>
        <div className="text-7xl mb-4 relative z-10">{user.avatar}</div>
        <h2 className="text-[#e9d5ff] mb-2 text-2xl relative z-10" style={{ textShadow: '0 0 10px #a855f7' }}>{user.username}</h2>
        <p className="text-[#7c3aed] text-xs relative z-10">GEEK FORTUNE PLAYER</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="pixel-button p-6 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-[#6b21a8] text-center">
          <p className="text-[#7c3aed] mb-2 text-xs">GAMES PLAYED</p>
          <p className="text-[#c084fc] text-2xl">{user.gamesPlayed}</p>
        </div>
        
        <div className="pixel-button p-6 bg-gradient-to-b from-[#6b21a8] to-[#581c87] border-[#7c3aed] text-center">
          <p className="text-[#c084fc] mb-2 text-xs">BEST SCORE</p>
          <p className="text-[#e9d5ff] text-2xl">{user.bestScore} pts</p>
        </div>
        
        <div className="pixel-button p-6 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-[#6b21a8] text-center">
          <p className="text-[#7c3aed] mb-2 text-xs">TOTAL SCORE</p>
          <p className="text-[#c084fc] text-2xl">{user.totalScore} pts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="pixel-button p-6 bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7] text-center">
          <p className="text-[#e9d5ff] mb-2 text-xs">AVERAGE SCORE</p>
          <p className="text-[#e9d5ff] text-2xl">{averageScore} pts</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="p-6 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#6b21a8] relative">
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#6b21a8] pointer-events-none opacity-30"></div>
        <h3 className="text-[#c084fc] mb-4 text-center relative z-10">★ ACHIEVEMENTS ★</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
          <div className={`p-3 text-center border-2 transition-all ${
            user.gamesPlayed >= 1 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95]'
          }`}>
            <div className="text-2xl mb-1">🎮</div>
            <p className="text-xs text-[#e9d5ff]">First Game</p>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all ${
            user.gamesPlayed >= 10 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95]'
          }`}>
            <div className="text-2xl mb-1">🔟</div>
            <p className="text-xs text-[#e9d5ff]">10 Games</p>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all ${
            user.bestScore >= 500 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95]'
          }`}>
            <div className="text-2xl mb-1">⭐</div>
            <p className="text-xs text-[#e9d5ff]">500+ Score</p>
          </div>
          
          <div className={`p-3 text-center border-2 transition-all ${
            user.bestScore >= 1000 
              ? 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7]' 
              : 'bg-[#1e1b4b] border-[#4c1d95]'
          }`}>
            <div className="text-2xl mb-1">💎</div>
            <p className="text-xs text-[#e9d5ff]">Perfect Score</p>
          </div>
        </div>
      </div>
    </div>
  );
}