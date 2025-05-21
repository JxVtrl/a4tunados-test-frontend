interface VideoCardProps {
    titulo: string;
    descricao: string;
    link: string;
    criado_em?: string;
    playlists?: { nome: string }[];
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
}

export default function VideoCard({ titulo, descricao, link, criado_em, playlists, onEdit, onDelete, showActions }: VideoCardProps) {
    const isArquivo = link && (link.startsWith('/media/') || link.startsWith('http://localhost:8000/media/') || link.match(/\.(mp4|webm|ogg)$/i));
    return (
        <li className="mb-6 p-4 rounded border border-gray-200 bg-gray-50">
            <strong className="block text-lg mb-1">{titulo}</strong>
            <span className="block mb-1 text-gray-700">{descricao}</span>
            {criado_em && <span className="block text-xs text-gray-400 mb-1">{new Date(criado_em).toLocaleString()}</span>}
            {playlists && playlists.length > 0 && (
                <span className="block text-xs text-green-700 mb-1">Playlists: {playlists.map(p => p.nome).join(', ')}</span>
            )}
            {isArquivo ? (
                <video src={link} controls className="w-full max-h-64 my-2 rounded" />
            ) : (
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Assistir</a>
            )}
            {showActions && (
                <div className="flex gap-2 mt-2">
                    {onEdit && <button onClick={onEdit} className="flex-1 py-1 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition">Editar</button>}
                    {onDelete && <button onClick={onDelete} className="flex-1 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition">Excluir</button>}
                </div>
            )}
        </li>
    );
} 