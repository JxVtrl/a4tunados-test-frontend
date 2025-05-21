// frontend/components/VideoUploadModal.tsx
import React, { useState } from 'react';
import VideoDropStep from './VideoDropStep';
import VideoDetailsStep from './VideoDetailsStep';
import { useAuth } from '../utils/AuthContext';

export default function VideoUploadModal({ open, onClose, onVideoUploaded }: { open: boolean, onClose: () => void, onVideoUploaded: () => void }) {
    const [step, setStep] = useState(1);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoData, setVideoData] = useState<any>({});
    const { token } = useAuth();

    const handleVideoSelected = (file: File) => {
        setVideoFile(file);
        setStep(2);
    };

    const handleDetailsSubmit = async (data: any) => {
        setVideoData(data);
        // Envia o vídeo para o backend
        const formData = new FormData();
        formData.append('titulo', data.titulo);
        formData.append('descricao', data.descricao);
        formData.append('arquivo', data.videoFile);
        if (data.playlists && data.playlists.length > 0) {
            data.playlists.forEach((pl: any) => formData.append('playlists', pl.id));
        }
        try {
            const res = await fetch('http://localhost:8000/api/videos/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                    // Não defina Content-Type, o browser faz isso automaticamente para FormData
                },
                body: formData,
            });
            if (!res.ok) throw new Error('Erro ao enviar vídeo');
            onVideoUploaded();
            onClose();
        } catch (e) {
            alert('Erro ao enviar vídeo');
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-0 relative">
                <button className="absolute top-2 right-2 text-2xl" onClick={onClose}>×</button>
                {step === 1 && <VideoDropStep onVideoSelected={handleVideoSelected} />}
                {step === 2 && videoFile && (
                    <VideoDetailsStep
                        videoFile={videoFile}
                        onBack={() => setStep(1)}
                        onSubmit={handleDetailsSubmit}
                    />
                )}
            </div>
        </div>
    );
}