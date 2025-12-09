import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, ChevronUp, ChevronDown, SkipBack, SkipForward } from 'lucide-react';

interface Song {
  id: string;
  name: string;
  file: string;
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetch('/music/playlist.json')
      .then(res => res.json())
      .then(data => {
        if (data.songs && data.songs.length > 0) {
          setSongs(data.songs);
        }
      })
      .catch(err => {
        console.log('Failed to load playlist:', err);
        setSongs([{
          id: 'default',
          name: 'Retro Gaming',
          file: 'https://cdn.pixabay.com/audio/2022/03/10/audio_4a3c2c0a8f.mp3'
        }]);
      });
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current && songs.length > 0) {
      const wasPlaying = isPlaying;
      audioRef.current.src = songs[currentSongIndex].file;
      if (wasPlaying) {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      }
    }
  }, [currentSongIndex, songs]);

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

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
  };

  const nextSong = () => {
    if (songs.length > 0) {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    }
  };

  const prevSong = () => {
    if (songs.length > 0) {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    }
  };

  const currentSong = songs[currentSongIndex];

  return (
    <div className="fixed top-4 right-4 z-50">
      {isExpanded && (
        <div className="mb-2 p-3 bg-gradient-to-b from-[#1e1b4b] to-[#0f0a2e] border-2 border-[#a855f7] rounded-sm shadow-lg shadow-purple-900/50 min-w-[220px]">
          <div className="text-[#e9d5ff] text-xs font-bold mb-2 flex items-center gap-2">
            <Music className="w-3 h-3 text-[#c084fc]" />
            <span>NOW PLAYING</span>
          </div>
          
          {currentSong && (
            <div className="text-[#c084fc] text-xs mb-3 truncate px-1">
              🎵 {currentSong.name}
            </div>
          )}

          {songs.length > 1 && (
            <div className="flex justify-center gap-2 mb-3">
              <button
                onClick={prevSong}
                className="p-2 bg-[#2e1b5b] hover:bg-[#3e2b6b] border border-[#7c3aed] rounded-sm transition-colors"
                title="Previous"
              >
                <SkipBack className="w-3 h-3 text-[#e9d5ff]" />
              </button>
              <button
                onClick={nextSong}
                className="p-2 bg-[#2e1b5b] hover:bg-[#3e2b6b] border border-[#7c3aed] rounded-sm transition-colors"
                title="Next"
              >
                <SkipForward className="w-3 h-3 text-[#e9d5ff]" />
              </button>
            </div>
          )}

          <div className="text-[#e9d5ff] text-xs font-bold mb-2">PLAYLIST</div>
          <div className="max-h-40 overflow-y-auto custom-scrollbar">
            {songs.map((song, index) => (
              <button
                key={song.id}
                onClick={() => selectSong(index)}
                className={`w-full text-left px-2 py-2 text-xs transition-colors truncate flex items-center gap-2 ${
                  index === currentSongIndex
                    ? 'bg-[#6b21a8] border-l-2 border-[#c084fc]'
                    : 'hover:bg-[#2e1b5b]'
                }`}
                style={{ color: index === currentSongIndex ? '#ffffff' : 'rgba(255,255,255,0.5)' }}
              >
                <span style={{ color: index === currentSongIndex ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>{index + 1}.</span>
                <span className="truncate">{song.name}</span>
                {index === currentSongIndex && isPlaying && (
                  <span className="ml-auto text-[#c084fc] animate-pulse">♪</span>
                )}
              </button>
            ))}
          </div>

          {songs.length === 0 && (
            <div className="text-[#6b5b95] text-xs py-2 text-center">
              No songs loaded
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="pixel-button p-3 bg-[#1e1b4b] hover:bg-[#2e2b5b]"
          title={isExpanded ? 'Hide Playlist' : 'Show Playlist'}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#e9d5ff]" />
          ) : (
            <Music className="w-4 h-4 text-[#e9d5ff]" />
          )}
        </button>

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
      </div>

      <audio
        ref={audioRef}
        loop
        src={currentSong?.file || ''}
      />
    </div>
  );
}
