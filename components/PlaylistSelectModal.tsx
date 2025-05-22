// frontend/components/PlaylistSelectModal.tsx
import api from '@/utils/axiosConfig';
import React, { useEffect, useState } from 'react';

export default function PlaylistSelectModal({ onClose }: { onClose: () => void }) {
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [nova, setNova] = useState('');
    const [novaDescricao, setNovaDescricao] = useState('');
    const [foto, setFoto] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    useEffect(() => {
        api.get('playlists/', {
            withCredentials: true
        })
            .then(res => setPlaylists(res.data));
    }, []);

    useEffect(() => {
        if (foto) {
            setFotoPreview(URL.createObjectURL(foto));
        } else {
            setFotoPreview(null);
        }
    }, [foto]);

    const handleCriar = async () => {
        if (nova === '') {
            alert('O nome da playlist é obrigatório');
            return;
        }

        if (novaDescricao === '') {
            alert('A descrição da playlist é obrigatória');
            return;
        }

        if (!foto) {
            alert('A imagem da playlist é obrigatória');
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

        const formData = new FormData();
        formData.append('nome', nova);
        formData.append('descricao', novaDescricao);
        formData.append('foto', foto);

        await api.post('playlists/', formData, {
            withCredentials: true
        })
            .then(res => setPlaylists([...playlists, res.data]));
        setNova('');
        setNovaDescricao('');
        setFoto(null);
        setFotoPreview(null);
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
                    <div className="mt-2">
                        <label className="block font-semibold mb-1">Imagem da playlist <span className="text-red-600">*</span></label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setFoto(e.target.files?.[0] || null)}
                            className="w-full border rounded px-2 py-1"
                        />
                        {fotoPreview && (
                            <img src={fotoPreview} alt="Prévia da imagem" className="w-32 h-20 object-cover rounded mb-2 border mt-2" />
                        )}
                    </div>
                    <button className="bg-gray-800 text-white px-3 py-2 rounded shadow-sm hover:bg-gray-700 transition mt-2" onClick={handleCriar}>Criar playlist</button>
                </div>
            </div>
        </div>
    );
}