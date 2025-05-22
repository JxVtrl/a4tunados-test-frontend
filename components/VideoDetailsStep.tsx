// frontend/components/VideoDetailsStep.tsx
import React, { useEffect, useState } from 'react';
import PlaylistSelectModal from './PlaylistSelectModal';
import { useAuth } from '@/utils/AuthContext';

export default function VideoDetailsStep({ videoFile, onBack, onSubmit }: { videoFile: File, onBack: () => void, onSubmit: (data: any) => void }) {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [selected, setSelected] = useState<any[]>([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const { token } = useAuth();

    const handleSave = () => {
        onSubmit({ titulo, descricao, playlists: selected, videoFile });
    };

    const buscarPlaylists = async () => {
        await fetch('http://localhost:8000/api/playlists/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setPlaylists(data));
    }

    useEffect(() => {
        buscarPlaylists()
    }, []);

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
                <div className="flex justify-between items-center gap-2">
                    <label className="block font-semibold">Playlists</label>
                    <button className="border px-2 py-1 rounded" onClick={() => setShowPlaylistModal(true)}>
                        Criar playlist
                    </button>
                </div>
                {playlists.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {playlists.map(pl => (
                            <div key={pl.id} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={selected.some((s: any) => s.id === pl.id)}
                                    onChange={e => {
                                        if (e.target.checked) setSelected([...selected, pl]);
                                        else setSelected(selected.filter((s: any) => s.id !== pl.id));
                                    }}
                                />
                                <span className="ml-2">{pl.nome}</span>
                            </div>
                        ))}
                    </div>
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