// frontend/pages/painel/aluno.tsx

import { useEffect, useState, useMemo } from 'react'; // Importar useMemo
import { useAuth } from '../../utils/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import VideoCard from '../../components/VideoCard';
import PlaylistCard from '@/components/PlaylistCard';
import { useRouter } from 'next/router';


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
    duracao?: number; // Adicionei duração ao tipo Video para ordenação
}

export default function PainelAluno() {
    const { token } = useAuth();
    const router = useRouter();
    const { playlist: playlistIdQuery } = router.query;

    const [allVideos, setAllVideos] = useState<Video[]>([]); // Todos os vídeos
    const [playlists, setPlaylists] = useState<Playlist[]>([]); // Para o filtro de playlist
    const [playlistSelecionada, setPlaylistSelecionada] = useState<Playlist | null>(null); // Playlist específica se navegou por ela
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para busca
    const [filterPlaylistId, setFilterPlaylistId] = useState(''); // Estado para filtro de playlist
    const [sortOption, setSortOption] = useState('criado_em'); // Estado para ordenação

    useEffect(() => {
        if (!token) return;
        setLoading(true);

        // Sempre buscar todas as playlists para o filtro
        fetch('http://localhost:8000/api/playlists/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPlaylists(data))
            .catch(() => setPlaylists([]));

        // Verificar se há um playlistId na URL para exibir vídeos de uma playlist específica
        if (playlistIdQuery) {
            const id = Number(playlistIdQuery);
            fetch(`http://localhost:8000/api/playlists/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    if (!res.ok) {
                        router.push('/painel/aluno'); // Redirecionar se não encontrar
                        throw new Error('Playlist not found');
                    }
                    return res.json();
                })
                .then(playlistData => {
                    setPlaylistSelecionada(playlistData);
                    // Buscar os vídeos dessa playlist específica
                    fetch(`http://localhost:8000/api/playlists/${id}/videos/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                        .then(res => res.json())
                        .then(videoData => {
                            setAllVideos(videoData); // Usar setAllVideos mesmo para playlist específica
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
            // Se não tem playlistId na URL, buscar todos os vídeos por padrão
            setPlaylistSelecionada(null); // Garantir que não estamos no modo playlist específica
            fetch('http://localhost:8000/api/videos/', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setAllVideos(data))
                .finally(() => setLoading(false));
        }
    }, [token, playlistIdQuery, router]); // Adicionar dependências

    // Lógica de filtragem, busca e ordenação usando useMemo para performance
    const filteredAndSortedVideos = useMemo(() => {
        let videosToShow = [...allVideos];

        // 1. Filtrar por Playlist (se playlistIdQuery está na URL, já carregamos só os dela)
        //    Se não, e se filterPlaylistId está selecionado, filtramos aqui
        if (!playlistIdQuery && filterPlaylistId) {
            videosToShow = videosToShow.filter(video =>
                video.playlists?.some(p => p.id === Number(filterPlaylistId))
            );
        }

        // 2. Buscar por termo
        if (searchTerm) {
            videosToShow = videosToShow.filter(video =>
                video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                video.descricao.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 3. Ordenar
        videosToShow.sort((a, b) => {
            if (sortOption === 'titulo') {
                return a.titulo.localeCompare(b.titulo);
            } else if (sortOption === 'criado_em') {
                return new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime(); // Mais recentes primeiro
            } else if (sortOption === 'duracao' && a.duracao && b.duracao) {
                return a.duracao - b.duracao; // Menor duração primeiro (ou b.duracao - a.duracao para maior)
            }
            return 0; // Manter ordem original se não houver critério
        });

        return videosToShow;
    }, [allVideos, searchTerm, filterPlaylistId, sortOption, playlistIdQuery]); // Adicionar dependências

    const handlePlaylistClickInCard = (playlistId: number) => {
        router.push(`/painel/aluno?playlist=${playlistId}`);
    };

    return (
        <ProtectedRoute allowedTypes={['aluno']}>
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl mb-8">
                    {/* Breadcrumb */}
                    {playlistSelecionada && (
                        <button onClick={() => router.push('/painel/aluno')} className="mb-4 px-4 py-2 bg-gray-200 rounded">Voltar para Todos os Vídeos</button>
                    )}

                    <h2 className="text-2xl font-bold mb-6 text-center">
                        {playlistSelecionada ? `Vídeos da Playlist: ${playlistSelecionada.nome}` : 'Todos os Vídeos'}
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
                                    {/* <option value="duracao">Ordenar por Duração</option> */}
                                </select>
                            </div>

                        </div>
                    )}


                    {loading && <p className="text-center">Carregando vídeos...</p>}

                    <h3 className="text-lg font-semibold mb-4">
                        {playlistSelecionada ? `(${filteredAndSortedVideos.length} vídeos)` : `Vídeos Disponíveis (${filteredAndSortedVideos.length})`}
                    </h3>

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
                                playlists={video.playlists} // Passar as playlists para o VideoCard
                                // Ao clicar no card do vídeo, navegar para a página de vídeo
                                onClick={() => router.push(`/video/${video.id}`)}
                                // Passar a função para lidar com o clique na playlist dentro do card
                                onPlaylistClick={handlePlaylistClickInCard}
                            />
                        ))}
                    </ul>

                </div>
            </div>
        </ProtectedRoute>
    );
}