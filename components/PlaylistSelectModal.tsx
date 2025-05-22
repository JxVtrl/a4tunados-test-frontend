// frontend/components/PlaylistSelectModal.tsx
import api from '@/utils/axiosConfig';
import React, { useEffect, useState } from 'react';

export default function PlaylistSelectModal({ onClose }: { onClose: () => void }) {
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [nova, setNova] = useState('');
    const [novaDescricao, setNovaDescricao] = useState('');

    useEffect(() => {
        api.get('playlists/', {
            withCredentials: true
        })
            .then(res => setPlaylists(res.data));
    }, []);

    const handleCriar = async () => {
        if (nova === '') {
            alert('O nome da playlist é obrigatório');
            return;
        }

        if (novaDescricao === '') {
            alert('A descrição da playlist é obrigatória');
            return;
        }

        if (nova.length > 50) {
            alert('O nome da playlist deve ter menos de 50 caracteres');
            return;
        }

        if (novaDescricao.length > 100) {
            alert('A descrição da playlist deve ter menos de 100 caracteres');
            return;
        }

        if (playlists.some((pl: any) => pl.nome === nova)) {
            alert('Já existe uma playlist com este nome');
            return;
        }



        await api.post('playlists/', { nome: nova, descricao: novaDescricao }, {
            withCredentials: true
        })
            .then(res => setPlaylists([...playlists, res.data]));
        setNova('');
        setNovaDescricao('');

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative border border-gray-200">
                <button className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-700" onClick={onClose}>×</button>
                <h3 className="text-lg font-bold mb-4 text-gray-900">Criar playlist</h3>
                <div className="flex flex-col gap-2">
                    <input
                        className="border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-gray-700"
                        placeholder="Nova playlist"
                        value={nova}
                        onChange={e => setNova(e.target.value)}
                    />
                    <input
                        className="border border-gray-300 rounded px-2 py-1 flex-1 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
                        placeholder="Descrição"
                        value={novaDescricao}
                        onChange={e => setNovaDescricao(e.target.value)}
                    />
                    <button className="bg-gray-800 text-white px-3 py-2 rounded shadow-sm hover:bg-gray-700 transition mt-2" onClick={handleCriar}>Criar playlist</button>
                </div>
            </div>
        </div>
    );
}