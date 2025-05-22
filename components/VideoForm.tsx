import { useState, useEffect } from 'react';
import api from '@/utils/axiosConfig';

interface Playlist {
    id: number;
    nome: string;
}

interface VideoFormProps {
    onSubmit: (data: FormData) => Promise<void>;
    initialData?: { titulo: string; descricao: string; playlistsIds?: number[]; thumbnail?: string };
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
    const [customFileName, setCustomFileName] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [playlistsIds, setPlaylistsIds] = useState<number[]>(initialData?.playlistsIds || []);
    const [novaPlaylist, setNovaPlaylist] = useState('');
    const [playlistModal, setPlaylistModal] = useState(false);
    const [playlistLoading, setPlaylistLoading] = useState(false);
    const [playlistError, setPlaylistError] = useState('');

    useEffect(() => {
        api.get('playlists/', {
            withCredentials: true
        })
            .then(res => setPlaylists(res.data));
    }, []);

    useEffect(() => {
        if (thumbnailFile) {
            setThumbnailPreview(URL.createObjectURL(thumbnailFile));
        } else if (editMode && initialData?.thumbnail) {
            setThumbnailPreview(initialData.thumbnail);
        } else {
            setThumbnailPreview(null);
        }
    }, [thumbnailFile, editMode, initialData]);

    const handlePlaylistCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!novaPlaylist.trim()) return;
        setPlaylistLoading(true); setPlaylistError('');
        try {
            const res = await api.post('playlists/', { nome: novaPlaylist }, {
                withCredentials: true
            });
            const playlist = res.data as Playlist;
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
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descricao', descricao);
        playlistsIds.forEach(id => formData.append('playlists', id.toString()));
        if (editMode) {
            if (arquivo) formData.append('thumbnail', arquivo);
        } else {
            // Criação: arquivo de vídeo e thumbnail
            if (arquivo) {
                if (customFileName) {
                    const ext = arquivo.name.split('.').pop();
                    const newFile = new File([arquivo], customFileName.endsWith(`.${ext}`) ? customFileName : `${customFileName}.${ext}`, { type: arquivo.type });
                    formData.append('arquivo', newFile);
                } else {
                    formData.append('arquivo', arquivo);
                }
            }
            if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile);
            }
        }
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 bg-white border border-gray-200 rounded shadow-sm p-6">
            <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 text-gray-900" />
            <textarea placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 text-gray-900" />
            {editMode ? (
                <div className="mb-4">
                    <label className="block mb-1 font-semibold text-gray-700">Thumbnail</label>
                    <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} className="w-full mb-2" />
                    {thumbnailPreview && (
                        <img src={thumbnailPreview.replace(`http://`, `https://`)} alt="Thumbnail atual" className="w-32 h-20 object-cover rounded mb-2 border" />
                    )}
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-gray-700">Arquivo de vídeo</label>
                        <input type="file" accept="video/*" onChange={e => setArquivo(e.target.files?.[0] || null)} required className="w-full mb-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-gray-700">Nome do arquivo de vídeo (opcional)</label>
                        <input
                            type="text"
                            value={customFileName}
                            onChange={e => setCustomFileName(e.target.value)}
                            placeholder="Ex: aula-matematica-01.mp4"
                            className="w-full mb-2 px-2 py-1 rounded border border-gray-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-gray-700">Thumbnail (opcional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                            className="w-full mb-2"
                        />
                        {thumbnailPreview && (
                            <img src={thumbnailPreview.replace(`http://`, `https://`)} alt="Prévia da thumbnail" className="w-32 h-20 object-cover rounded mb-2 border" />
                        )}
                    </div>
                </>
            )}
            <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">Playlists (Cursos)</label>
                <div className="flex gap-2 items-center">
                    <select multiple value={playlistsIds.map(String)} onChange={e => setPlaylistsIds(Array.from(e.target.selectedOptions, o => Number(o.value)))} className="flex-1 px-2 py-2 rounded border border-gray-300 h-24 focus:outline-none focus:ring-2 focus:ring-gray-700 text-gray-900">
                        {playlists.map(pl => (
                            <option key={pl.id} value={pl.id}>{pl.nome}</option>
                        ))}
                    </select>
                    <button type="button" onClick={() => setPlaylistModal(true)} className="px-2 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition border border-gray-300">Nova</button>
                </div>
                {playlistLoading && <p className="text-sm text-gray-500">Criando playlist...</p>}
                {playlistError && <p className="text-sm text-red-600">{playlistError}</p>}
            </div>
            <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 rounded bg-gray-800 text-white font-semibold hover:bg-gray-700 transition shadow-sm">{editMode ? 'Salvar edição' : 'Cadastrar vídeo'}</button>
                {editMode && onCancel && (
                    <button type="button" onClick={onCancel} className="flex-1 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition border border-gray-300">Cancelar</button>
                )}
            </div>
            {loading && <p className="text-center mt-2 text-gray-500">Salvando...</p>}
            {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            {success && <p className="text-green-600 text-center mt-2">{success}</p>}

            {/* Modal de playlist */}
            {playlistModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-xs border border-gray-200">
                        <h3 className="font-bold mb-2 text-gray-900">Nova Playlist</h3>
                        <input type="text" value={novaPlaylist} onChange={e => setNovaPlaylist(e.target.value)} placeholder="Nome da playlist" className="w-full px-2 py-1 rounded border border-gray-300 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-700 text-gray-900" />
                        <div className="flex gap-2">
                            <button onClick={handlePlaylistCreate} className="flex-1 py-1 rounded bg-gray-800 text-white hover:bg-gray-700 transition shadow-sm">Criar</button>
                            <button onClick={() => setPlaylistModal(false)} className="flex-1 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition border border-gray-300">Cancelar</button>
                        </div>
                        {playlistLoading && <p className="text-sm text-gray-500 mt-2">Criando playlist...</p>}
                        {playlistError && <p className="text-sm text-red-600 mt-2">{playlistError}</p>}
                    </div>
                </div>
            )}
        </form>
    );
} 