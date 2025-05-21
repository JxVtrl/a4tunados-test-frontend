import { useAuth } from '../utils/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: '#eee' }}>
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