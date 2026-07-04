import { useState, useEffect, useRef } from "react";
import { Play, Pause, Music, Volume2, VolumeX, RefreshCw, ExternalLink } from "lucide-react";
import { LyricLine } from "../types";

const lyricData: LyricLine[] = [
  { id: "1", time: 85, text: "I do, I do, I do..." },
  { id: "2", time: 91, text: "..." }, // Instrumental transition between 1:31 and 1:35
  { id: "3", time: 95, text: "Show my love for you" },
  { id: "4", time: 100, text: "Can I show my love for you?" },
  { id: "5", time: 105, text: "(Can I show my love for you?)" },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(85); // Start at 1:25 (85 seconds)
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [hasOpenedYoutube, setHasOpenedYoutube] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync lyrics based on current custom time tracker
  useEffect(() => {
    if (isPlaying) {
      // Start the local background audio if ready
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.log("Audio play deferred until user interaction", err);
        });
      }

      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const nextTime = prev + 1;
          
          // Find the active lyric line
          const matchedIndex = lyricData.findIndex((lyric, idx) => {
            const nextLyric = lyricData[idx + 1];
            return nextTime >= lyric.time && (!nextLyric || nextTime < nextLyric.time);
          });
          
          if (matchedIndex !== -1) {
            setActiveLyricIndex(matchedIndex);
          }

          // Loop back to 2:00 (120 seconds) if song goes too far for our lyric prompter
          if (nextTime > 120) {
            resetToStart();
            return 85;
          }

          return nextTime;
        });
      }, 1000);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  // Sync volume state with HTML5 audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const openYoutubeLink = () => {
    window.open("https://www.youtube.com/watch?v=9rlW2rUzyn0&t=85s", "_blank");
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Auto open YouTube link on the first Play tap so they get the original audio playing
      if (!hasOpenedYoutube) {
        openYoutubeLink();
        setHasOpenedYoutube(true);
      }
    }
  };

  const resetToStart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    setCurrentTime(85);
    setActiveLyricIndex(0);
    setIsPlaying(true);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  // Calculate progress percentage of current 1:25 to 2:00 window (35 seconds total)
  const totalDuration = 120 - 85;
  const progressPercent = Math.min(100, Math.max(0, ((currentTime - 85) / totalDuration) * 100));

  return (
    <div id="music-player-card" className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-rose-100/60 shadow-[0_8px_30px_rgba(244,63,94,0.04)] flex flex-col gap-4 relative overflow-hidden z-10">
      
      {/* Hidden HTML5 Audio for local sound playback */}
      <audio 
        ref={audioRef}
        src="https://assets.mixkit.co/music/preview/mixkit-serenade-590.mp3"
        loop
      />

      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/50 rounded-full blur-2xl -z-10" />
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-rose-100/30 rounded-full blur-xl -z-10" />

      {/* Main Music Control Section */}
      <div className="flex items-center gap-4">
        {/* Rotating Vinyl Disc */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
          <div 
            className={`w-full h-full rounded-full bg-neutral-900 border-4 border-neutral-800 shadow-lg flex items-center justify-center relative overflow-hidden ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "12s" }}
          >
            {/* Grooves */}
            <div className="absolute inset-2 rounded-full border border-neutral-700/50" />
            <div className="absolute inset-4 rounded-full border border-neutral-800/80" />
            
            {/* Center Label */}
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-rose-200 border-2 border-neutral-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            </div>
          </div>
          
          {/* Tone arm */}
          <div 
            className={`absolute -top-1 right-2 w-8 h-8 origin-top-right transition-transform duration-700 pointer-events-none ${
              isPlaying ? "rotate-6" : "-rotate-12"
            }`}
          >
            <div className="w-1 h-8 bg-neutral-400 rounded-full transform rotate-12 origin-top-right shadow-sm" />
            <div className="w-2.5 h-1.5 bg-neutral-600 rounded-sm absolute bottom-0 -left-1" />
          </div>
        </div>

        {/* Info & Core Controls */}
        <div className="flex-grow min-w-0">
          <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-semibold flex items-center gap-1">
            <Music className="w-3 h-3 text-rose-400 animate-pulse" />
            Yebba's Heartbreak
          </span>
          
          <h3 className="text-sm md:text-base font-serif font-semibold text-neutral-800 truncate mt-0.5">
            Drake feat. Yebba
          </h3>
          
          <p className="text-[11px] font-sans text-neutral-500 mt-1 flex items-center gap-1.5">
            <span>Sincronizado: 1:25 - 2:00</span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div className="w-full h-1 bg-rose-100 rounded-full overflow-hidden relative cursor-pointer" onClick={resetToStart}>
          <div 
            className="h-full bg-rose-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono text-rose-400 mt-1">
          <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")}</span>
          <span className="italic">Haz click para reiniciar la letra</span>
          <span>2:13</span>
        </div>
      </div>

      {/* Primary Control Buttons */}
      <div className="flex items-center justify-center gap-5 my-1">
        <button
          onClick={handleMuteToggle}
          className="p-2 rounded-full border border-rose-100 bg-white hover:bg-rose-50 text-rose-500 active:scale-95 transition-all duration-200"
          aria-label={isMuted ? "Quitar silencio" : "Silenciar"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          id="play-music-btn"
          onClick={handlePlayToggle}
          className={`p-4 rounded-full shadow-md text-white active:scale-95 transition-all duration-200 ${
            isPlaying 
              ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200" 
              : "bg-rose-600 hover:bg-rose-700 shadow-rose-300 animate-bounce"
          }`}
          aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white translate-x-0.5" />}
        </button>

        <button
          onClick={resetToStart}
          className="p-2 rounded-full border border-rose-100 bg-white hover:bg-rose-50 text-rose-500 active:scale-95 transition-all duration-200"
          aria-label="Reiniciar canción"
          title="Reiniciar canción en 1:25"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Highlighted Lyrics Display */}
      <div className="bg-rose-50/40 rounded-xl p-3 border border-rose-100/30 text-center min-h-[64px] flex flex-col justify-center items-center relative overflow-hidden">
        <span className="text-[9px] font-mono tracking-widest text-rose-400 uppercase font-semibold absolute top-1.5">
          Letra actual
        </span>
        <div className="mt-3 text-sm md:text-base font-serif italic text-rose-800 font-medium leading-relaxed animate-fade-in px-2">
          {lyricData[activeLyricIndex] ? (
            <span className="text-rose-600 font-semibold underline decoration-rose-200 decoration-2 underline-offset-4">
              {lyricData[activeLyricIndex].text}
            </span>
          ) : (
            <span className="text-rose-400 font-sans text-xs">Escuchando la melodía...</span>
          )}
        </div>
      </div>

    </div>
  );
}
