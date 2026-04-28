import React, { useEffect, useState } from "react";
import { Users, UserCheck, UserX, Clock, ArrowRight, TrendingUp, ShieldAlert, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import api from "@frontend/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/users");
      setStats(response.data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Base de Usuários", value: stats.total, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12%" },
    { label: "Assinaturas Ativas", value: stats.active, icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "Em dia" },
    { label: "Acessos Expirados", value: stats.expired, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", trend: "Requer atenção" },
    { label: "Contas Bloqueadas", value: stats.inactive, icon: UserX, color: "text-rose-500", bg: "bg-rose-500/10", trend: "Suspenso" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="flex flex-col items-center gap-4">
        <Activity className="h-8 w-8 text-indigo-600 animate-pulse" />
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Sincronizando Dados...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Sistemas Operacionais Online</p>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Centro de Comando</h1>
          <p className="text-slate-500 mt-1 max-w-md font-light">Monitoramento em tempo real de licenças, integrações e métricas de engajamento dos usuários.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right hidden sm:block">
              <p className="text-xs font-mono text-slate-400 uppercase">Última Atualização</p>
              <p className="text-sm font-semibold text-slate-700">Hoje, {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
           </div>
           <button onClick={fetchStats} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm shadow-sm flex items-center gap-2">
             <Activity className="h-4 w-4" />
             Atualizar
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="tech-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <span className={`text-[10px] font-mono px-2 py-1 rounded bg-slate-100 text-slate-600`}>
                {card.trend}
              </span>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="tech-card">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Métricas de Performance</h2>
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="p-8">
               <div className="h-64 flex items-end justify-between gap-2">
                 {[40, 70, 45, 90, 65, 80, 50, 60, 85, 45, 75, 95].map((h, i) => (
                   <div key={i} className="flex-1 space-y-2 group">
                      <div className="h-full flex flex-col justify-end">
                         <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05, duration: 0.8 }}
                          className="bg-indigo-600/10 group-hover:bg-indigo-600/40 rounded-t-sm transition-colors border-t-2 border-indigo-600" 
                         />
                      </div>
                      <p className="text-[9px] font-mono text-slate-400 text-center uppercase">m{i+1}</p>
                   </div>
                 ))}
               </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="tech-card bg-indigo-600 text-white border-0 shadow-xl shadow-indigo-600/20">
            <div className="p-8">
              <ShieldAlert className="h-10 w-10 mb-6 text-indigo-200" />
              <h3 className="text-2xl font-bold mb-4 leading-tight">Segurança Integrada v2.0</h3>
              <p className="text-indigo-100 font-light mb-8 leading-relaxed">
                Todos os tokens JWT são renovados automaticamente e o banco de dados é criptografado em repouso.
              </p>
              <Link
                to="/users"
                className="w-full flex items-center justify-center py-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all font-semibold backdrop-blur-sm border border-white/10 gap-2"
              >
                Gerenciar Acessos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <section className="tech-card p-8">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-6">Logs de Atividade</h3>
            <div className="space-y-6">
              {[
                { event: "Login Admin", time: "Há 2 min", user: "Admin", status: "success" },
                { event: "Usuário Expirado", time: "Há 15 min", user: "João S.", status: "warning" },
                { event: "Novo Cadastro", time: "Há 1h", user: "Maria F.", status: "info" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    log.status === 'success' ? 'bg-emerald-500' : 
                    log.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{log.event}</p>
                    <p className="text-xs text-slate-500">{log.user} • {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
