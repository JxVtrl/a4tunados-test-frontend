// frontend/components/VideoCard.tsx

import { useRouter } from 'next/router';
import React from 'react';

interface Playlist { // Definir a interface Playlist aqui ou importar
    id: number;
    nome: string;
}

interface VideoCardProps {
    titulo: string;
    descricao: string;
    link: string;
    criado_em?: string;
    playlists?: Playlist[]; // Usar a interface Playlist aqui
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
    duracao?: string; // Pode ser string ou number dependendo do backend
    id: number;
    onClick?: () => void; // Clique no card inteiro
    onPlaylistClick?: (playlistId: number) => void; // Clique em uma playlist dentro do card
}

function formatDuration(seconds: number) {
    if (isNaN(seconds) || seconds === null) return '';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

export default function VideoCard({
    titulo,
    descricao,
    link,
    criado_em,
    playlists,
    onEdit,
    onDelete,
    showActions,
    duracao,
    id,
    onClick,
    onPlaylistClick // Receber a nova prop
}: VideoCardProps) {
    const isArquivo = link && (link.startsWith('/media/') || link.startsWith('http://localhost:8000/media/') || link.match(/\.(mp4|webm|ogg)$/i));

    // Usar um div para o conteúdo clicável principal para não conflitar com botões internos
    const handleCardClick = (e: React.MouseEvent) => {
        // Evita que o clique nos botões internos ative o clique do card
        if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLSpanElement) {
            return;
        }
        if (onClick) {
            onClick();
        }
    };


    return (
        <li className="flex items-center gap-4 p-3 border-b border-gray-200 bg-white hover:bg-gray-50 transition cursor-pointer"
            onClick={handleCardClick} // Usar o novo handler
        >
            <div className="w-32 h-20 flex-shrink-0 bg-black rounded overflow-hidden flex items-center justify-center">
                {isArquivo ? (
                    <video
                        src={link}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sem vídeo</div>
                )}
                {/* Mostrar duração no canto da miniatura (opcional) */}
                {duracao && (
                    <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                        {duracao} {/* Use a prop de duração diretamente */}
                    </span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <strong className="text-base truncate">{titulo}</strong>
                </div>
                <span className="block text-gray-600 text-sm truncate mb-1">{descricao}</span> {/* Adicionado mb-1 */}
                {criado_em && (
                    <span className="block text-xs text-gray-400 mb-1">{new Date(criado_em).toLocaleString()}</span>
                )}
                {playlists && playlists.length > 0 && (
                    <div className="text-xs text-green-700 flex items-center flex-wrap gap-1"> {/* Usar div para flex-wrap */}
                        Playlists:
                        {playlists.map((p, index) => (
                            <React.Fragment key={p.id}>
                                {index > 0 && <span>, </span>} {/* Separador entre playlists */}
                                <button // Usar button para ser clicável
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evita que o clique suba para o card
                                        if (onPlaylistClick) onPlaylistClick(p.id);
                                    }}
                                    className="underline hover:no-underline text-green-800" // Estilo de link
                                >
                                    {p.nome}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                )}
                {showActions && (
                    <div className="flex gap-2 mt-2">
                        {onEdit && <button onClick={onEdit} className="flex-1 py-1 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition">Editar</button>}
                        {onDelete && <button onClick={onDelete} className="flex-1 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition">Excluir</button>}
                    </div>
                )}
            </div>
        </li>
    );
}