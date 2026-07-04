import { useState, useEffect, useRef } from "react";
import { Play, Pause, Music, Volume2, VolumeX, RefreshCw, Eye, EyeOff } from "lucide-react";
import { LyricLine } from "../types";

const lyricData: LyricLine[] = [
  { id: "1", time: 85, text: "I do, I do, I do..." },
  { id: "2", time: 91, text: "..." }, // Instrumental break between 1:31 and 1:35
  { id: "3", time: 95, text: "Show my love for you" },
  { id: "4", time: 100, text: "Can I show my love for you?" },
  { id: "5", time: 105, text: "(Can I show my love for you?)" },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false); // Start as false to let user initiate and trigger browser sound permissions
  const [isMuted, setIsMuted] = useState(false);
  const [showNativePlayer, setShowNativePlayer] = useState(true); // Show by default so user can tap YouTube directly if browser blocks JS API
  const [currentTime, setCurrentTime] = useState(85); // Start at 1:25 (85 seconds)
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync lyrics based on current custom time tracker
  useEffect(() => {
    if (isPlaying) {
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

          // Loop back to 2:00 (120 seconds) if song goes too far for our lyric prompter demo
          if (nextTime > 120) {
            resetToStart();
            return 85;
          }

          return nextTime;
        });
      }, 1000);
    } else {
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

  const controlVideo = (command: string, args: any[] = []) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args }),
        "*"
      );
    }
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      controlVideo("pauseVideo");
      setIsPlaying(false);
    } else {
      controlVideo("playVideo");
      setIsPlaying(true);
    }
  };

  const resetToStart = () => {
    controlVideo("seekTo", [85, true]);
    controlVideo("playVideo");
    setCurrentTime(85);
    setActiveLyricIndex(0);
    setIsPlaying(true);
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      controlVideo("unMute");
      setIsMuted(false);
    } else {
      controlVideo("mute");
      setIsMuted(true);
    }
  };

  // Calculate percentage of track lyrics completed
  const totalDuration = 120 - 85; // demo window
  const progressPercent = Math.min(100, Math.max(0, ((currentTime - 85) / totalDuration) * 100));

  return (
    <div id="music-player-card" className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-rose-100/60 shadow-[0_8px_30px_rgba(244,63,94,0.04)] flex flex-col gap-4 relative overflow-hidden z-10">
      
      {/* Tiny light decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/50 rounded-full blur-2xl -z-10" />
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-rose-100/30 rounded-full blur-xl -z-10" />

      {/* Main Music Control Section */}
      <div className="flex items-center gap-4">
        {/* Rotating Vinyl */}
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
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono tracking-widest text-rose-500 uppercase font-semibold flex items-center gap-1">
              <Music className="w-3 h-3 text-rose-400 animate-pulse" />
              Yebba's Heartbreak
            </span>
            
            {/* Utility Controls */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowNativePlayer(!showNativePlayer)} 
                className="p-1 rounded-md text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                title={showNativePlayer ? "Ocultar reproductor original" : "Mostrar reproductor original"}
              >
                {showNativePlayer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          
          <h3 className="text-sm md:text-base font-serif font-semibold text-neutral-800 truncate mt-0.5">
            Drake feat. Yebba
          </h3>
          
          <p className="text-[11px] font-sans text-neutral-500 mt-1 flex items-center gap-1.5">
            <span>Minuto 1:25 (Yebba's Heartbreak)</span>
          </p>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="w-full">
        <div className="w-full h-1 bg-rose-100 rounded-full overflow-hidden relative cursor-pointer" onClick={resetToStart}>
          <div 
            className="h-full bg-rose-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono text-rose-400 mt-1">
          <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")}</span>
          <span className="italic">Toca la barra para reiniciar el clímax</span>
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
        <span className="text-[9px] font-mono tracking-widest text-rose-400 uppercase font-medium absolute top-1.5">
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

      {/* Standard Embed with JS API enabled. Styled as fallback card when toggled */}
      <div 
        className={`w-full transition-all duration-500 ease-in-out overflow-hidden flex flex-col gap-2 ${
          showNativePlayer ? "opacity-100 mt-2" : "h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2.5 text-center text-rose-800 text-[11px] font-sans flex items-center justify-center gap-1.5 leading-normal">
          <span className="animate-bounce">🎵</span>
          <span>
            <strong>Paso importante:</strong> Toca el botón <strong>Play</strong> del video de abajo para activar la música en el minuto <strong>1:25</strong>.
          </span>
        </div>
        <div className="w-full h-[180px] md:h-[200px] rounded-xl overflow-hidden border-2 border-rose-100 shadow-inner bg-black">
          <iframe
            ref={iframeRef}
            id="youtube-player"
            className="w-full h-full"
            src="https://www.youtube.com/embed/9rlW2rUzyn0?start=85&enablejsapi=1&autoplay=1&controls=1&rel=0&showinfo=1&modestbranding=1"
            title="Drake, Yebba - Yebba's Heartbreak"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
