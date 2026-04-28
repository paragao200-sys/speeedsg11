import React from "react";
import { motion } from "motion/react";
import { LayoutGrid } from "lucide-react";

export default function CardAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-12">
      <div className="relative w-48 h-32 flex justify-center">
        {/* Card 1 */}
        <motion.div
           animate={{ 
             x: [-20, 20, -20],
             rotateY: [0, 180, 360],
             z: [0, 20, 0]
           }}
           transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
           className="absolute w-24 h-32 bg-zinc-800 border-2 border-white/10 rounded-xl shadow-2xl flex items-center justify-center overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
           <LayoutGrid className="h-10 w-10 text-cyan-500/20" />
        </motion.div>

        {/* Card 2 */}
        <motion.div
           animate={{ 
             x: [20, -20, 20],
             rotateY: [180, 360, 540],
             z: [20, 0, 20]
           }}
           transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
           className="absolute w-24 h-32 bg-zinc-800 border-2 border-white/10 rounded-xl shadow-2xl flex items-center justify-center overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
           <LayoutGrid className="h-10 w-10 text-red-500/20" />
        </motion.div>
      </div>

      <div className="text-center">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em] mb-2">Decisão em Processamento</p>
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-cyan-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
