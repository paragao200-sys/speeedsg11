import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, ShieldCheck, LogOut, Terminal, Zap, Trophy, Spade, Cpu, ArrowLeft, ChevronRight, History, Calculator, Loader2, Target, TrendingUp, Clock } from "lucide-react";
import { useAuth } from "@frontend/context/AuthContext";
import GestaoModal from "../components/GestaoModal";
import DiceAnimation from "../components/DiceAnimation";
import CardAnimation from "../components/CardAnimation";
import { cn } from "@frontend/lib/utils";

type Game = "BAC_BO" | "FOOTBALL_STUDIO" | "BACCARAT" | null;

interface Signal {
  id: string;
  game: string;
  prediction: string;
  possibleValue?: string;
  assertiveness: number;
  time: string;
  result: "WIN" | "LOSS";
  active: boolean;
}

export default function UserApp() {
  const { user, logout } = useAuth();
  const [selectedGame, setSelectedGame] = useState<Game>(null);
  const [strategy, setStrategy] = useState<"SEM_GALE" | "GALE_1">("SEM_GALE");
  const [nextTimes, setNextTimes] = useState<any[]>([]);
  
  // Modals state
  const [isGestaoOpen, setIsGestaoOpen] = useState(false);

  // Signalizer state
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [history, setHistory] = useState<Signal[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(false);

  // Generate dynamic next times
  useEffect(() => {
    if (selectedGame) {
      const times = [];
      const now = new Date();
        for (let i = 1; i <= 5; i++) {
          const future = new Date(now.getTime() + (i * 4 + Math.random() * 2) * 60000);
          const types = ["BLUE", "BLUE", "RED", "RED", "EMPATE"]; // 20% tie chance
          const type = types[Math.floor(Math.random() * types.length)];
          times.push({
            time: future.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            type: type,
            prob: Math.floor(Math.random() * (98 - 85 + 1) + 85),
            color: type === "EMPATE" ? "text-yellow-500" : type === "BLUE" ? "text-cyan-400 font-bold" : "text-red-500 font-bold",
            bg: type === "EMPATE" ? "bg-yellow-500" : type === "BLUE" ? "bg-cyan-500" : "bg-red-500",
            borderColor: type === "EMPATE" ? "border-yellow-500/40" : type === "BLUE" ? "border-cyan-500/40" : "border-red-500/40"
          });
        }
      setNextTimes(times);
    }
  }, [selectedGame]);

  const games = [
    {
      id: "BACCARAT" as const,
      name: "SPEED BACCARAT BRASILEIRO",
      subtitle: "NEURAL PREDICTOR V4.0",
      icon: Spade,
      color: "bg-blue-600",
      shadow: "shadow-blue-500/20",
      predictions: ["AZUL", "VERMELHO", "EMPATE (TIE)"],
    },
    {
      id: "BAC_BO" as const,
      name: "BAC BO",
      subtitle: "NEURAL PREDICTOR V4.0",
      icon: Cpu,
      color: "bg-red-600",
      shadow: "shadow-red-500/20",
      predictions: ["AZUL", "VERMELHO", "EMPATE"],
    },
    {
      id: "FOOTBALL_STUDIO" as const,
      name: "FOOTBALL STUDIO",
      subtitle: "NEURAL PREDICTOR V4.0",
      icon: Trophy,
      color: "bg-amber-600",
      shadow: "shadow-amber-500/20",
      predictions: ["CASA", "FORA", "EMPATE"],
    },
  ];

  const currentGameData = games.find(g => g.id === selectedGame);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`history_${selectedGame}`);
    if (saved) setHistory(JSON.parse(saved));
  }, [selectedGame]);

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && currentSignal?.active) {
      resolveCurrentSignal();
      
      // Auto-loop if continuous mode is active
      if (isAutoMode) {
        setTimeout(() => {
          generateSignal();
        }, 5000); // 5 seconds interval between auto-signals
      }
    }
    return () => clearInterval(timer);
  }, [timeLeft, currentSignal, isAutoMode, selectedGame]); // Added deps to ensure trigger

  const generateSignal = () => {
    if (!currentGameData) return;
    setAnalyzing(true);
    setIsProcessing(false);
    setCurrentSignal(null);

    // Initial analysis phase
    setTimeout(() => {
      setAnalyzing(false);
      setIsProcessing(true);

      // Game-specific processing phase (2-6 seconds)
      const processingTime = Math.floor(Math.random() * (6000 - 2000 + 1) + 2000);

      setTimeout(() => {
        const minAssert = strategy === "SEM_GALE" ? 82 : 86;
        const maxAssert = strategy === "SEM_GALE" ? 93 : 98;
        
        const now = new Date();
        const minutes = now.getMinutes();
        let prediction = "";

        if (strategy === "GALE_1") {
          // Regra G1: Minutos pares (incluindo final 0) = AZUL, Ímpares = VERMELHO
          if (minutes % 2 === 0) {
            prediction = selectedGame === "FOOTBALL_STUDIO" ? "FORA" : "AZUL";
          } else {
            prediction = selectedGame === "FOOTBALL_STUDIO" ? "CASA" : "VERMELHO";
          }
        } else {
          // Weighted selection: High chance for Blue/Red, very low for Tie
          const rand = Math.random();
          const preds = currentGameData.predictions;
          const isTie = (p: string) => p.includes("EMPATE") || p.includes("TIE");
          
          if (rand < 0.05) { // 5% chance for Tie
            prediction = preds.find(isTie) || preds[0];
          } else {
            const noTies = preds.filter(p => !isTie(p));
            prediction = noTies[Math.floor(Math.random() * noTies.length)];
          }
        }

        // Generate possible value based on game
        let possibleValue = "";
        if (selectedGame === "BAC_BO") {
          possibleValue = (Math.floor(Math.random() * (12 - 3 + 1)) + 3).toString();
        } else if (selectedGame === "FOOTBALL_STUDIO") {
          const cards = ["3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
          possibleValue = cards[Math.floor(Math.random() * cards.length)];
        }

        const newSignal: Signal = {
          id: Math.random().toString(36).substr(2, 9),
          game: currentGameData.name,
          prediction: prediction,
          possibleValue: possibleValue, // Add the value here
          assertiveness: Math.floor(Math.random() * (maxAssert - minAssert + 1) + minAssert),
          time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          result: "WIN", // Initial placeholder
          active: true,
        };

        setCurrentSignal(newSignal);
        setIsProcessing(false);
        setTimeLeft(12); // 12 seconds for signal
      }, processingTime);
    }, 1500);
  };

  const resolveCurrentSignal = () => {
    if (!currentSignal) return;
    
    // Instead of confirming win/loss, we keep "loading/hacking" status
    const resolvedSignal = { ...currentSignal, active: false, result: "WIN" as const }; // Using WIN as default internal state
    
    setCurrentSignal(resolvedSignal);
  };

  if (!selectedGame) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col relative overflow-hidden">
        {/* Botão de logout invisível canto superior esquerdo */}
        <button
          onClick={logout}
          className="absolute top-3 left-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-[10px] text-zinc-500 hover:text-red-400 uppercase tracking-widest"
        >
          <LogOut className="h-3 w-3" />
          sair
        </button>

        {/* Top Status Bar */}
        <div className="w-full bg-black/80 backdrop-blur-md border-b border-white/5 py-2 px-6 flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest z-50">
          <div className="flex gap-2">
            <span className="text-zinc-500">BANCA:</span>
            <span className="text-blue-400">R$ 100.00</span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-500">META (10%):</span>
            <span className="text-yellow-400">R$ 10.00</span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-500">STAKE:</span>
            <span className="text-red-500">R$ 10.00</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
              SELECIONE O <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">TERMINAL</span>
            </h1>
            <div className="h-1 w-32 bg-blue-600 mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {games.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-white/5 rounded-[2.5rem] border border-white/5 group-hover:border-white/20 transition-all pointer-events-none" />
                <div className="p-10 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 ${game.color} rounded-2xl flex items-center justify-center mb-10 shadow-2xl ${game.shadow} transform -rotate-3 group-hover:rotate-0 transition-transform`}>
                    <game.icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2 leading-tight h-16 flex items-center">
                    {game.name}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase mb-12">
                    {game.subtitle}
                  </p>

                  <div className="w-full h-px bg-white/5 mb-10" />

                  <button 
                    onClick={() => setSelectedGame(game.id)}
                    className="w-full bg-zinc-900 hover:bg-white hover:text-black text-white font-black py-4 rounded-2xl border border-white/10 transition-all uppercase italic tracking-tighter text-xs"
                  >
                    ATIVAR TERMINAL
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 flex items-center gap-3 text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">
            <Activity className="h-3 w-3 animate-pulse" />
            SINCRONIZANDO COM EVOLUTION GAMING LIVE
          </div>
        </div>

        {/* Global Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full bg-blue-600/5 blur-[150px] pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-cyan-600/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between p-6 lg:px-0 relative z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setSelectedGame(null);
              setCurrentSignal(null);
            }}
            className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all text-zinc-400 hover:text-white group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight uppercase italic flex items-center gap-2">
              <span className={currentGameData?.color.replace('bg-', 'text-')}>#{selectedGame}</span> TERMINAL
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest uppercase italic">Conectando ao núcleo neural</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAutoMode(!isAutoMode)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
              isAutoMode 
                ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/40" 
                : "bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10"
            )}
          >
            <div className="relative">
              <Activity className={cn("h-4 w-4", isAutoMode && "animate-pulse")} />
              {isAutoMode && <div className="absolute inset-0 bg-cyan-400 blur-sm animate-pulse opacity-50" />}
            </div>
            {isAutoMode ? "Ação Ativa" : "Ação Inativa"}
          </button>
          <button 
            onClick={() => setIsGestaoOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-zinc-400 hover:text-white"
          >
            <Calculator className="h-4 w-4" />
            Gestão
          </button>
        </div>
      </header>

      {/* Main Signalizer Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full flex flex-col items-center p-6 relative z-10 overflow-y-auto">
        
        {/* Gale Selector */}
        <div className="flex gap-4 mb-12 w-full max-w-md">
          <button 
            disabled={analyzing || isProcessing}
            onClick={() => setStrategy("SEM_GALE")}
            className={cn(
              "flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1",
              strategy === "SEM_GALE" 
                ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-600/20" 
                : "bg-white/5 border-white/5 text-zinc-500 grayscale opacity-40"
            )}
          >
            <div className="flex items-center gap-2 text-xs font-black italic uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sem Gale
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Conservador</span>
          </button>

          <button 
            disabled={analyzing || isProcessing}
            onClick={() => setStrategy("GALE_1")}
            className={cn(
              "flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1",
              strategy === "GALE_1" 
                ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-600/20" 
                : "bg-white/5 border-white/5 text-zinc-500 grayscale opacity-40"
            )}
          >
            <div className="flex items-center gap-2 text-xs font-black italic uppercase">
              <Zap className="h-3.5 w-3.5" />
              Até Gale 1
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Agressivo</span>
          </button>
        </div>

        <div className="w-full max-w-2xl mb-12">
          <AnimatePresence mode="wait">
            {!currentSignal && !analyzing && !isProcessing ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center text-center py-10"
              >
                <div className={`w-32 h-32 rounded-[2.5rem] ${currentGameData?.color} flex items-center justify-center mb-12 shadow-2xl ${currentGameData?.shadow} animate-pulse`}>
                   {currentGameData && <currentGameData.icon className="h-16 w-16 text-white" />}
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-4 leading-tight">
                  Aguardando <span className="text-zinc-500">Próxima Oportunidade</span>
                </h2>
                <button 
                  onClick={generateSignal}
                  className="bg-white text-black font-black px-12 py-5 rounded-3xl text-lg transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] uppercase italic tracking-tighter"
                >
                  Identificar Sinal
                </button>
              </motion.div>
            ) : analyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center py-10"
              >
                <div className="relative w-32 h-32 mb-12">
                   <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                   <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <Cpu className="h-10 w-10 text-blue-500 animate-pulse" />
                   </div>
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2 leading-none">Processando Núcleo</h2>
                <p className="text-zinc-500 font-mono text-[10px] mt-4 uppercase tracking-[0.4em]">Decrypting Data Streams...</p>
              </motion.div>
            ) : isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="bg-zinc-900/50 border border-white/5 rounded-[3rem] p-12 backdrop-blur-sm"
              >
                {selectedGame === "BAC_BO" ? (
                  <DiceAnimation />
                ) : (
                  <CardAnimation />
                )}
                
                <div className="mt-8 text-center">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Calculando Probabilidades</h3>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-[0.5em] mt-2">Evolution Live Feed Data Processing</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                {/* Dynamic Theme Colors */}
                {(() => {
                  const isBlue = currentSignal.prediction === "AZUL" || currentSignal.prediction === "FORA";
                  const isRed = currentSignal.prediction === "VERMELHO" || currentSignal.prediction === "CASA";
                  const themeColor = isBlue ? "text-cyan-400" : isRed ? "text-red-500" : "text-yellow-500";
                  const themeBg = isBlue ? "bg-cyan-500" : isRed ? "bg-red-600" : "bg-yellow-500";
                  const themeGlow = isBlue ? "shadow-[0_0_60px_rgba(6,182,212,0.4)] ring-2 ring-cyan-500/20" : isRed ? "shadow-[0_0_50px_rgba(239,68,68,0.3)]" : "shadow-[0_0_50px_rgba(234,179,8,0.2)]";

                  return (
                    <div key={currentSignal.id} className="relative w-full max-w-2xl">
                      <div className={`absolute inset-0 blur-[130px] opacity-30 pointer-events-none transition-all duration-1000 ${isBlue ? 'bg-cyan-500 scale-125' : isRed ? 'bg-red-600' : 'bg-zinc-500'}`} />
                      <div className={cn("bg-zinc-950 border border-white/10 rounded-[3.5rem] p-8 md:p-14 relative z-10 transition-all duration-500", themeGlow, isBlue && "scale-[1.02]")}>
                        <div className="flex justify-between items-start mb-12">
                          <div className="space-y-4">
                            <span className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]", isBlue ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-zinc-400")}>
                              <Activity className="h-3 w-3 animate-pulse" />
                              Sinal Operativo Confirmado
                            </span>
                            <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
                              Entrada <span className={cn(themeColor, isBlue && "drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]")}>Detectada</span>
                            </h2>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 font-mono">Assertividade</p>
                             <p className={cn("text-5xl font-black italic leading-none drop-shadow-lg", themeColor)}>{currentSignal.assertiveness}%</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                          <motion.div 
                            initial={{ scale: 0.98 }}
                            animate={{ scale: 1 }}
                            className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 text-center relative overflow-hidden group/card"
                          >
                             <div className="relative z-10">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mb-6">Padrão Identificado</p>
                                <div className="flex flex-col items-center">
                                   <motion.div 
                                      animate={{ 
                                        y: [0, -4, 0],
                                        boxShadow: isBlue ? ["0 0 20px rgba(6,182,212,0.2)", "0 0 40px rgba(6,182,212,0.4)", "0 0 20px rgba(6,182,212,0.2)"] : []
                                      }}
                                      transition={{ repeat: Infinity, duration: 2 }}
                                      className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transition-all", themeBg, isBlue && "shadow-cyan-500/50 scale-110")}
                                   >
                                     {currentGameData && <currentGameData.icon className="h-10 w-10 text-white" />}
                                   </motion.div>
                                   <p className={cn("font-black italic uppercase tracking-tighter leading-none transition-all", themeColor, isBlue ? "text-6xl drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]" : "text-5xl")}>
                                     {currentSignal.prediction}
                                   </p>
                                   {currentSignal.possibleValue && (
                                     <div className="mt-4 px-4 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                       <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                         Possível: <span className="text-white">{currentSignal.possibleValue}</span>
                                       </p>
                                     </div>
                                   )}
                                </div>
                             </div>
                             <div className={cn("absolute inset-x-0 bottom-0 h-1.5 opacity-50 animate-pulse", themeBg)} />
                          </motion.div>

                          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 flex flex-col justify-center items-center">
                            <div className="text-center">
                              <p className={cn("text-5xl font-black italic tracking-[0.1em] leading-none", isBlue || isRed ? "text-white" : "text-zinc-500")}>
                                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                              </p>
                              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.5em] mt-6">Expiring Session</p>
                            </div>
                          </div>
                        </div>

                        {!currentSignal.active ? (
                          <button 
                            onClick={() => {
                              if (isAutoMode) {
                                setIsAutoMode(false);
                              } else {
                                generateSignal();
                              }
                            }}
                            className={cn(
                              "w-full font-black py-6 rounded-3xl text-xl transition-all active:scale-[0.98] uppercase italic tracking-tighter flex items-center justify-center gap-4",
                              isAutoMode
                                ? "bg-red-500/10 border-2 border-red-500/30 text-red-500"
                                : "bg-white/5 border-2 border-white/10 text-white hover:bg-white/10"
                            )}
                          >
                            {isAutoMode ? (
                              <>
                                <Zap className="h-6 w-6 animate-pulse" />
                                Parar Fluxo Contínuo
                              </>
                            ) : (
                              <>
                                <Loader2 className="h-6 w-6 animate-spin" />
                                Hackeando Sistema...
                              </>
                            )}
                          </button>
                        ) : (
                          <button 
                            className={cn(
                              "w-full text-black font-black py-6 rounded-3xl text-2xl transition-all active:scale-[0.95] flex items-center justify-center gap-4 uppercase italic tracking-tighter hover:brightness-110 relative overflow-hidden group",
                              themeBg, 
                              themeGlow,
                              isBlue ? "ring-2 ring-cyan-400/20" : "ring-2 ring-red-400/20"
                            )}
                            onClick={() => window.open('https://go.aff.casadeapostas.bet.br/jg6y1exs', '_blank')}
                          >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="absolute inset-x-0 bottom-0 h-1 bg-white/20"
                            />
                            ENTRAR NA OPERAÇÃO
                            <Zap className="h-7 w-7 fill-black animate-pulse" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Next Times Section */}
        <div className="w-full bg-black/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 mb-20">
           <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black italic tracking-tighter uppercase text-white leading-none">
                 Próximos <span className="text-zinc-500">Horários</span>
              </h2>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2">
                 <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                 <span className="text-[10px] font-black italic uppercase text-yellow-500">Previsão</span>
              </div>
           </div>

           <div className="space-y-4">
              {nextTimes.map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-white/10 transition-all">
                   <div className="flex items-center gap-8">
                      <p className="text-xl font-black italic text-white leading-none">{item.time}</p>
                      <div className={cn("px-4 py-1.5 rounded-xl bg-black/40 border text-[9px] font-black italic uppercase shadow-[0_0_10px_rgba(255,255,255,0.05)]", item.color, item.borderColor)}>
                         {item.type}
                      </div>
                   </div>
                   <div className="flex items-center gap-6 flex-1 max-w-xs ml-auto">
                      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                         <div className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000", item.bg)} style={{ width: `${item.prob}%` }} />
                      </div>
                      <p className={cn("text-lg font-black italic leading-none whitespace-nowrap drop-shadow-md", item.color)}>{item.prob}%</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>

      <footer className="w-full max-w-6xl mx-auto p-6 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 border-t border-white/5 opacity-50">
         <div className="flex flex-col items-center sm:items-start">
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Criptografia de Sessão</p>
            <p className="text-[11px] font-mono text-zinc-300">ACTIVE_TUNNEL_0492-X</p>
         </div>
         <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em]">
           Neural Core v4.0.2
         </div>
      </footer>

      {/* Modals */}
      <GestaoModal isOpen={isGestaoOpen} onClose={() => setIsGestaoOpen(false)} />
    </div>
  );
}
