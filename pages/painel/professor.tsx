import { useEffect, useState, useMemo } from "react"
import { useAuth } from "../../utils/AuthContext"
import ProtectedRoute from "../../components/ProtectedRoute"
import Navbar from "../../components/Navbar"
import VideoCard from "../../components/VideoCard"
import VideoUploadModal from "../../components/VideoUploadModal"
import { useRouter } from "next/router"
import Breadcrumb from "@/components/Breadcrumb"
import EditPlaylistModal from "@/components/EditPlaylistModal"
import Image from "next/image"
import api from "@/utils/axiosConfig"

interface Playlist {
  id: number
  nome: string
  descricao: string
  foto?: string
}

interface Video {
  id: number
  titulo: string
  descricao: string
  arquivo: string
  criado_em: string
  playlists?: Playlist[]
  professor: number
  professor_nome: string
  duracao?: number
}

export default function PainelProfessor() {
  const router = useRouter()
  const { playlist: playlistIdQuery } = router.query

  const [allVideos, setAllVideos] = useState<Video[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [playlistSelecionada, setPlaylistSelecionada] =
    useState<Playlist | null>(null)
  const [loading, setLoading] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [playlistToEdit, setPlaylistToEdit] = useState<Playlist | null>(null)

  useEffect(() => {
    setLoading(true)

    // Buscar todas as playlists do professor
    api.get("playlists/")
      .then((res) => setPlaylists(res.data))
      .catch(() => setPlaylists([]))

    // Se há um playlistId na URL, buscar os vídeos dessa playlist específica
    if (playlistIdQuery) {
      const id = Number(playlistIdQuery)
      api.get(`playlists/${id}/`)
        .then((res) => {
          setPlaylistSelecionada(res.data)
          // Buscar os vídeos dessa playlist específica
          api.get(`playlists/${id}/videos/`)
            .then((res) => {
              setAllVideos(res.data)
              setLoading(false)
            })
            .catch(() => {
              console.error("Erro ao carregar vídeos da playlist")
              setLoading(false)
            })
        })
        .catch((error) => {
          router.push("/painel/professor")
          setLoading(false)
        })
    } else {
      // Se não tem playlistId na URL, buscar todos os vídeos do professor
      setPlaylistSelecionada(null)
      api.get("videos/")
        .then((res) => setAllVideos(res.data))
        .finally(() => setLoading(false))
    }
  }, [playlistIdQuery, router])

  const handlePlaylistClickInCard = (playlistId: number) => {
    router.push(`/painel/professor?playlist=${playlistId}`)
  }

  const handleVideoUploaded = () => {
    // Recarregar os vídeos após o upload
    if (playlistSelecionada) {
      router.push(`/painel/professor?playlist=${playlistSelecionada.id}`)
    } else {
      router.push("/painel/professor")
    }
  }

  const handleEditPlaylist = (playlist: Playlist) => {
    setPlaylistToEdit(playlist)
    setIsEditModalOpen(true)
  }

  const fetchPlaylists = () => {
    api.get("playlists/")
      .then((res) => setPlaylists(res.data))
      .catch(() => setPlaylists([]))
  }

  return (
    <ProtectedRoute allowedTypes={["professor"]}>
      <Navbar />
      <div className="p-8 bg-gray-100 min-h-screen">
        {playlistSelecionada && (
          <Breadcrumb
            items={[
              { label: "Painel do Professor", href: "/painel/professor" },
              { label: playlistSelecionada.nome },
            ]}
            showBack={false}
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center">
            {!playlistSelecionada
              ? "Suas Playlists"
              : `Vídeos da Playlist: ${playlistSelecionada.nome}`}
          </h2>
          <div>
            {playlistSelecionada && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                onClick={() => handleEditPlaylist(playlistSelecionada)}
              >
                Editar Playlist
              </button>
            )}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Enviar Vídeo
            </button>
          </div>
        </div>

        {loading && <p className="text-center">Carregando...</p>}

        {!playlistSelecionada && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
                onClick={() => handlePlaylistClickInCard(playlist.id)}
              >
                <Image
                  src={playlist.foto || "/default_playlist.png"}
                  alt={playlist.nome}
                  width={200}
                  height={200}
                  className="w-full object-cover rounded mb-2"
                  style={{
                    aspectRatio: 1
                  }}
                />
                <h3 className="text-lg font-semibold">{playlist.nome}</h3>
                <p className="text-gray-500">{playlist.descricao}</p>
              </div>
            ))}
          </div>
        )}

        {playlistSelecionada && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allVideos.map((video) => (
              <VideoCard
                key={video.id}
                titulo={video.titulo}
                descricao={video.descricao}
                link={video.arquivo}
                criado_em={video.criado_em}
                professor_nome={video.professor_nome}
                onClick={() => router.push(`/video/${video.id}`)}
                showActions
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Upload de Vídeo */}
      <VideoUploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onVideoUploaded={handleVideoUploaded}
      />

      {/* Modal de Edição de Playlist */}
      {playlistToEdit && (
        <EditPlaylistModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          playlist={playlistToEdit}
          onSave={() => {
            setIsEditModalOpen(false)
            // Recarregar playlists
            fetchPlaylists()
          }}
        />
      )}
    </ProtectedRoute>
  )
}
