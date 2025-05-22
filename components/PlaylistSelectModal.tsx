// frontend/components/PlaylistSelectModal.tsx
import { useAuth } from '@/utils/AuthContext';
import React, { useEffect, useState } from 'react';

export default function PlaylistSelectModal({ onClose }: { onClose: () => void }) {
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

    const handleCriar =  async () => {
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



        await fetch('http://localhost:8000/api/playlists/', {
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
                <h3 className="text-lg font-bold mb-2">Criar playlist</h3>
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
            </div>
        </div>
    );
}