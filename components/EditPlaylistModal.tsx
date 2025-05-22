import api from "@/utils/axiosConfig"
import Image from "next/image"
import React, { useState } from "react"

interface EditPlaylistModalProps {
  open: boolean
  onClose: () => void
  playlist: { id: number; nome: string; descricao: string; foto?: string; foto_url?: string }
  onSave: () => void
}

export default function EditPlaylistModal({
  open,
  onClose,
  playlist,
  onSave,
}: EditPlaylistModalProps) {
  const [nome, setNome] = useState(playlist.nome)
  const [descricao, setDescricao] = useState(playlist.descricao)
  const [foto, setFoto] = useState<File | string | undefined>(playlist?.foto_url)

  const handleSave = async () => {
    try {
      const formData = new FormData()
      formData.append("nome", nome)
      formData.append("descricao", descricao)
      if (foto) {
        formData.append("foto", foto)
      }
      const res = await api.put(
        `playlists/${playlist.id}/`,
        formData,
        {
          withCredentials: true,
        }
      )

      if (res.status !== 200) {
        throw new Error("Erro ao salvar alterações")
      }
      alert("Playlist editada com sucesso!")

      onSave()
      onClose()
    } catch (error: any) {
      alert("Erro ao salvar alterações: " + error.message)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative border border-gray-200">
        <button className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-700" onClick={onClose}>
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Editar Playlist</h2>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Nome</label>
          <input
            className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-700"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Descrição</label>
          <textarea
            className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-700"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Foto</label>
          {playlist.foto_url && (
            <Image
              src={playlist.foto_url || "/default_playlist.png"}
              alt="Playlist"
              width={200}
              height={200}
              className="rounded mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={(e) =>
              setFoto(e.target.files ? e.target.files[0] : undefined)
            }
          />
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded shadow-sm hover:bg-gray-700 transition"
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
