/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Heart, Sparkles, Calendar } from "lucide-react";
import FloatingHearts from "./components/FloatingHearts";
import PhotoSlider from "./components/PhotoSlider";
import MusicPlayer from "./components/MusicPlayer";
import SecretLetter from "./components/SecretLetter";

export default function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#fffafb] via-[#fff5f6] to-[#fffafb] text-neutral-800 flex flex-col justify-between overflow-x-hidden select-none">
      {/* 1. Interactive 60fps Floating Hearts Background */}
      <FloatingHearts />

      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-rose-200/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-pink-100/30 blur-[120px] pointer-events-none" />

      {/* 2. Main Content Container */}
      <main className="relative z-10 flex-grow w-full max-w-lg mx-auto px-5 py-8 md:py-12 flex flex-col items-center justify-center gap-8">
        
        {/* Header - Delicate & Editorial */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center flex flex-col items-center gap-2.5 w-full mt-4"
        >
          {/* Pulsing Rose Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/60 border border-rose-200/40 text-rose-600 text-[11px] font-mono tracking-widest uppercase font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            Solo para ti
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-rose-950 tracking-tight leading-tight mt-1">
            Nuestros Momentos
          </h1>
          
          <p className="text-xs md:text-sm font-sans text-neutral-500/90 max-w-xs leading-relaxed">
            Un pequeño rincón dedicado a recordar lo bonito que es tenerte en mi vida.
          </p>

          {/* Minimal floral divider line */}
          <div className="flex items-center gap-2 w-1/3 mt-2">
            <div className="h-[1px] bg-gradient-to-r from-transparent to-rose-200 flex-grow" />
            <Sparkles className="w-3 h-3 text-rose-400 animate-spin" style={{ animationDuration: "8s" }} />
            <div className="h-[1px] bg-gradient-to-l from-transparent to-rose-200 flex-grow" />
          </div>
        </motion.header>

        {/* Polaroid Slider Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="w-full flex justify-center"
        >
          <PhotoSlider />
        </motion.section>

        {/* Music Player Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          <MusicPlayer />
        </motion.section>

        {/* Secret Letter Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full"
        >
          <SecretLetter />
        </motion.section>

      </main>

      {/* 3. Footer - Styled with maximum restraint */}
      <footer className="relative z-10 w-full text-center pb-8 pt-4 select-none">
        <div className="flex flex-col items-center gap-1">
          <p className="text-[11px] font-mono text-rose-400/60 uppercase tracking-widest flex items-center gap-1 justify-center">
            Hecho con amor 🤍
          </p>
          <p className="text-[10px] font-sans text-neutral-400">
            {new Date().getFullYear()} • Siempre nosotros
          </p>
        </div>
      </footer>
    </div>
  );
}
