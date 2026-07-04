import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, X, Sparkles, Mail, LockOpen, Check } from "lucide-react";

export default function SecretLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSealed, setIsSealed] = useState(true);

  const handleOpenLetter = () => {
    setIsSealed(false);
    // Allow a small delay for seal breaking animation before showing text
    setTimeout(() => {
      setIsOpen(true);
    }, 400);
  };

  const handleCloseLetter = () => {
    setIsOpen(false);
    setIsSealed(true);
  };

  // Staggered fade-in variants for each letter paragraph
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6, // Reveal paragraphs sequentially
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    },
  };

  return (
    <div id="secret-letter-section" className="flex flex-col items-center justify-center w-full my-6 z-10 relative">
      {/* Sealed Envelope / Wax Stamp Button */}
      <AnimatePresence mode="wait">
        {isSealed && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            {/* The Sealed Button itself */}
            <button
              id="secret-wax-seal-btn"
              onClick={handleOpenLetter}
              className="relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-300 rounded-2xl p-1"
              aria-label="Abrir carta secreta"
            >
              {/* Pulsing Backing Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-200 to-rose-300 rounded-2xl blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow" />
              
              {/* Outer Envelope Wrapper */}
              <div className="relative bg-white/95 border border-rose-100 px-6 py-5 rounded-2xl shadow-[0_10px_30px_rgba(244,63,94,0.06)] flex flex-col items-center gap-2.5 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="p-3 bg-rose-50 rounded-full text-rose-500">
                  <Mail className="w-6 h-6 animate-bounce" />
                </div>
                
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-spin" />
                  Botón Secreto
                </span>
                
                <h4 className="text-sm font-semibold text-neutral-700 font-sans px-2 text-center">
                  Tengo algo especial que contarte...
                </h4>

                {/* Simulated physical wax heart seal */}
                <div className="absolute -bottom-3 bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 w-10 h-10 rounded-full shadow-md flex items-center justify-center border-2 border-rose-400 active:scale-90 transition-transform duration-100">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
            </button>
            <p className="text-[11px] font-mono text-rose-500/60 mt-2 text-center">
              (Pulsa el sello para revelar la carta oculta)
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Letter Overlay / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Overlay Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* The Letter Paper */}
            <motion.div
              initial={{ scale: 0.9, y: 30, rotate: -1 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.9, y: 30, rotate: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-xl bg-[#fffdfa] border-2 border-[#f4eae1] rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col max-h-[90vh] overflow-y-auto"
              style={{ backgroundImage: "radial-gradient(#fbf7f2 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseLetter}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                aria-label="Cerrar carta"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative Header */}
              <div className="flex flex-col items-center gap-2 border-b border-rose-100 pb-5 mb-6 text-center select-none">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-rose-400 font-semibold uppercase">
                  Confidencia para el alma
                </span>
              </div>

              {/* Letter Content */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-5 text-neutral-700/90 font-serif leading-relaxed text-[15px] md:text-[17px] text-justify font-medium"
              >
                <motion.h2 
                  variants={itemVariants}
                  className="text-2xl md:text-3xl text-rose-700 font-serif font-semibold text-center italic mb-2"
                >
                  Para ti
                </motion.h2>

                <motion.p variants={itemVariants}>
                  Hay promesas que no necesitan grandes discursos.
                  Solo una mirada, una sonrisa y la decisión de quedarse.
                </motion.p>

                <motion.p variants={itemVariants}>
                  Este espacio es una forma de decirte que, cada día, te elegiría de nuevo.
                  Que mi cariño está en los pequeños detalles, en el tiempo compartido y en todo lo que aún nos queda por vivir.
                </motion.p>

                <motion.p variants={itemVariants}>
                  Si pudiera demostrarte lo que siento de una sola manera, sería estando a tu lado, hoy y siempre.
                </motion.p>

                <motion.p variants={itemVariants}>
                  Porque amarte no es solo un sentimiento.
                  Es una elección que haría una y otra vez.
                </motion.p>

                <motion.div 
                  variants={itemVariants} 
                  className="flex flex-col items-center mt-6 pt-6 border-t border-rose-100/60 text-center"
                >
                  <p className="text-rose-600 font-serif italic text-lg md:text-xl font-semibold">
                    Siempre tú. Siempre nosotros. 🤍
                  </p>
                  
                  <button
                    onClick={handleCloseLetter}
                    className="mt-6 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs font-semibold shadow-sm hover:shadow active:scale-95 transition-all duration-200"
                  >
                    <Check className="w-4 h-4" /> Guardar en el corazón
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
