import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

interface User {
    username: string;
    tipo: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Ao carregar, busca o token do cookie
        const cookieToken = Cookies.get('token');
        if (cookieToken) setTokenState(cookieToken);
    }, []);

    const setToken = (newToken: string | null) => {
        setTokenState(newToken);
        if (newToken) {
            Cookies.set('token', newToken, { expires: 7 }); // 7 dias logado
        } else {
            Cookies.remove('token');
        }
    };

    useEffect(() => {
        const access = localStorage.getItem('access');
        if (access) {
            setToken(access);
            axios.get('http://localhost:8000/api/user/me/', {
                headers: { Authorization: `Bearer ${access}` }
            })
                .then(res => setUser(res.data))
                .catch(() => setUser(null));
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/api/token/', { username, password });
            localStorage.setItem('access', res.data.access);
            setToken(res.data.access);
            const userRes = await axios.get('http://localhost:8000/api/user/me/', {
                headers: { Authorization: `Bearer ${res.data.access}` }
            });
            setUser(userRes.data);
            if (userRes.data.tipo === 'professor') {
                router.push('/painel/professor');
            } else {
                router.push('/painel/aluno');
            }
        } catch {
            throw new Error('Usuário ou senha inválidos!');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('access');
        setUser(null);
        setToken(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 