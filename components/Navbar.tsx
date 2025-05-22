import { useAuth } from '../utils/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center p-4  text-white fixed top-0 left-0 right-0 z-50 bg-gray-500">
            <div>
                <b>Plataforma de Aulas</b>
            </div>
            {user && (
                <div>
                    Bem-vindo, <b>{user.username}</b> ({user.tipo})
                    <button onClick={logout} style={{ marginLeft: 16 }}>Sair</button>
                </div>
            )}
        </nav>
    );
} 