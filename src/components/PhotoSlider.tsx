import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Heart, Sparkles, MapPin, Calendar } from "lucide-react";
import { Photo } from "../types";

const defaultPhotos: Photo[] = [
  {
    id: "1",
    url: "https://i.pinimg.com/736x/8b/a3/06/8ba306a8bb3b15515c34e6b46eda5ab8.jpg",
    caption: "Tomar tu mano es mi lugar favorito en el mundo.",
    date: "Tú y Yo",
    location: "A tu lado"
  },
  {
    id: "2",
    url: "https://i.pinimg.com/736x/3a/53/21/3a5321053e60fdfc1e10cfce78f76965.jpg",
    caption: "En cada risa compartida, encuentro un motivo para quererte más.",
    date: "Instantes eternos",
    location: "Bajo las luces"
  },
  {
    id: "3",
    url: "https://i.pinimg.com/736x/48/5a/b0/485ab0171a35aeb487e9b6466a596d52.jpg",
    caption: "Hay rincones del alma que solo tú sabes encender.",
    date: "Detalles",
    location: "Nuestra historia"
  },
  {
    id: "4",
    url: "https://i.pinimg.com/736x/fc/e4/7f/fce47fa337ba17e541f16de7cbe25d89.jpg",
    caption: "No hay prisa cuando se trata de construir un siempre contigo.",
    date: "Cálido amanecer",
    location: "Café y tú"
  },
  {
    id: "5",
    url: "https://i.pinimg.com/736x/50/50/c1/5050c1197287f735d8af18b49069629d.jpg",
    caption: "Incluso bajo un cielo de estrellas, tú sigues siendo mi vista preferida.",
    date: "Bajo las estrellas",
    location: "El infinito"
  }
];

export default function PhotoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, autoplay]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? defaultPhotos.length - 1 : prev - 1));
    setAutoplay(false); // disable autoplay on manual control
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === defaultPhotos.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setAutoplay(false);
  };

  const currentPhoto = defaultPhotos[currentIndex];

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      rotate: dir > 0 ? 3 : -3,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 24 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
        rotate: { duration: 0.4 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
      rotate: dir > 0 ? -3 : 3,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 24 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  return (
    <div id="photo-slider-container" className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Polaroid Deck View */}
      <div className="relative w-full aspect-[3/4] flex items-center justify-center select-none py-4">
        {/* Decorative background shadow cards for stacked physical effect */}
        <div className="absolute w-[92%] h-[92%] bg-rose-50/70 border border-rose-100 rounded-2xl shadow-sm rotate-2 translate-y-2 pointer-events-none transition-transform duration-500" />
        <div className="absolute w-[92%] h-[92%] bg-white/50 border border-rose-50 rounded-2xl shadow-md -rotate-3 translate-y-1 pointer-events-none transition-transform duration-500" />

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentPhoto.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              const swipeThreshold = 50;
              if (info.offset.x > swipeThreshold) {
                handlePrev();
              } else if (info.offset.x < -swipeThreshold) {
                handleNext();
                setAutoplay(false);
              }
            }}
            className="absolute w-[92%] h-full bg-white p-4 pb-8 rounded-2xl shadow-[0_10px_35px_rgba(244,63,94,0.08)] border border-rose-100/50 flex flex-col justify-between cursor-grab active:cursor-grabbing backface-hidden"
          >
            {/* The Image */}
            <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-rose-50 group">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Floating overlay indicators */}
              <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md py-1 px-2.5 rounded-full text-[10px] font-mono font-medium text-rose-600 tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                {currentIndex + 1} / {defaultPhotos.length}
              </div>
            </div>

            {/* Polaroid Bottom Border Writing */}
            <div className="flex flex-col pt-5 px-1 justify-between flex-grow">
              <p className="text-rose-900/90 font-serif italic text-base md:text-lg text-center leading-relaxed font-medium">
                “{currentPhoto.caption}”
              </p>

              <div className="flex justify-between items-center text-[11px] font-sans font-medium text-rose-500/60 mt-4 pt-3 border-t border-rose-100/30">
                {currentPhoto.location && (
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {currentPhoto.location}
                  </span>
                )}
                <Heart className="w-3 h-3 fill-rose-400/30 text-rose-400 animate-pulse" />
                {currentPhoto.date && (
                  <span className="flex items-center gap-0.5">
                    <Calendar className="w-3 h-3 text-rose-400" />
                    {currentPhoto.date}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Sliding Controls */}
      <div className="flex items-center justify-between w-4/5 mt-4 z-10">
        <button
          id="prev-photo-btn"
          onClick={handlePrev}
          className="p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-rose-100 hover:bg-rose-50 text-rose-600 active:scale-95 transition-all duration-200"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Navigation Indicator Dots */}
        <div className="flex gap-1.5">
          {defaultPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-6 bg-rose-500" : "w-2 bg-rose-200 hover:bg-rose-300"
              }`}
              aria-label={`Ir a foto ${index + 1}`}
            />
          ))}
        </div>

        <button
          id="next-photo-btn"
          onClick={() => {
            handleNext();
            setAutoplay(false);
          }}
          className="p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-rose-100 hover:bg-rose-50 text-rose-600 active:scale-95 transition-all duration-200"
          aria-label="Siguiente foto"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
