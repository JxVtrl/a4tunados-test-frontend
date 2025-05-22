// frontend/components/VideoCard.tsx

import router, { useRouter } from "next/router"
import React from "react"
import Avatar from "./Avatar"
import { FaPlay, FaClock, FaCalendarAlt } from 'react-icons/fa';
import Link from "next/link";

interface Playlist {
  // Definir a interface Playlist aqui ou importar
  id: number
  nome: string
}

interface VideoCardProps {
  titulo: string
  descricao: string
  link: string
  criado_em?: string
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
  duracao?: string // Pode ser string ou number dependendo do backend
  onClick?: () => void // Clique no card inteiro
  professor_nome?: string
  thumbnail?: string // URL da miniatura
  professor_id?: number
}

export default function VideoCard({
  titulo,
  descricao,
  link,
  criado_em,
  onEdit,
  onDelete,
  showActions,
  duracao,
  onClick,
  professor_nome,
  thumbnail,
  professor_id,
}: VideoCardProps) {
  const [hovered, setHovered] = React.useState(false);

  // Usar um div para o conteúdo clicável principal para não conflitar com botões internos
  const handleCardClick = (e: React.MouseEvent) => {
    console.log(e.target)
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLSpanElement ||
      e.target instanceof HTMLAnchorElement
    ) {
      return
    }
    if (onClick) {
      onClick()
    }
  }

  return (
    <Link
      href={link}
      className={`bg-white border-none rounded-xl overflow-hidden  transition cursor-pointer list-none group flex flex-col h-full`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ minWidth: 0 }}
      onClick={handleCardClick}
    >
      <div className="relative w-full flex-shrink-0 bg-black rounded-t-xl overflow-hidden flex items-center justify-center" style={{ aspectRatio: `16/9` }}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={titulo}
            className="w-full h-full object-cover"
            style={{ aspectRatio: '16/9' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            Sem miniatura
          </div>
        )}
        {/* Overlay de play */}
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ color: 'white', fontSize: '2rem', opacity: 0.8, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>
          <FaPlay />
        </span>
        {/* Duração no canto inferior direito */}
        {duracao && (
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
            <FaClock style={{ display: 'inline-block', marginRight: 4 }} /> {duracao}
          </span>
        )}
      </div>
      <div className="w-full flex gap-3 py-3 px-4 items-center border-t border-gray-200">
        {professor_nome && (
          <Link href={`/painel/aluno/professor/${professor_id}`} className="relative group/avatar cursor-pointer" title={professor_nome}>
            <Avatar
              imageUrl=""
              name={professor_nome}
              size={`40px`}
              onClick={() => { }}
            />
          </Link>
        )}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <p className="text-lg font-semibold text-gray-900 truncate  px-1 rounded transition">
            {titulo}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {criado_em && (
              <span className="flex items-center gap-1"><FaCalendarAlt style={{ display: 'inline-block' }} /> {new Date(criado_em).toLocaleDateString()}</span>
            )}
          </div>
          {professor_nome && (
            <p className="text-[13px] text-gray-500 leading-[100%] truncate">{professor_nome}</p>
          )}
        </div>
      </div>
      {/* Descrição opcional */}
      {descricao && (
        <div className="px-4 pb-3 text-gray-600 text-sm truncate-2-lines">
          {descricao}
        </div>
      )}
      {/* Ações só aparecem no hover */}
      {showActions && (onEdit || onDelete) && (
        <div className={`flex gap-2 px-4 pb-4 mt-auto transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 py-1 rounded bg-gray-800 text-white font-semibold hover:bg-gray-700 transition shadow-sm"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-700 transition shadow-sm"
            >
              Excluir
            </button>
          )}
        </div>
      )}
    </Link>
  )
}
