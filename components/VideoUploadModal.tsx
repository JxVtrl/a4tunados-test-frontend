// frontend/components/VideoUploadModal.tsx
import React, { useState } from 'react';
import VideoDropStep from './VideoDropStep';
import VideoDetailsStep from './VideoDetailsStep';
import api from '@/utils/axiosConfig';

interface VideoUploadModalProps {
    open: boolean;
    onClose: () => void;
    onVideoUploaded: () => void;
    playlistId?: number;
}

export default function VideoUploadModal({ open, onClose, onVideoUploaded, playlistId }: VideoUploadModalProps) {
    const [step, setStep] = useState(1);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleVideoSelected = (file: File) => {
        setVideoFile(file);
        setStep(2);
    };

    const handleDetailsSubmit = async (data: any) => {
        // Envia o vídeo para o backend
        const formData = new FormData();
        formData.append('titulo', data.titulo);
        formData.append('descricao', data.descricao);
        // Nome customizado do arquivo
        let fileToSend = data.videoFile;
        if (data.customFileName) {
            const ext = fileToSend.name.split('.').pop();
            const newFile = new File([fileToSend], data.customFileName.endsWith(`.${ext}`) ? data.customFileName : `${data.customFileName}.${ext}`, { type: fileToSend.type });
            fileToSend = newFile;
        }
        formData.append('arquivo', fileToSend);
        if (data.playlists && data.playlists.length > 0) {
            data.playlists.forEach((pl: any) => formData.append('playlists_ids', pl.id));
        }
        // Thumbnail
        if (data.thumbnailFile) {
            formData.append('thumbnail', data.thumbnailFile);
        }
        try {
            const res = await api.post('videos/', formData, {
                withCredentials: true
            });
            if (res.status !== 201) throw new Error('Erro ao enviar vídeo');
            onVideoUploaded();
            onClose();
            setStep(1);
            setVideoFile(null);
        } catch (e) {
            alert('Erro ao enviar vídeo');
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-0 relative">
                <button className="absolute top-2 right-2 text-2xl" onClick={() => {
                    setStep(1);
                    setVideoFile(null);
                    onClose();
                }}>×</button>
                {step === 1 && <VideoDropStep onVideoSelected={handleVideoSelected} />}
                {step === 2 && videoFile && (
                    <VideoDetailsStep
                        videoFile={videoFile}
                        onBack={() => setStep(1)}
                        onSubmit={handleDetailsSubmit}
                        playlistId={playlistId}
                    />
                )}
            </div>
        </div>
    );
}