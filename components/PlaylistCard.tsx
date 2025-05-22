import React from 'react';

interface PlaylistCardProps {
    nome: string;
    descricao?: string;
    onClick: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ nome, descricao, onClick }) => (
    <div
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition"
        onClick={onClick}
    >
        {/* Ícone ou imagem pode ser adicionado aqui */}
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-gray-700">
            {nome[0]}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{nome}</h3>
        {descricao && (
            <p className="text-gray-600 text-sm text-center mb-4 line-clamp-3">{descricao}</p>
        )}
        <button className="mt-auto px-4 py-2 bg-gray-800 text-white rounded shadow-sm hover:bg-gray-700 transition">
            Ver vídeos
        </button>
    </div>
);

export default PlaylistCard;