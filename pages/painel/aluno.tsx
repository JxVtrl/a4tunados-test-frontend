import { useEffect, useState, useMemo } from "react" // Importar useMemo
import ProtectedRoute from "../../components/ProtectedRoute"
import Navbar from "../../components/Navbar"
import VideoCard from "../../components/VideoCard"
import { useRouter } from "next/router"
import Breadcrumb from "@/components/Breadcrumb"
import api from "@/utils/axiosConfig"
import Image from "next/image"

interface Playlist {
  id: number
  nome: string
  foto: string
  descricao: string
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
  duracao?: number // Adicionei duração ao tipo Video para ordenação
}

export default function PainelAluno() {
  const router = useRouter()
  const { playlist: playlistIdQuery } = router.query

  const [allVideos, setAllVideos] = useState<Video[]>([]) // Todos os vídeos (base para filtro)
  const [playlists, setPlaylists] = useState<Playlist[]>([]) // Para o filtro de playlist
  const [playlistSelecionada, setPlaylistSelecionada] =
    useState<Playlist | null>(null) // Playlist específica se navegou por ela
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("") // Estado para busca
  const [filterPlaylistId, setFilterPlaylistId] = useState("") // Estado para filtro de playlist (usado na view "Todos os Vídeos")
  const [sortOption, setSortOption] = useState("criado_em") // Estado para ordenação
  const [viewMode, setViewMode] = useState<"inicio" | "videos" | "playlists" | "professores">("inicio")

  useEffect(() => {
    setLoading(true)

    // Sempre buscar todas as playlists para popular o filtro dropdown
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
          router.push("/painel/aluno")
          setLoading(false)
        })
    } else {
      // Se não tem playlistId na URL, buscar todos os vídeos por padrão
      setPlaylistSelecionada(null) // Garantir que não estamos no modo playlist específica
      setFilterPlaylistId("") // Resetar filtro de playlist ao sair da view de playlist específica
      api.get("videos/")
        .then((res) => setAllVideos(res.data))
        .finally(() => setLoading(false))
    }
  }, [playlistIdQuery, router]) // Adicionar dependências

  // Lógica de filtragem, busca e ordenação usando useMemo para performance
  const filteredAndSortedVideos = useMemo(() => {
    let videosToShow = [...allVideos] // Começa com a lista base (todos ou de uma playlist)

    // Filtro por Playlist (aplicado apenas na view "Todos os Vídeos")
    if (!playlistSelecionada && filterPlaylistId) {
      videosToShow = videosToShow.filter((video) =>
        video.playlists?.some((p) => p.id === Number(filterPlaylistId))
      )
    }

    // Buscar por termo (aplicado em ambas as views)
    if (searchTerm) {
      videosToShow = videosToShow.filter(
        (video) =>
          video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Ordenar (aplicado em ambas as views)
    videosToShow.sort((a, b) => {
      if (sortOption === "titulo") {
        return a.titulo.localeCompare(b.titulo)
      } else if (sortOption === "criado_em") {
        return new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime() // Mais recentes primeiro
      } else if (sortOption === "duracao" && a.duracao && b.duracao) {
        return a.duracao - b.duracao // Menor duração primeiro (ou b.duracao - a.duracao para maior)
      }
      return 0 // Manter ordem original se não houver critério
    })

    return videosToShow
  }, [allVideos, searchTerm, filterPlaylistId, sortOption, playlistSelecionada]) // Adicionar dependências

  const handlePlaylistClickInCard = (playlistId: number) => {
    // Navega para a URL da playlist, que será detectada pelo useEffect para carregar os vídeos dela
    router.push(`/painel/aluno?playlist=${playlistId}`)
  }

  // Função para lidar com clique no breadcrumb
  const handleBreadcrumbClick = (href: string) => {
    if (href === "/painel/aluno") {
      setViewMode("inicio")
      router.push("/painel/aluno")
    } else {
      router.push(href)
    }
  }

  // Lógica para renderizar a tela inicial de seleção
  if (viewMode === "inicio") {
    return (
      <ProtectedRoute allowedTypes={["aluno"]}>
        <Navbar />
        <div className="p-8 pb-[25vh] flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h2 className="text-2xl font-bold mb-8 text-center">O que você deseja ver?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
            <button
              className="bg-blue-600 text-white rounded-xl shadow-lg p-8 text-xl font-semibold hover:bg-blue-700 transition"
              onClick={() => setViewMode("videos")}
            >
              Todos os Vídeos
            </button>
            <button
              className="bg-green-600 text-white rounded-xl shadow-lg p-8 text-xl font-semibold hover:bg-green-700 transition"
              onClick={() => setViewMode("playlists")}
            >
              Playlists
            </button>
            <button
              className="bg-purple-600 text-white rounded-xl shadow-lg p-8 text-xl font-semibold hover:bg-purple-700 transition"
              onClick={() => setViewMode("professores")}
            >
              Professores
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Renderização da listagem de Playlists
  if (viewMode === "playlists") {
    return (
      <ProtectedRoute allowedTypes={["aluno"]}>
        <Navbar />
        <div className="p-8 bg-gray-100 mt-10 min-h-screen">
          <Breadcrumb
            items={[
              { label: "Painel do Aluno", href: "/painel/aluno" },
              { label: "Playlists" },
            ]}
            onClick={handleBreadcrumbClick}
          />
          <h2 className="text-2xl font-bold mb-6 text-center">Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:bg-blue-50"
                onClick={() => {
                  setViewMode("videos");
                  router.push(`/painel/aluno?playlist=${pl.id}`)
                }}
              >
                <Image src={pl.foto} alt={pl.nome} width={100} height={100} />

                <h3 className="font-bold text-lg mb-2">{pl.nome}</h3>
                <p className="text-gray-600">{pl.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Renderização da listagem de Professores (placeholder)
  if (viewMode === "professores") {
    return (
      <ProtectedRoute allowedTypes={["aluno"]}>
        <Navbar />
        <div className="p-8 bg-gray-100 mt-10 min-h-screen">
          <Breadcrumb
            items={[
              { label: "Painel do Aluno", href: "/painel/aluno" },
              { label: "Professores" },
            ]}
            onClick={handleBreadcrumbClick}
          />
          <h2 className="text-2xl font-bold mb-6 text-center">Professores</h2>
          <div className="text-center text-gray-500">(Em breve: listagem de professores)</div>
        </div>
      </ProtectedRoute>
    )
  }

  // Renderização padrão: Todos os Vídeos (ou vídeos de uma playlist)
  return (
    <ProtectedRoute allowedTypes={["aluno"]}>
      <Navbar />
      <div className="p-8 bg-gray-100 mt-10 min-h-screen">
        {!playlistSelecionada && (
          <Breadcrumb
            items={[
              { label: "Painel do Aluno", href: "/painel/aluno" },
              { label: "Todos os Vídeos" },
            ]}
            onClick={handleBreadcrumbClick}
          />
        )}
        {playlistSelecionada && (
          <Breadcrumb
            items={[
              { label: "Painel do Aluno", href: "/painel/aluno" },
              { label: playlistSelecionada.nome },
            ]}
            showBack={false}
            onClick={handleBreadcrumbClick}
          />
        )}

        <h2 className="text-2xl font-bold mb-6 text-center">
          {!playlistSelecionada
            ? "Todos os Vídeos"
            : `Vídeos da Playlist: ${playlistSelecionada.nome}`}
        </h2>

        {!playlistSelecionada && (
          <div className="flex flex-col md:flex-row gap-4 mb-6 w-full items-center">
            <input
              type="text"
              placeholder="Buscar vídeos..."
              className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-row gap-2 w-full md:w-auto">
              <select
                className="py-2 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full md:min-w-[200px]"
                value={filterPlaylistId}
                onChange={(e) => setFilterPlaylistId(e.target.value)}
              >
                <option value="">Todas as Playlists</option>
                {playlists.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.nome}
                  </option>
                ))}
              </select>
              <select
                className="py-2 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full md:min-w-[200px]"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="criado_em">Ordenar por Data</option>
                <option value="titulo">Ordenar por Nome</option>
                {/* Adicione "duracao" como opção de ordenação se tiver o dado no backend */}
              </select>
            </div>
          </div>
        )}

        {loading && <p className="text-center">Carregando vídeos...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedVideos.map((video) => {
            return (
              <VideoCard
                key={video.id}
                titulo={video.titulo}
                descricao={video.descricao}
                link={video.arquivo}
                criado_em={video.criado_em}
                onClick={() => router.push(`/video/${video.id}`)}
                professor_nome={video.professor_nome}
              />
            )
          })}
        </div>
      </div>
    </ProtectedRoute>
  )
}
