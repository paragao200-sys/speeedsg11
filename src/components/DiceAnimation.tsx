import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function DiceAnimation() {
  const [val1, setVal1] = useState(1);
  const [val2, setVal2] = useState(1);
  const [multiplier, setMultiplier] = useState(1.00);

  useEffect(() => {
    const interval = setInterval(() => {
      setVal1(Math.floor(Math.random() * 6) + 1);
      setVal2(Math.floor(Math.random() * 6) + 1);
      setMultiplier(Number((Math.random() * 10).toFixed(2)));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-10">
      <div className="flex gap-6">
        <motion.div 
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
          className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-red-600/30 border-2 border-red-400/20"
        >
          {val1}
        </motion.div>
        <motion.div 
          animate={{ rotate: [0, -90, -180, -270, -360] }}
          transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
          className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-blue-600/30 border-2 border-blue-400/20"
        >
          {val2}
        </motion.div>
      </div>
      
      <div className="flex flex-col items-center">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] mb-2 font-mono">Simulando Rodada</p>
        <div className="text-4xl font-black italic text-cyan-400 tabular-nums">
          {multiplier.toFixed(2)}x
        </div>
      </div>

      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: "100%" }}
           transition={{ duration: 0.5, repeat: Infinity }}
           className="absolute inset-0 bg-gradient-to-r from-red-500 via-white to-blue-500"
         />
      </div>
    </div>
  );
}
