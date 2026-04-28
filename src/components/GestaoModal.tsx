import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, TrendingUp, DollarSign, Target, LayoutGrid, AlertTriangle, Save, Coins } from "lucide-react";
import { cn } from "@frontend/lib/utils";

interface GestaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GestaoModal({ isOpen, onClose }: GestaoModalProps) {
  const [bancaInicial, setBancaInicial] = useState(100);
  const [perfilMeta, setPerfilMeta] = useState<"CONSERVADOR" | "AGRESSIVO">("AGRESSIVO");
  const [metaDiariaPct, setMetaDiariaPct] = useState(10);
  const [stopLossPct, setStopLossPct] = useState(20);
  const [projecaoDias, setProjecaoDias] = useState(7);

  // Cálculos de Projeção (Juros Compostos)
  const projecao = useMemo(() => {
    let current = bancaInicial;
    const days = [];
    const meta = metaDiariaPct / 100;

    for (let i = 1; i <= projecaoDias; i++) {
      current = current * (1 + meta);
      days.push({
        dia: i,
        valor: current
      });
    }
    return days;
  }, [bancaInicial, metaDiariaPct, projecaoDias]);

  // Cálculos de Stake
  const stakeConservadora = (bancaInicial * 0.05).toFixed(2);
  const stakeAgressiva = (bancaInicial * 0.10).toFixed(2);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col max-h-[95vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <LayoutGrid className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">Planilha Inteligente</h2>
                <p className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase mt-1">Gestão Profissional</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {/* Row 1: Configurações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <DollarSign className="h-3 w-3" /> Banca Inicial
                </label>
                <div className="bg-black border border-white/5 rounded-2xl p-4 focus-within:border-blue-500/50 transition-all">
                  <div className="flex items-baseline gap-2">
                    <span className="text-blue-500 font-bold text-xs">R$</span>
                    <input 
                      type="number" 
                      value={bancaInicial}
                      onChange={(e) => setBancaInicial(Number(e.target.value))}
                      className="bg-transparent border-none p-0 text-xl font-black italic text-white focus:ring-0 w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Target className="h-3 w-3" /> Perfil de Meta
                </label>
                <div className="bg-black border border-white/5 rounded-2xl p-1 flex h-[58px]">
                  <button 
                    onClick={() => { setPerfilMeta("CONSERVADOR"); setMetaDiariaPct(5); }}
                    className={cn(
                      "flex-1 rounded-xl text-[8px] font-black uppercase italic transition-all flex flex-col items-center justify-center",
                      perfilMeta === "CONSERVADOR" ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"
                    )}
                  >
                    Conservador
                    <span className="opacity-50">(5%)</span>
                  </button>
                  <button 
                    onClick={() => { setPerfilMeta("AGRESSIVO"); setMetaDiariaPct(10); }}
                    className={cn(
                      "flex-1 rounded-xl text-[8px] font-black uppercase italic transition-all flex flex-col items-center justify-center",
                      perfilMeta === "AGRESSIVO" ? "bg-red-600/20 text-red-500 border border-red-500/20" : "text-zinc-600 hover:text-zinc-400"
                    )}
                  >
                    Agressivo
                    <span className="opacity-50">(10%)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" /> Meta Diária (%)
                </label>
                <div className="bg-black border border-white/5 rounded-2xl p-4 focus-within:border-blue-500/50 transition-all">
                  <input 
                    type="number" 
                    value={metaDiariaPct}
                    onChange={(e) => setMetaDiariaPct(Number(e.target.value))}
                    className="bg-transparent border-none p-0 text-xl font-black italic text-yellow-500 focus:ring-0 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Stop Loss */}
            <div className="w-1/3 space-y-2">
               <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-red-500" /> Stop Loss (%)
                </label>
                <div className="bg-black border border-white/5 rounded-2xl p-4 focus-within:border-red-500/50 transition-all">
                  <input 
                    type="number" 
                    value={stopLossPct}
                    onChange={(e) => setStopLossPct(Number(e.target.value))}
                    className="bg-transparent border-none p-0 text-xl font-black italic text-red-500 focus:ring-0 w-full"
                  />
                </div>
            </div>

            {/* Projeção */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest italic">Projeção de Metas Batidas</h3>
                  <div className="bg-black rounded-lg p-1 flex gap-1">
                    {[7, 15, 30].map(d => (
                      <button 
                        key={d}
                        onClick={() => setProjecaoDias(d)}
                        className={cn(
                          "px-4 py-1.5 rounded-md text-[9px] font-black uppercase transition-all",
                          projecaoDias === d ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-zinc-600 hover:text-zinc-400"
                        )}
                      >
                        {d} Dias
                      </button>
                    ))}
                  </div>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {projecao.slice(0, 10).map((p) => (
                    <div key={p.dia} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center group hover:border-blue-500/30 transition-all">
                       <p className="text-[8px] font-bold text-zinc-500 uppercase mb-2">Dia {p.dia}</p>
                       <p className="text-xs font-black italic text-white">R$ {p.valor.toFixed(2)}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Stake Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h4 className="text-blue-400 text-xs font-black italic uppercase">Stake: Conservador</h4>
                        <div className="bg-blue-500/10 px-2 py-0.5 rounded text-[8px] font-black text-blue-500 uppercase mt-1 inline-block">5% Unid.</div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Unidade Base</span>
                        <span className="text-xl font-black italic text-white">R$ {stakeConservadora}</span>
                     </div>
                     <div className="h-px bg-white/5" />
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Operação Direta</span>
                        <span className="text-xl font-black italic text-blue-400">R$ {stakeConservadora}</span>
                     </div>
                  </div>
                  <p className="mt-8 text-[9px] text-zinc-600 font-medium leading-relaxed uppercase">Gestão conservadora focada em blindagem de patrimônio e crescimento sustentável.</p>
               </div>

               <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h4 className="text-red-500 text-xs font-black italic uppercase">Stake: Agressivo</h4>
                        <div className="bg-red-500/10 px-2 py-0.5 rounded text-[8px] font-black text-red-500 uppercase mt-1 inline-block">10% Unid.</div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Unidade Base</span>
                        <span className="text-xl font-black italic text-white">R$ {stakeAgressiva}</span>
                     </div>
                     <div className="h-px bg-white/5" />
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Operação Direta</span>
                        <span className="text-xl font-black italic text-red-500">R$ {stakeAgressiva}</span>
                     </div>
                  </div>
                  <p className="mt-8 text-[9px] text-zinc-600 font-medium leading-relaxed uppercase">Foco em alavancagem rápida, alto risco e exposição. Recomendado para bancas menores.</p>
               </div>
            </div>

            {/* Presets */}
            <div className="pt-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-2">
                    <Save className="h-3 w-3" /> Seus Presets
                  </h4>
                  <button className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-500/20 px-4 py-2 rounded-lg text-[10px] font-black uppercase italic transition-all">
                    Salvar Atual
                  </button>
                </div>
                <div className="bg-black/40 border border-dashed border-white/10 rounded-2xl py-12 text-center">
                   <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest italic">Nenhum preset salvo</p>
                </div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="p-8 bg-zinc-900/50 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
             <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center border border-yellow-500/20">
                  <Coins className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase">Lucro Esperado Hoje</p>
                  <p className="text-lg font-black italic text-yellow-500">R$ {(bancaInicial * (metaDiariaPct/100)).toFixed(2)}</p>
                </div>
             </div>
             <button 
              onClick={onClose}
              className="h-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] uppercase italic tracking-tighter text-sm shadow-xl shadow-blue-600/20"
            >
              Fechar Gerenciador
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
