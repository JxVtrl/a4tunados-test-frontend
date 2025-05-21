import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import VideoForm from '../../components/VideoForm';
import VideoCard from '../../components/VideoCard';
import VideoUploadModal from '../../components/VideoUploadModal';
import PlaylistCard from '@/components/PlaylistCard';

interface Video {
    id: number;
    titulo: string;
    descricao: string;
    arquivo: string;
    criado_em: string;
    playlists?: { id: number }[];
}

interface Playlist {
    id: number;
    nome: string;
}

export default function PainelProfessor() {
    const { token } = useAuth();
    const [videos, setVideos] = useState<Video[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);


    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch('http://localhost:8000/api/playlists/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPlaylists(data))
            .catch(() => setError('Erro ao carregar playlists.'))
            .finally(() => setLoading(false));
    }, [token]);



    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;
        try {
            await fetch(`http://localhost:8000/api/videos/${id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setVideos(videos.filter(v => v.id !== id));
        } catch {
            setError('Erro ao excluir vídeo.');
        }
    };

    const handlePlaylistClick = (playlistId: number) => {
        console.log(`Playlist clicada: ${playlistId}`);
        setLoading(true);
        fetch(`http://localhost:8000/api/playlists/${playlistId}/videos/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setVideos(data))
            .finally(() => setLoading(false));
    };



    return (
        <ProtectedRoute allowedTypes={['professor']}>
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Painel do Professor</h2>
                    <div className="flex justify-end mb-4">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={() => setShowUploadModal(true)}
                        >
                            Enviar vídeo
                        </button>
                    </div>
                    <VideoUploadModal
                        open={showUploadModal}
                        onClose={() => setShowUploadModal(false)}
                        onVideoUploaded={() => {
                            setLoading(true);
                            fetch('http://localhost:8000/api/videos/', {
                                headers: { Authorization: `Bearer ${token}` }
                            })
                                .then(res => res.json())
                                .then(data => setVideos(data))
                                .finally(() => setLoading(false));
                        }}
                    />
                    {loading && <p className="text-center">Carregando vídeos...</p>}

                    {error && <p className="text-center text-red-500">{error}</p>}

                    <h3 className="text-lg font-semibold mb-4">Suas playlists ({playlists.length})</h3>
                    <ul>
                        {playlists.map(playlist => (
                            <PlaylistCard
                                key={playlist.id}
                                nome={playlist.nome}
                                onClick={() => handlePlaylistClick(playlist.id)}
                            />
                        ))}
                    </ul>

                    {videos.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Vídeos da playlist {playlists.find(p => p.id === videos[0].playlists?.[0]?.id)?.nome}</h3>
                            <ul>
                                {videos.map(video => (
                                    <VideoCard
                                        key={video.id}
                                        titulo={video.titulo}
                                        descricao={video.descricao}
                                        link={video.arquivo}
                                        criado_em={video.criado_em}
                                        onDelete={() => handleDelete(video.id)}
                                        showActions
                                        id={video.id}
                                    />
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
