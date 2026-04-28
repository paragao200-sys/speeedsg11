import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Cpu, Binary, Loader2 } from "lucide-react";
import api from "@frontend/lib/api";
import { useAuth } from "@frontend/context/AuthContext";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.token, response.data.user);
      
      if (response.data.user.role === "ADMIN") {
        navigate("/");
      } else {
        navigate("/app");
      }
    } catch (err: any) {
      setError("TOKEN INVÁLIDO OU ACESSO EXPIRADO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-bg items-center justify-center relative overflow-hidden font-sans">
      {/* Hidden button for Admin Access */}
      <Link 
        to="/admin-login" 
        className="absolute top-0 right-0 w-24 h-24 opacity-0 cursor-default z-50"
      />

      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px] px-6"
      >
        <div className="glass-card p-10 md:p-14 text-center relative">
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />
          
          {/* Premium Icon Container */}
          <div className="relative mx-auto w-28 h-28 mb-12">
            <div className="absolute inset-0 bg-neon-blue rounded-3xl blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-full h-full bg-dark-card border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-transparent" />
               <div className="w-16 h-16 rounded-full border-2 border-neon-blue/30 flex items-center justify-center p-1 relative z-10">
                  <div className="w-12 h-12 rounded-full border border-neon-blue/50 flex items-center justify-center">
                     <div className="w-4 h-4 bg-neon-blue rounded-full animate-ping shadow-[0_0_15px_#00f2ff]" />
                  </div>
               </div>
            </div>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-display font-black tracking-tighter text-white uppercase leading-none">
              Speed Cards <br />
              <span className="glow-text-blue">Hacker</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.6em] text-zinc-500 font-bold mt-5 font-mono">
              Neural Network Core v4.0
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Identificação</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-MAIL REGISTRADO"
                className="premium-input text-center placeholder:text-zinc-700"
              />
            </div>
            
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Segurança</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="TOKEN DE ACESSO"
                className="premium-input text-center placeholder:text-zinc-700"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest leading-tight">
                  {error}
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="premium-button premium-button-blue w-full h-16 group mt-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="flex items-center gap-3 italic">
                  <span>Conectar ao Terminal</span>
                  <Cpu className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <a 
            href="https://t.me/Speedjgdr"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 group inline-flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] transition-all hover:text-neon-blue"
          >
             Obter acesso vitalício
             <Binary className="h-3 w-3 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
