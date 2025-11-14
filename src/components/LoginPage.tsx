import { useState } from 'react';
import { User } from '../App';
import { supabase } from '../lib/supabase';
import { hashPassword, verifyPassword } from '../lib/password';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const avatars = ['🎮', '🎸', '🎬', '🎲', '🎯', '🎪', '🎭', '🎨'];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('player 1');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        // Hash the password before storing
        const passwordHash = await hashPassword(password);
        
        // Register new user in Supabase
        const { data, error: insertError } = await supabase
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

        if (insertError) {
          if (insertError.code === '23505') {
            // Uniqueness error (username already exists)
            setError('This username is already taken. Please choose another one.');
          } else {
            setError('Registration error. Please try again.');
            console.error('Registration error:', insertError);
          }
          setIsLoading(false);
          return;
        }

        if (data) {
          const newUser: User = {
            id: data.id,
            username: data.username,
            avatar: data.avatar,
            totalScore: data.total_score || 0,
            gamesPlayed: data.games_played || 0,
            bestScore: data.best_score || 0,
          };
          onLogin(newUser);
        }
      } else {
        // Login existing user from Supabase
        const { data, error: selectError } = await supabase
          .from('users')
          .select('*')
          .eq('username', username.trim())
          .single();

        if (selectError || !data) {
          setError('User not found. Please register.');
          setIsLoading(false);
          return;
        }

        // Verify password
        if (!data.password_hash) {
          setError('This account has no password set. Please register a new account.');
          setIsLoading(false);
          return;
        }

        const isPasswordValid = await verifyPassword(password, data.password_hash);
        if (!isPasswordValid) {
          setError('Incorrect password. Please try again.');
          setIsLoading(false);
          return;
        }

        const existingUser: User = {
          id: data.id,
          username: data.username,
          avatar: data.avatar,
          totalScore: data.total_score || 0,
          gamesPlayed: data.games_played || 0,
          bestScore: data.best_score || 0,
        };
        onLogin(existingUser);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pixel-container max-w-md w-full">
      <div className="text-center mb-8">
        <h1 className="pixel-title mb-4 text-4xl">GEEK FORTUNE</h1>
        <p className="text-[#c084fc]">Test Your Pop Culture Knowledge!</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 text-sm rounded" style={{ color: '#ffffff', fontWeight: 'bold', border: '3px solid #ffffff' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[#e9d5ff] mb-2 text-xs">USERNAME</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pixel-input w-full"
            placeholder="ENTER NAME"
            maxLength={20}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-[#e9d5ff] mb-2 text-xs">PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pixel-input w-full"
            placeholder="****"
            required
            disabled={isLoading}
          />
        </div>

        {isRegistering && (
          <div>
            <label className="block text-[#e9d5ff] mb-3 text-xs">CHOOSE AVATAR</label>
            <div className="grid grid-cols-4 gap-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  disabled={isLoading}
                  className={`pixel-button p-4 transition-all ${
                    selectedAvatar === avatar 
                      ? 'avatar-selected' 
                      : ''
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{
                    ...(selectedAvatar === avatar ? {} : {
                      background: 'linear-gradient(to bottom, #1e1b4b, #110f2d)',
                      borderColor: '#6b21a8',
                      color: '#c084fc'
                    }),
                    borderWidth: '3px',
                    borderStyle: 'solid'
                  }}
                >
                  <span className="text-2xl">{avatar}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="pixel-button w-full p-4 bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] hover:from-[#8b5cf6] hover:to-[#7c3aed] border-[#a855f7] text-[#e9d5ff] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : (isRegistering ? '▶ REGISTER' : '▶ LOGIN')}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError(null);
          }}
          disabled={isLoading}
          className="w-full text-[#c084fc] hover:text-[#e9d5ff] text-center text-xs transition-colors disabled:opacity-50"
        >
          {isRegistering ? '← Already have an account? Login' : '→ Need an account? Register'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t-2 border-[#6b21a8] text-center">
        <p className="text-[#7c3aed] text-xs">VIDEOGAMES • MUSIC • MOVIES</p>
      </div>
    </div>
  );
}