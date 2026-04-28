import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, ShieldCheck, ChevronRight } from "lucide-react";
import { useAuth } from "@frontend/context/AuthContext";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Painel Geral", to: "/", icon: LayoutDashboard },
    { name: "Gestão de Usuários", to: "/users", icon: Users },
  ];

  return (
    <aside className="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="h-20 flex items-center px-8 border-b border-slate-800">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mr-4 rotate-3">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Admin Pro</span>
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 py-8">
        <nav className="space-y-1">
          <p className="px-4 mb-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Menu Principal</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )
              }
            >
              <div className="flex items-center">
                <item.icon className={cn("mr-3 h-5 w-5 transition-colors", "group-hover:text-indigo-400")} />
                {item.name}
              </div>
              <ChevronRight className={cn("h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0")} />
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all active:scale-[0.98]"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Encerrar Sessão
            </button>
          </div>
          
          <div className="mt-6 text-center px-4">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Controle de Sinais v2.4.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
