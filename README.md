# 🎨 a4tunados-frontend

Frontend da plataforma de aulas em vídeo desenvolvida para o desafio técnico da empresa **a4tunados**.

Construído com **Next.js**, este projeto entrega a interface para professores e alunos interagirem com a aplicação.

---

## 🚀 Tecnologias

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript]
- [Axios](https://axios-http.com/)

---

## ▶️ Como rodar o projeto

### 1. Clonando o repositório

```bash
git clone https://github.com/seu-usuario/a4tunados-frontend.git
cd a4tunados-frontend
```

### 2. Configurando variáveis de ambiente

Crie um arquivo `.env.local` na raiz do frontend com:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api/
```

> Em produção, use a URL do backend, por exemplo:
> `NEXT_PUBLIC_API_URL=https://api.majorssolutions.com.br:8081/api/`

### 3. Instalando dependências

```bash
npm install
```

### 4. Rodando localmente

```bash
npm run dev
```

- O frontend estará disponível em `http://localhost:3000`

### 5. Rodando em produção (Vercel, etc)

- Faça o deploy no Vercel, Netlify ou outra plataforma.
- Configure a variável de ambiente `NEXT_PUBLIC_API_URL` para apontar para o backend em produção.

---

## 🔗 Integração com o backend

- Certifique-se de que o backend está rodando e acessível pelo endereço configurado em `NEXT_PUBLIC_API_URL`.
- O frontend faz requisições autenticadas via cookies (CORS e CSRF já configurados).

---

## 📄 Licença

Desenvolvido para o desafio técnico da a4tunados.