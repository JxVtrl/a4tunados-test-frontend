import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import VideoCard from '../../components/VideoCard';

interface Video {
    id: number;
    titulo: string;
    descricao: string;
    link: string;
    criado_em: string;
    professor: number;
}

export default function PainelAluno() {
    const { token } = useAuth();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch('http://localhost:8000/api/videos/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setVideos(data))
            .catch(() => setError('Erro ao carregar vídeos.'))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <ProtectedRoute allowedTypes={['aluno']}>
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Painel do Aluno</h2>
                    {loading && <p className="text-center">Carregando vídeos...</p>}
                    {error && <p className="text-red-600 text-center mb-2">{error}</p>}
                    <h3 className="text-lg font-semibold mb-4">Vídeos disponíveis ({videos.length})</h3>
                    <ul>
                        {videos.map(video => (
                            <VideoCard
                                key={video.id}
                                titulo={video.titulo}
                                descricao={video.descricao}
                                link={video.link}
                                criado_em={video.criado_em}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </ProtectedRoute>
    );
} 