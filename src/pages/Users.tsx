import React, { useEffect, useState } from "react";
import { 
  Users as UsersIcon, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Calendar,
  X,
  UserCheck,
  UserX,
  RefreshCw,
  MoreHorizontal,
  Mail,
  Shield,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import api from "@frontend/lib/api";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type Status = "ACTIVE" | "INACTIVE" | "EXPIRED";
type Role = "ADMIN" | "USER";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  expirationDate: string | null;
  createdAt: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as Role,
    status: "ACTIVE" as Status,
    expirationDate: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (editingUser && !dataToSubmit.password) {
        delete (dataToSubmit as any).password;
      }
      
      // Normalize empty date string to null for technical compliance
      if (dataToSubmit.expirationDate === "") {
        (dataToSubmit as any).expirationDate = null;
      }

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, dataToSubmit);
      } else {
        await api.post("/users", dataToSubmit);
      }
      fetchUsers();
      closeModal();
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.response?.data?.errors?.[0]?.message || "Verifique os dados.";
      alert("Erro: " + msg);
    }
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        status: user.status,
        expirationDate: user.expirationDate ? user.expirationDate.split("T")[0] : "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "USER",
        status: "ACTIVE",
        expirationDate: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja realmente remover este acesso definitivamente?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await api.patch(`/users/${id}/toggle-status`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRenew = async (id: string) => {
    try {
      await api.patch(`/users/${id}/renew`, { months: 1 });
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusConfig = (status: Status) => {
    const configs = {
      ACTIVE: { bg: "bg-emerald-500/10", text: "text-emerald-600", label: "Ativo", dot: "bg-emerald-500" },
      INACTIVE: { bg: "bg-slate-500/10", text: "text-slate-600", label: "Bloqueado", dot: "bg-slate-500" },
      EXPIRED: { bg: "bg-rose-500/10", text: "text-rose-600", label: "Expirado", dot: "bg-rose-500" },
    };
    return configs[status];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Usuários</h1>
          <p className="text-slate-500 font-light mt-1">Configure permissões, datas de validade e controle de licenças.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Operador
        </button>
      </div>

      <div className="tech-card bg-slate-50/50 p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome, indentificação ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-all text-sm font-light"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium text-slate-600"
        >
          <option value="ALL">Todos os Status</option>
          <option value="ACTIVE">Apenas Ativos</option>
          <option value="INACTIVE">Apenas Bloqueados</option>
          <option value="EXPIRED">Apenas Expirados</option>
        </select>
        <button onClick={fetchUsers} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
          <Activity className={cn("h-5 w-5", loading && "animate-spin")} />
        </button>
      </div>

      <div className="tech-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="data-grid-header">Identidade do Usuário</th>
                <th className="data-grid-header">Status Operacional</th>
                <th className="data-grid-header">Nível</th>
                <th className="data-grid-header">Validade do Acesso</th>
                <th className="data-grid-header text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <UsersIcon className="h-12 w-12" />
                      <p className="font-mono text-xs uppercase tracking-widest">Nenhum registro encontrado</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const status = getStatusConfig(user.status);
                  return (
                    <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="data-grid-cell">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{user.name}</p>
                            <p className="text-xs text-slate-400 font-mono mt-1">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="data-grid-cell">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} ${status.text} font-medium text-xs`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </div>
                      </td>
                      <td className="data-grid-cell">
                        <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
                          <Shield className="h-3 w-3" />
                          {user.role}
                        </div>
                      </td>
                      <td className="data-grid-cell whitespace-nowrap">
                        <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {user.expirationDate ? format(new Date(user.expirationDate), "dd MMM yyyy").toUpperCase() : "ILIMITADO"}
                        </div>
                      </td>
                      <td className="data-grid-cell text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleStatus(user.id)}
                            className="p-2 text-slate-400 hover:bg-white hover:text-indigo-600 rounded-lg transition-all"
                            title="Alternar Status"
                          >
                            {user.status === 'ACTIVE' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>
                          <button 
                             onClick={() => handleRenew(user.id)}
                             className="p-2 text-slate-400 hover:bg-white hover:text-emerald-600 rounded-lg transition-all"
                             title="Renovar +30 dias"
                          >
                             <RefreshCw className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => openModal(user)}
                            className="p-2 text-slate-400 hover:bg-white hover:text-blue-600 rounded-lg transition-all"
                            title="Configurar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-slate-400 hover:bg-white hover:text-rose-600 rounded-lg transition-all"
                            title="Revogar Permanente"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <MoreHorizontal className="h-4 w-4 text-slate-300 group-hover:hidden ml-auto" />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-xl rounded-3xl bg-white p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                 <button onClick={closeModal} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900">
                    <X className="h-6 w-6" />
                 </button>
              </div>

              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  {editingUser ? <Shield className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {editingUser ? "Modificar Acesso" : "Emitir Nova Licença"}
                  </h2>
                  <p className="text-slate-500 font-light text-sm">Preencha os protocolos de identificação técnica.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 px-1">Nome de Operação</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="tech-input focus:bg-white"
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 px-1">Coordenada de Comunicação</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="tech-input"
                      placeholder="email@servidor.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 px-1">Chave Encriptada {editingUser && "(vazio para manter)"}</label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="tech-input"
                    placeholder="Símbolos, letras e números"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 px-1">Nível de Autorização</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="tech-input appearance-none bg-white font-medium"
                    >
                      <option value="USER">Usuário Comum</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 px-1">Estado Operacional</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="tech-input appearance-none bg-white font-medium"
                    >
                      <option value="ACTIVE">Ativo</option>
                      <option value="INACTIVE">Bloqueado</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 px-1">Data de Expiração (Temporal)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      value={formData.expirationDate}
                      onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                      className="tech-input pl-12"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Deixe vazio para licença vitalícia.</p>
                </div>

                <div className="pt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 text-slate-400 hover:text-slate-800 transition-colors font-medium text-sm"
                  >
                    Descartar
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    {editingUser ? "Confirmar Protocolo" : "Gerar Acesso"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
