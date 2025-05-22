// frontend/pages/painel/aluno.tsx

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../utils/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import VideoCard from '../../components/VideoCard';
import PlaylistCard from '@/components/PlaylistCard';
import { useRouter } from 'next/router';
import Breadcrumb from '@/components/Breadcrumb'; // Importar o componente Breadcrumb


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
    duracao?: number;
}

export default function PainelAluno() {
    const { token } = useAuth();
    const router = useRouter();
    const { playlist: playlistIdQuery } = router.query;

    const [allVideos, setAllVideos] = useState<Video[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [playlistSelecionada, setPlaylistSelecionada] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlaylistId, setFilterPlaylistId] = useState('');
    const [sortOption, setSortOption] = useState('criado_em');

    useEffect(() => {
        if (!token) return;
        setLoading(true);

        fetch('http://localhost:8000/api/playlists/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPlaylists(data))
            .catch(() => setPlaylists([]));

        if (playlistIdQuery) {
            const id = Number(playlistIdQuery);
            fetch(`http://localhost:8000/api/playlists/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    if (!res.ok) {
                        router.push('/painel/aluno');
                        throw new Error('Playlist not found');
                    }
                    return res.json();
                })
                .then(playlistData => {
                    setPlaylistSelecionada(playlistData);
                    fetch(`http://localhost:8000/api/playlists/${id}/videos/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                        .then(res => res.json())
                        .then(videoData => {
                            setAllVideos(videoData);
                            setLoading(false);
                        })
                        .catch(() => {
                            console.error('Erro ao carregar vídeos da playlist');
                            setLoading(false);
                        });
                })
                .catch((error) => {
                    console.error('Erro ao carregar playlist específica:', error);
                    setLoading(false);
                });

        } else {
            setPlaylistSelecionada(null);
            fetch('http://localhost:8000/api/videos/', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setAllVideos(data))
                .finally(() => setLoading(false));
        }
    }, [token, playlistIdQuery, router]);

    const filteredAndSortedVideos = useMemo(() => {
        let videosToShow = [...allVideos];

        if (!playlistIdQuery && filterPlaylistId) {
            videosToShow = videosToShow.filter(video =>
                video.playlists?.some(p => p.id === Number(filterPlaylistId))
            );
        }

        if (searchTerm) {
            videosToShow = videosToShow.filter(video =>
                video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                video.descricao.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        videosToShow.sort((a, b) => {
            if (sortOption === 'titulo') {
                return a.titulo.localeCompare(b.titulo);
            } else if (sortOption === 'criado_em') {
                return new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime();
            } else if (sortOption === 'duracao' && a.duracao && b.duracao) {
                return a.duracao - b.duracao;
            }
            return 0;
        });

        return videosToShow;
    }, [allVideos, searchTerm, filterPlaylistId, sortOption, playlistIdQuery]);

    const handlePlaylistClickInCard = (playlistId: number) => {
        router.push(`/painel/aluno?playlist=${playlistId}`);
    };

    return (
        <ProtectedRoute allowedTypes={['aluno']}>
            <Navbar />
            <div className="p-8 bg-gray-100 min-h-screen">
                {/* Usar Breadcrumb quando uma playlist estiver selecionada */}
                {playlistSelecionada && (
                    <Breadcrumb
                        items={[
                            { label: 'Painel do Aluno', href: '/painel/aluno' },
                            { label: playlistSelecionada.nome } // Nome da playlist selecionada sem link (item ativo)
                        ]}
                        showBack={false} // Não mostrar botão de voltar no Breadcrumb, pois o link "Painel do Aluno" já faz isso
                    />
                )}

                <h2 className="text-2xl font-bold mb-6 text-center">
                    {/* O título principal agora depende se há uma playlist selecionada ou não */}
                    {!playlistSelecionada ? 'Todos os Vídeos' : `${playlistSelecionada.nome} - (${filteredAndSortedVideos.length} vídeos)`}
                </h2>


                {/* Controles de Busca, Filtro e Ordenação (Mostrar apenas na lista geral de vídeos) */}
                {!playlistSelecionada && (
                    <div className="flex flex-col md:flex-row gap-4 mb-6 w-full">
                        <input
                            type="text"
                            placeholder="Buscar vídeos..."
                            className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className='flex flex-row gap-2'>
                            <select
                                className="py-2 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full md:min-w-[250px]"
                                value={filterPlaylistId}
                                onChange={(e) => setFilterPlaylistId(e.target.value)}
                            >
                                <option value="">Todas as Playlists</option>
                                {playlists.map(pl => (
                                    <option key={pl.id} value={pl.id}>{pl.nome}</option>
                                ))}
                            </select>
                            <select
                                className="py-2 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full md:min-w-[250px]"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="criado_em">Ordenar por Data</option>
                                <option value="titulo">Ordenar por Nome</option>
                                {/* Adicione "duracao" como opção de ordenação se tiver o dado no backend */}
                            </select>
                        </div>

                    </div>
                )}


                {loading && <p className="text-center">Carregando vídeos...</p>}

                {/* Lista de Vídeos */}
                <ul>
                    {filteredAndSortedVideos.map(video => (
                        <VideoCard
                            key={video.id}
                            id={video.id}
                            titulo={video.titulo}
                            descricao={video.descricao}
                            link={video.arquivo}
                            criado_em={video.criado_em}
                            playlists={video.playlists}
                            onClick={() => router.push(`/video/${video.id}`)}
                            onPlaylistClick={handlePlaylistClickInCard}
                        />
                    ))}
                </ul>

            </div>
        </ProtectedRoute>
    );
}