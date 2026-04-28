# Admin Pro — Dashboard de Gerenciamento

Dashboard administrativo full-stack com React + Express + Prisma + PostgreSQL.

## 🚀 Deploy no Railway

### 1. Pré-requisitos
- Conta no [Railway](https://railway.app)
- Repositório no GitHub com este projeto

### 2. Criar projeto no Railway

1. Acesse [railway.app](https://railway.app) e clique em **New Project**
2. Escolha **Deploy from GitHub repo** e selecione este repositório
3. Clique em **Add a service → Database → PostgreSQL**
4. Na aba **Variables** do seu serviço web, adicione:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=sua_chave_secreta_aqui_muito_longa
NODE_ENV=production
PORT=3000
```

> **Dica:** O Railway injeta `${{Postgres.DATABASE_URL}}` automaticamente quando você vincula o banco.

### 3. Variáveis de ambiente obrigatórias

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão PostgreSQL (fornecida pelo Railway) |
| `JWT_SECRET` | Chave secreta para JWT (use uma string aleatória longa) |
| `NODE_ENV` | Defina como `production` |
| `PORT` | Porta do servidor (Railway injeta automaticamente) |

### 4. Primeiro acesso

Após o deploy, o sistema cria automaticamente um admin:

| Campo | Valor |
|---|---|
| Email | `admin@example.com` |
| Senha | `admin123` |

> ⚠️ **Altere a senha após o primeiro login!**

---

## 🛠️ Desenvolvimento local

### Instalar dependências
```bash
npm install
```

### Configurar variáveis
```bash
cp .env.example .env
# Edite .env com suas configurações locais
```

### Rodar migrations e seed
```bash
npx prisma migrate dev
npx tsx prisma/seed.ts
```

### Iniciar em modo desenvolvimento
```bash
npm run dev
```

---

## 🏗️ Stack

- **Frontend:** React 19 + Vite + Tailwind CSS + React Router
- **Backend:** Express + TypeScript + tsx
- **Banco de dados:** PostgreSQL + Prisma ORM
- **Auth:** JWT + bcryptjs
- **Tarefas agendadas:** node-cron
