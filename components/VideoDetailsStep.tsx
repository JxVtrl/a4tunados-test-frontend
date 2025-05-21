// frontend/components/VideoDetailsStep.tsx
import React, { useState } from 'react';
import PlaylistSelectModal from './PlaylistSelectModal';

export default function VideoDetailsStep({ videoFile, onBack, onSubmit }: { videoFile: File, onBack: () => void, onSubmit: (data: any) => void }) {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    const handleSave = () => {
        onSubmit({ titulo, descricao, playlists, videoFile });
    };

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
                <label className="block font-semibold">Playlists</label>
                <button className="border px-2 py-1 rounded" onClick={() => setShowPlaylistModal(true)}>
                    Selecionar playlists
                </button>
                {playlists.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {playlists.map((pl: any) => (
                            <span key={pl.id} className="bg-blue-200 px-2 py-1 rounded">{pl.nome}</span>
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
                    selected={playlists}
                    onSelect={setPlaylists}
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}
        </div>
    );
}