import { useAuth } from '@/utils/AuthContext';
import { useState, useEffect } from 'react';

interface Playlist {
    id: number;
    nome: string;
}

interface VideoFormProps {
    onSubmit: (data: FormData) => Promise<void>;
    initialData?: { titulo: string; descricao: string; playlistsIds?: number[] };
    loading?: boolean;
    success?: string;
    error?: string;
    onCancel?: () => void;
    editMode?: boolean;
}

export default function VideoForm({ onSubmit, initialData, loading, success, error, onCancel, editMode }: VideoFormProps) {
    const [titulo, setTitulo] = useState(initialData?.titulo || '');
    const [descricao, setDescricao] = useState(initialData?.descricao || '');
    const [arquivo, setArquivo] = useState<File | null>(null);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [playlistsIds, setPlaylistsIds] = useState<number[]>(initialData?.playlistsIds || []);
    const [novaPlaylist, setNovaPlaylist] = useState('');
    const [playlistModal, setPlaylistModal] = useState(false);
    const [playlistLoading, setPlaylistLoading] = useState(false);
    const [playlistError, setPlaylistError] = useState('');

    const { token } = useAuth();

    useEffect(() => {
        fetch('http://localhost:8000/api/playlists/', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setPlaylists(data))
            .catch(() => setPlaylists([]));
    }, [token]);

    const handlePlaylistCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!novaPlaylist.trim()) return;
        setPlaylistLoading(true); setPlaylistError('');
        try {
            const res = await fetch('http://localhost:8000/api/playlists/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ nome: novaPlaylist })
            });
            if (!res.ok) throw new Error('Erro ao criar playlist');
            const playlist = await res.json();
            setPlaylists([...playlists, playlist]);
            setPlaylistsIds([...playlistsIds, playlist.id]);
            setNovaPlaylist('');
            setPlaylistModal(false);
        } catch {
            setPlaylistError('Erro ao criar playlist');
        } finally {
            setPlaylistLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!arquivo) return;
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descricao', descricao);
        formData.append('arquivo', arquivo);
        playlistsIds.forEach(id => formData.append('playlists', id.toString()));
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <textarea placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input type="file" accept="video/*" onChange={e => setArquivo(e.target.files?.[0] || null)} required className="w-full mb-4" />
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Playlists (Cursos)</label>
                <div className="flex gap-2 items-center">
                    <select multiple value={playlistsIds.map(String)} onChange={e => setPlaylistsIds(Array.from(e.target.selectedOptions, o => Number(o.value)))} className="flex-1 px-2 py-2 rounded border border-gray-300 h-24">
                        {playlists.map(pl => (
                            <option key={pl.id} value={pl.id}>{pl.nome}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => setPlaylistModal(true)} className="px-2 py-1 rounded bg-blue-200 text-blue-800">Nova</button>
                </div>
                {playlistLoading && <p className="text-sm text-gray-500">Criando playlist...</p>}
                {playlistError && <p className="text-sm text-red-600">{playlistError}</p>}
            </div>
            <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">{editMode ? 'Salvar edição' : 'Cadastrar vídeo'}</button>
                {editMode && onCancel && (
                    <button type="button" onClick={onCancel} className="flex-1 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition">Cancelar</button>
                )}
            </div>
            {loading && <p className="text-center mt-2">Salvando...</p>}
            {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            {success && <p className="text-green-600 text-center mt-2">{success}</p>}

            {/* Modal de playlist */}
            {playlistModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-xs">
                        <h3 className="font-bold mb-2">Nova Playlist</h3>
                        <input type="text" value={novaPlaylist} onChange={e => setNovaPlaylist(e.target.value)} placeholder="Nome da playlist" className="w-full px-2 py-1 rounded border border-gray-300 mb-2" />
                        <div className="flex gap-2">
                            <button onClick={handlePlaylistCreate} className="flex-1 py-1 rounded bg-green-500 text-white">Criar</button>
                            <button onClick={() => setPlaylistModal(false)} className="flex-1 py-1 rounded bg-gray-300">Cancelar</button>
                        </div>
                        {playlistLoading && <p className="text-sm text-gray-500 mt-2">Criando playlist...</p>}
                        {playlistError && <p className="text-sm text-red-600 mt-2">{playlistError}</p>}
                    </div>
                </div>
            )}
        </form>
    );
} 