import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import api from '@/utils/axiosConfig';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tipo, setTipo] = useState('aluno');
    const [error, setError] = useState('');
    const router = useRouter();
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Carregando...</div>;
    if (user) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Acesso negado</h2>
                <p className="mb-4">Você já está logado como <b>{user.username}</b> ({user.tipo}).</p>
                <button
                    className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    onClick={() => {
                        if (user.tipo === 'professor') router.push('/painel/professor');
                        else router.push('/painel/aluno');
                    }}
                >Ir para o painel</button>
            </div>
        </div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('register/', { username, email, password, tipo });
            router.push('/login');
        } catch (err: any) {
            setError('Erro ao cadastrar. Tente outro usuário.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Cadastro</h2>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                    value={tipo}
                    onChange={e => setTipo(e.target.value)}
                    className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="aluno">Aluno</option>
                    <option value="professor">Professor</option>
                </select>
                <button
                    type="submit"
                    className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition mb-2"
                >
                    Cadastrar
                </button>
                {error && <p className="text-red-600 text-center mb-2">{error}</p>}
                <p className="text-center mt-4">
                    Já tem conta? <a href="/login" className="text-blue-600 hover:underline">Entrar</a>
                </p>
            </form>
        </div>
    );
} 