import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { login, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
        } catch (err: any) {
            setError('Usuário ou senha inválidos!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Login</h2>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600 text-gray-900"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600 text-gray-900"
                />
                <button
                    type="submit"
                    className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition mb-2 shadow"
                    disabled={loading}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
                {error && <p className="text-red-600 text-center mb-2">{error}</p>}
                <p className="text-center mt-4 text-gray-700">
                    Não tem conta? <a href="/register" className="text-blue-600 hover:underline">Cadastre-se</a>
                </p>
            </form>
        </div>
    );
} 