import { User, Page } from '../App';

interface MainMenuProps {
  user: User;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function MainMenu({ user, onNavigate, onLogout }: MainMenuProps) {
  return (
    <div className="pixel-container max-w-2xl w-full">
      <div className="text-center mb-8">
        <h1 className="pixel-title mb-6 text-5xl">GEEK FORTUNE</h1>
        <div className="inline-block px-6 py-4 bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] border-3 border-[#a855f7] mb-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">{user.avatar}</span>
            <span className="text-[#e9d5ff]">{user.username}</span>
          </div>
        </div>
        <p className="text-[#c084fc] text-xs">BEST SCORE: {user.bestScore} PTS</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => onNavigate('game')}
          className="pixel-button w-full p-6 bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] hover:from-[#8b5cf6] hover:to-[#7c3aed] border-[#a855f7] text-[#e9d5ff] group"
        >
          <span className="mr-3 group-hover:animate-pulse">▶</span>START GAME
        </button>

        <button
          onClick={() => onNavigate('leaderboard')}
          className="pixel-button w-full p-6 bg-gradient-to-b from-[#6b21a8] to-[#581c87] hover:from-[#7c3aed] hover:to-[#6b21a8] border-[#9333ea] text-[#e9d5ff]"
        >
          <span className="mr-3">🏆</span>LEADERBOARD
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className="pixel-button w-full p-6 bg-gradient-to-b from-[#581c87] to-[#4c1d95] hover:from-[#6b21a8] hover:to-[#581c87] border-[#7c3aed] text-[#e9d5ff]"
        >
          <span className="mr-3">👤</span>PROFILE
        </button>

        <button
          onClick={onLogout}
          className="pixel-button w-full p-4 bg-gradient-to-b from-[#4c1d95] to-[#3b0764] hover:from-[#581c87] hover:to-[#4c1d95] border-[#6b21a8] text-[#c084fc]"
        >
          ← LOGOUT
        </button>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-block px-6 py-2 border-2 border-[#6b21a8] bg-[#1e1b4b]/50">
          <p className="text-[#7c3aed] text-xs">POWERED BY RETRO TECH</p>
        </div>
      </div>
    </div>
  );
}