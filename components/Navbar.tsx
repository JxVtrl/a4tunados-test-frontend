import { useAuth } from '../utils/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center p-4 text-gray-900 fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
            <div className="font-bold tracking-tight text-lg">Plataforma de Aulas</div>
            {user && (
                <div className="flex items-center gap-4">
                    <span className="text-gray-700">Bem-vindo, <b>{user.username}</b> ({user.tipo})</span>
                    <button
                        onClick={logout}
                        className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition border border-gray-300"
                    >
                        Sair
                    </button>
                </div>
            )}
        </nav>
    );
} 