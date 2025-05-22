// frontend/components/VideoDetailsStep.tsx
import React, { useEffect, useState } from 'react';
import PlaylistSelectModal from './PlaylistSelectModal';
import api from '@/utils/axiosConfig';

interface VideoDetailsStepProps {
    videoFile: File;
    onBack: () => void;
    onSubmit: (data: any) => void;
    playlistId?: number;
}

export default function VideoDetailsStep({ videoFile, onBack, onSubmit, playlistId }: VideoDetailsStepProps) {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [selected, setSelected] = useState<any[]>([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [customFileName, setCustomFileName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const fileExtension = videoFile.name.split('.').pop() || '';

    const handleSave = () => {
        if (!thumbnailFile) {
            setError('Selecione uma thumbnail para o vídeo.');
            return;
        }
        setError(null);
        let finalFileName = customFileName.trim();
        if (finalFileName && !finalFileName.endsWith(`.${fileExtension}`)) {
            finalFileName = `${finalFileName}.${fileExtension}`;
        }
        onSubmit({ titulo, descricao, playlists: selected, videoFile, thumbnailFile, customFileName: finalFileName });
    };

    const buscarPlaylists = async () => {
        await api.get('playlists/', {
            withCredentials: true
        })
            .then(res => setPlaylists(res.data));
    }

    useEffect(() => {
        buscarPlaylists()
    }, []);

    useEffect(() => {
        if (playlistId && playlists.length > 0) {
            const pl = playlists.find((p: any) => p.id === playlistId);
            if (pl && !selected.some((s: any) => s.id === pl.id)) {
                setSelected((prev: any[]) => [...prev, pl]);
            }
        }
        // eslint-disable-next-line
    }, [playlistId, playlists]);

    useEffect(() => {
        if (thumbnailFile) {
            setThumbnailPreview(URL.createObjectURL(thumbnailFile));
        } else {
            setThumbnailPreview(null);
        }
    }, [thumbnailFile]);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{videoFile.name}</h2>
            <div className="mb-4">
                <label className="block font-semibold">Título</label>
                <input className="w-full border rounded px-2 py-1" value={titulo} onChange={e => setTitulo(e.target.value)} />
            </div>
            <div className="mb-4">
                <label className="block font-semibold">Descrição</label>
                <textarea className="w-full border rounded px-2 py-1" value={descricao} onChange={e => setDescricao(e.target.value)} />
            </div>
            <div className="mb-4">
                <label className="block font-semibold">Nome do arquivo de vídeo (opcional)</label>
                <div className="flex items-center gap-2">
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={customFileName}
                        onChange={e => {
                            const value = e.target.value.replace(/\.[^.]+$/, '');
                            setCustomFileName(value);
                        }}
                        placeholder={`Ex: aula-matematica-01`}
                    />
                    <span className="text-gray-500">.{fileExtension}</span>
                </div>
            </div>
            <div className="mb-4">
                <label className="block font-semibold">Thumbnail <span className="text-red-600">*</span></label>
                <input
                    type="file"
                    accept="image/*"
                    className="w-full border rounded px-2 py-1"
                    onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                />
                {thumbnailPreview && (
                    <img src={thumbnailPreview} alt="Prévia da thumbnail" className="w-32 h-20 object-cover rounded mb-2 border mt-2" />
                )}
                {error && (
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                )}
            </div>
            <div className="mb-4">
                <div className="flex justify-between items-center gap-2 mb-2">
                    <label className="block font-semibold">Playlists</label>
                    <button className="border px-2 py-1 rounded" onClick={() => setShowPlaylistModal(true)}>
                        Criar playlist
                    </button>
                </div>
                {playlists.length > 0 && (
                    <select
                        multiple
                        value={selected.map((pl: any) => pl.id.toString())}
                        onChange={e => {
                            const values = Array.from(e.target.selectedOptions, o => Number(o.value));
                            setSelected(playlists.filter((pl: any) => values.includes(pl.id)));
                        }}
                        className="w-full px-2 py-2 rounded border border-gray-300 h-24 focus:outline-none focus:ring-2 focus:ring-gray-700 text-gray-900"
                    >
                        {playlists.map(pl => (
                            <option key={pl.id} value={pl.id}>{pl.nome}</option>
                        ))}
                    </select>
                )}
            </div>
            <div className="flex justify-between">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={onBack}>Voltar</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSave}>Salvar vídeo</button>
            </div>
            {showPlaylistModal && (
                <PlaylistSelectModal
                    onClose={() => {
                        buscarPlaylists()
                        setShowPlaylistModal(false)
                    }}
                />
            )}
        </div>
    );
}