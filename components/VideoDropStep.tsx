// frontend/components/VideoDropStep.tsx
import React, { useRef } from 'react';

export default function VideoDropStep({ onVideoSelected }: { onVideoSelected: (file: File) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onVideoSelected(e.dataTransfer.files[0]);
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center h-[400px] cursor-pointer"
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
        >
            <div className="flex flex-col items-center">
                <div className="text-5xl mb-4">⬆️</div>
                <p className="mb-2">Arraste e solte os arquivos de vídeo para fazer o envio</p>
                <p className="mb-4 text-gray-500 text-sm">Seus vídeos ficarão privados até que você os publique.</p>
                <button className="bg-black text-white px-4 py-2 rounded">Selecionar arquivos</button>
                <input
                    type="file"
                    accept="video/*"
                    ref={inputRef}
                    className="hidden"
                    onChange={e => e.target.files && onVideoSelected(e.target.files[0])}
                />
            </div>
        </div>
    );
}