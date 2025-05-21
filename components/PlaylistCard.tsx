import React from 'react';

interface PlaylistCardProps {
    nome: string;
    descricao?: string;
    onClick: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ nome, descricao, onClick }) => (
    <div
        className="bg-blue-50 rounded-xl shadow-md p-6 flex flex-col items-center cursor-pointer hover:shadow-xl transition"
        onClick={onClick}
    >
        {/* Ícone ou imagem pode ser adicionado aqui */}
        <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-blue-700">
            {nome[0]}
        </div>
        <h3 className="text-lg font-semibold text-center mb-2">{nome}</h3>
        {descricao && (
            <p className="text-gray-600 text-sm text-center mb-4 line-clamp-3">{descricao}</p>
        )}
        <button className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Ver vídeos
        </button>
    </div>
);

export default PlaylistCard;