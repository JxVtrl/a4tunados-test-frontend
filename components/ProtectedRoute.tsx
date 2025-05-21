import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface Props {
    children: React.ReactNode;
    allowedTypes?: string[];
}

export default function ProtectedRoute({ children, allowedTypes }: Props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (allowedTypes && !allowedTypes.includes(user.tipo)) {
                router.push('/login');
            }
        }
    }, [user, loading, allowedTypes, router]);

    if (loading || !user) return <div>Carregando...</div>;
    if (allowedTypes && !allowedTypes.includes(user.tipo)) return null;
    return <>{children}</>;
} 