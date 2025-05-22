
import api from "@/utils/axiosConfig"
import Image from "next/image"
import React, { useState } from "react"

interface EditPlaylistModalProps {
  open: boolean
  onClose: () => void
  playlist: { id: number; nome: string; descricao: string; foto?: string }
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
  const [foto, setFoto] = useState<File | string | undefined>(playlist?.foto)

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
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button className="absolute top-2 right-2 text-2xl" onClick={onClose}>
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Editar Playlist</h2>
        <div className="mb-4">
          <label className="block font-semibold">Nome</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Descrição</label>
          <textarea
            className="w-full border rounded px-2 py-1"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Foto</label>
          {playlist.foto && (
            <Image
              src={playlist.foto || "/default_playlist.png"}
              alt="Playlist"
              width={200}
              height={200}
              className="rounded mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFoto(e.target.files ? e.target.files[0] : undefined)
            }
          />
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
