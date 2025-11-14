import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Using a royalty-free 8-bit music URL (this is a placeholder - in production you'd host your own)
  const musicUrl = 'https://cdn.pixabay.com/audio/2022/03/10/audio_4a3c2c0a8f.mp3'; // 8-bit style music

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set to 30% volume
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <button
        onClick={togglePlay}
        className="pixel-button p-3 bg-[#1e1b4b] hover:bg-[#2e2b5b]"
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-[#e9d5ff]" />
        ) : (
          <Play className="w-4 h-4 text-[#e9d5ff]" />
        )}
      </button>
      
      <button
        onClick={toggleMute}
        className="pixel-button p-3 bg-[#1e1b4b] hover:bg-[#2e2b5b]"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-[#e9d5ff]" />
        ) : (
          <Volume2 className="w-4 h-4 text-[#e9d5ff]" />
        )}
      </button>

      <audio
        ref={audioRef}
        loop
        src={musicUrl}
      />
    </div>
  );
}
