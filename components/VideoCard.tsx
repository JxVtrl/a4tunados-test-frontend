// frontend/components/VideoCard.tsx

import { useRouter } from "next/router"
import React from "react"
import Avatar from "./Avatar"

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
  professor_nome: string
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
}: VideoCardProps) {
  const isArquivo =
    link &&
    (link.startsWith("/media/") ||
      link.startsWith("http://localhost:8000/media/") ||
      link.match(/\.(mp4|webm|ogg)$/i))

  // Usar um div para o conteúdo clicável principal para não conflitar com botões internos
  const handleCardClick = (e: React.MouseEvent) => {
    // Evita que o clique nos botões internos ative o clique do card
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLSpanElement
    ) {
      return
    }
    if (onClick) {
      onClick()
    }
  }

  const handleAvatarClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation()
  }

  return (
    <li className=" border-b border-gray-200  hover:bg-gray-50 transition cursor-pointer list-none">
      <div
        onClick={handleCardClick}
        className="flex flex-col items-center"
      >
        <div
          className="w-full  flex-shrink-0 bg-black rounded overflow-hidden flex  items-center justify-center"
          style={{
            aspectRatio: `16/9`,
          }}
        >
          {isArquivo ? (
            <video
              src={link}
              className="w-full h-full object-cover"
              preload="metadata"
              muted
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sem vídeo
            </div>
          )}
          {/* Mostrar duração no canto da miniatura (opcional) */}
          {duracao && (
            <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
              {duracao} {/* Use a prop de duração diretamente */}
            </span>
          )}
        </div>
        <div className="w-full flex gap-2  py-2">
          <Avatar
            imageUrl=""
            name={professor_nome}
            size={`36px`}
            onClick={handleAvatarClick} // Adicionando o evento de clique
          />

          <div className="flex-1 flex flex-col gap-[6px]">
            <p className=" text-[16px] leading-[100%] font-[600] text-gray-800">
              {titulo}
            </p>
            {professor_nome && (
              <p className=" text-[14px] text-gray-500 leading-[100%]">
                {professor_nome}
              </p>
            )}
            {/* Adicionado mb-1 */}
            {criado_em && (
              <p className=" text-[14px] text-gray-400 leading-[100%]">
                {new Date(criado_em).toLocaleString()}
              </p>
            )}
            {showActions && (
              <div className="flex gap-2 mt-2">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="flex-1 py-1 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
                  >
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="flex-1 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                  >
                    Excluir
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}
