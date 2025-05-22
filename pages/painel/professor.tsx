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
import PlaylistSelectModal from "@/components/PlaylistSelectModal"

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
  const [viewMode, setViewMode] = useState<'inicio' | 'videos' | 'playlists'>('inicio')
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false)

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

  // Função para lidar com clique no breadcrumb
  const handleBreadcrumbClick = (href: string) => {
    if (href === "/painel/professor") {
      setViewMode("inicio")
      setPlaylistSelecionada(null)
      router.push("/painel/professor")
    } else {
      router.push(href)
    }
  }

  // Tela inicial de seleção
  if (viewMode === 'inicio') {
    return (
      <ProtectedRoute allowedTypes={["professor"]}>
        <Navbar />
        <div className="p-8 pb-[25vh] flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h2 className="text-2xl font-bold mb-8 text-center">O que você deseja ver?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            <button
              className="bg-blue-600 text-white rounded-xl shadow-lg p-8 text-xl font-semibold hover:bg-blue-700 transition"
              onClick={() => {
                setViewMode('videos');
                setPlaylistSelecionada(null);
              }}
            >
              Todos seus vídeos
            </button>
            <button
              className="bg-green-600 text-white rounded-xl shadow-lg p-8 text-xl font-semibold hover:bg-green-700 transition"
              onClick={() => {
                setViewMode('playlists');
                setPlaylistSelecionada(null);
              }}
            >
              Todas suas playlists
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedTypes={["professor"]}>
      <Navbar />
      <div className="p-8 bg-gray-100 mt-10 min-h-screen">
        <Breadcrumb
          items={[
            { label: "Painel do Professor", href: "/painel/professor" },
            playlistSelecionada
              ? { label: playlistSelecionada.nome }
              : viewMode === 'videos'
                ? { label: 'Todos seus vídeos' }
                : { label: 'Todas suas playlists' },
          ]}
          onClick={handleBreadcrumbClick}
        />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center">
            {playlistSelecionada
              ? `Vídeos da Playlist: ${playlistSelecionada.nome}`
              : viewMode === 'videos'
                ? 'Todos seus vídeos'
                : 'Suas Playlists'}
          </h2>
          <div className="flex items-center gap-2">
            {playlistSelecionada && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                onClick={() => handleEditPlaylist(playlistSelecionada)}
              >
                Editar Playlist
              </button>
            )}
            {(viewMode === 'videos' || playlistSelecionada) && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                onClick={() => setIsUploadModalOpen(true)}
              >
                Enviar Vídeo
              </button>
            )}
            {viewMode === 'playlists' && !playlistSelecionada && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition ml-2"
                onClick={() => setIsCreatePlaylistModalOpen(true)}
              >
                Criar nova playlist
              </button>
            )}
          </div>
        </div>

        {loading && <p className="text-center">Carregando...</p>}

        {/* Listagem de playlists */}
        {viewMode === 'playlists' && !playlistSelecionada && (
          <>
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
            {isCreatePlaylistModalOpen && (
              <PlaylistSelectModal
                onClose={() => {
                  setIsCreatePlaylistModalOpen(false)
                  fetchPlaylists()
                }}
              />
            )}
          </>
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

        {/* Listagem de vídeos do professor */}
        {viewMode === 'videos' && !playlistSelecionada && (
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
