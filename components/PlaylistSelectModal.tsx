// frontend/components/PlaylistSelectModal.tsx
import { useAuth } from '@/utils/AuthContext';
import React, { useEffect, useState } from 'react';

export default function PlaylistSelectModal({ selected, onSelect, onClose }: { selected: any[], onSelect: (playlists: any[]) => void, onClose: () => void }) {
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [nova, setNova] = useState('');
    const [novaDescricao, setNovaDescricao] = useState('');
    const { token } = useAuth();
    useEffect(() => {
        fetch('http://localhost:8000/api/playlists/', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setPlaylists(data));
    }, []);

    const handleCriar = () => {
        // Chame a API para criar playlist, depois atualize a lista
        // Exemplo simplificado:
        fetch('http://localhost:8000/api/playlists/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ nome: nova, descricao: novaDescricao })
        })
            .then(res => res.json())
            .then(pl => setPlaylists([...playlists, pl]));
        setNova('');
        setNovaDescricao('');

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-2xl" onClick={onClose}>×</button>
                <h3 className="text-lg font-bold mb-4">Selecionar Playlists</h3>
                <div className="mb-4 max-h-40 overflow-y-auto">
                    {playlists.length === 0 && <p>Nenhuma playlist disponível</p>}
                    {playlists.map(pl => (
                        <div key={pl.id} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={selected.some((s: any) => s.id === pl.id)}
                                onChange={e => {
                                    if (e.target.checked) onSelect([...selected, pl]);
                                    else onSelect(selected.filter((s: any) => s.id !== pl.id));
                                }}
                            />
                            <span className="ml-2">{pl.nome}</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <input
                        className="border rounded px-2 py-1 flex-1"
                        placeholder="Nova playlist"
                        value={nova}
                        onChange={e => setNova(e.target.value)}
                    />
                    <input
                        className="border rounded px-2 py-1 flex-1 mt-2"
                        placeholder="Descrição"
                        value={novaDescricao}
                        onChange={e => setNovaDescricao(e.target.value)}
                    />
                    <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleCriar}>Criar playlist</button>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Concluído</button>
                </div>
            </div>
        </div>
    );
}