import { useState, useEffect } from 'react';

interface VideoFormProps {
    onSubmit: (data: { titulo: string; descricao: string; link: string }) => Promise<void>;
    initialData?: { titulo: string; descricao: string; link: string };
    loading?: boolean;
    success?: string;
    error?: string;
    onCancel?: () => void;
    editMode?: boolean;
}

export default function VideoForm({ onSubmit, initialData, loading, success, error, onCancel, editMode }: VideoFormProps) {
    const [titulo, setTitulo] = useState(initialData?.titulo || '');
    const [descricao, setDescricao] = useState(initialData?.descricao || '');
    const [link, setLink] = useState(initialData?.link || '');

    useEffect(() => {
        setTitulo(initialData?.titulo || '');
        setDescricao(initialData?.descricao || '');
        setLink(initialData?.link || '');
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({ titulo, descricao, link });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <textarea placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input type="url" placeholder="Link do vídeo" value={link} onChange={e => setLink(e.target.value)} required className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">{editMode ? 'Salvar edição' : 'Cadastrar vídeo'}</button>
                {editMode && onCancel && (
                    <button type="button" onClick={onCancel} className="flex-1 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition">Cancelar</button>
                )}
            </div>
            {loading && <p className="text-center mt-2">Salvando...</p>}
            {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            {success && <p className="text-green-600 text-center mt-2">{success}</p>}
        </form>
    );
} 