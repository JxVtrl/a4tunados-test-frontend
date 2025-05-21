import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import VideoForm from '../../components/VideoForm';
import VideoCard from '../../components/VideoCard';

interface Video {
    id: number;
    titulo: string;
    descricao: string;
    link: string;
    criado_em: string;
}

export default function PainelProfessor() {
    const { token } = useAuth();
    const [videos, setVideos] = useState<Video[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch('http://localhost:8000/api/videos/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setVideos(data))
            .catch(() => setError('Erro ao carregar vídeos.'))
            .finally(() => setLoading(false));
    }, [token]);

    const handleCreate = async (data: { titulo: string; descricao: string; link: string }) => {
        setFormLoading(true); setError(''); setSuccess('');
        try {
            const res = await fetch('http://localhost:8000/api/videos/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            const video = await res.json();
            setVideos([...videos, video]);
            setSuccess('Vídeo cadastrado com sucesso!');
        } catch {
            setError('Erro ao cadastrar vídeo.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (video: Video) => {
        setEditId(video.id);
        setSuccess(''); setError('');
    };

    const handleUpdate = async (data: { titulo: string; descricao: string; link: string }) => {
        if (!editId) return;
        setFormLoading(true); setError(''); setSuccess('');
        try {
            await fetch(`http://localhost:8000/api/videos/${editId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            setVideos(videos.map(v => v.id === editId ? { ...v, ...data } : v));
            setSuccess('Vídeo editado com sucesso!');
            setEditId(null);
        } catch {
            setError('Erro ao editar vídeo.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;
        setError(''); setSuccess('');
        try {
            await fetch(`http://localhost:8000/api/videos/${id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setVideos(videos.filter(v => v.id !== id));
            setSuccess('Vídeo excluído com sucesso!');
        } catch {
            setError('Erro ao excluir vídeo.');
        }
    };

    const editingVideo = videos.find(v => v.id === editId);

    return (
        <ProtectedRoute allowedTypes={['professor']}>
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Painel do Professor</h2>
                    <VideoForm
                        onSubmit={editId ? handleUpdate : handleCreate}
                        initialData={editId && editingVideo ? { titulo: editingVideo.titulo, descricao: editingVideo.descricao, link: editingVideo.link } : undefined}
                        loading={formLoading}
                        success={success}
                        error={error}
                        onCancel={() => setEditId(null)}
                        editMode={!!editId}
                    />
                    {loading && <p className="text-center">Carregando vídeos...</p>}
                    <h3 className="text-lg font-semibold mb-4">Seus vídeos ({videos.length})</h3>
                    <ul>
                        {videos.map(video => (
                            <VideoCard
                                key={video.id}
                                titulo={video.titulo}
                                descricao={video.descricao}
                                link={video.link}
                                criado_em={video.criado_em}
                                onEdit={() => handleEdit(video)}
                                onDelete={() => handleDelete(video.id)}
                                showActions
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </ProtectedRoute>
    );
}
