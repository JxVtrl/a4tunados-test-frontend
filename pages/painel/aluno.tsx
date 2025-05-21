import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import VideoCard from '../../components/VideoCard';
import PlaylistCard from '@/components/PlaylistCard';


interface Playlist {
    id: number;
    nome: string;
}
interface Professor {
    id: number;
    username: string;
}
interface Video {
    id: number;
    titulo: string;
    descricao: string;
    arquivo: string;
    criado_em: string;
    playlists?: Playlist[];
    professor: Professor;
}

export default function PainelAluno() {
    const { token } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [playlistSelecionada, setPlaylistSelecionada] = useState<Playlist | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch('http://localhost:8000/api/playlists/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPlaylists(data))
            .finally(() => setLoading(false));
    }, [token]);


    const handleSelecionarPlaylist = (playlist: Playlist) => {
        setPlaylistSelecionada(playlist);
        setLoading(true);
        fetch(`http://localhost:8000/api/playlists/${playlist.id}/videos/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setVideos(data))
            .finally(() => setLoading(false));
    };

    return (
        <ProtectedRoute allowedTypes={['aluno']}>
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl mb-8">
                    {!playlistSelecionada ? (
                        <>
                            <h2 className="text-2xl font-bold mb-6 text-center">Playlists Disponíveis</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {playlists.map(playlist => (
                                    <PlaylistCard
                                        key={playlist.id}
                                        nome={playlist.nome}
                                        // descricao={playlist.descricao}
                                        onClick={() => handleSelecionarPlaylist(playlist)}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setPlaylistSelecionada(null)} className="mb-4 px-4 py-2 bg-gray-200 rounded">Voltar</button>
                            <h2 className="text-2xl font-bold mb-6 text-center">{playlistSelecionada.nome}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {videos.map(video => (
                                    <VideoCard
                                        key={video.id}
                                        titulo={video.titulo}
                                        descricao={video.descricao}
                                        link={video.arquivo}
                                        criado_em={video.criado_em}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
} 