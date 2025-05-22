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
  const [professores, setProfessores] = useState<{ id: number, username: string, email: string, tipo: string }[]>([])
  const [loadingProfessores, setLoadingProfessores] = useState(false)
  const [erroProfessores, setErroProfessores] = useState<string | null>(null)
  const [professorSelecionado, setProfessorSelecionado] = useState<{ id: number, username: string } | null>(null)
  const [professorPlaylists, setProfessorPlaylists] = useState<any[]>([])
  const [loadingPlaylistsProf, setLoadingPlaylistsProf] = useState(false)
  const [erroPlaylistsProf, setErroPlaylistsProf] = useState<string | null>(null)

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
    } else if (professorSelecionado) {
      // Se um professor foi selecionado, buscar vídeos desse professor
      setPlaylistSelecionada(null)
      setFilterPlaylistId("")
      api.get(`videos/?professor=${professorSelecionado.id}`)
        .then((res) => setAllVideos(res.data))
        .finally(() => setLoading(false))
    } else {
      // Se não tem playlistId nem professor selecionado, buscar todos os vídeos por padrão
      setPlaylistSelecionada(null) // Garantir que não estamos no modo playlist específica
      setFilterPlaylistId("") // Resetar filtro de playlist ao sair da view de playlist específica
      api.get("videos/")
        .then((res) => setAllVideos(res.data))
        .finally(() => setLoading(false))
    }
  }, [playlistIdQuery, router, professorSelecionado]) // Adicionar professorSelecionado como dependência

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

  // Buscar professores quando viewMode for 'professores'
  useEffect(() => {
    if (viewMode === "professores") {
      setLoadingProfessores(true)
      setErroProfessores(null)
      api.get("professores/")
        .then(res => setProfessores(res.data))
        .catch(() => setErroProfessores("Erro ao carregar professores"))
        .finally(() => setLoadingProfessores(false))
    }
  }, [viewMode])

  // Buscar playlists do professor selecionado
  useEffect(() => {
    if (professorSelecionado) {
      setLoadingPlaylistsProf(true)
      setErroPlaylistsProf(null)
      api.get(`playlists/?professor=${professorSelecionado.id}`)
        .then(res => setProfessorPlaylists(res.data))
        .catch(() => setErroPlaylistsProf("Erro ao carregar playlists do professor"))
        .finally(() => setLoadingPlaylistsProf(false))
    } else {
      setProfessorPlaylists([])
    }
  }, [professorSelecionado])

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
              onClick={() => {
                setProfessorSelecionado(null);
                setPlaylistSelecionada(null);
                setViewMode("videos");
              }}
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

  // Renderização da listagem de Professores
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
          {loadingProfessores && <div className="text-center text-gray-500">Carregando professores...</div>}
          {erroProfessores && <div className="text-center text-red-500">{erroProfessores}</div>}
          {!loadingProfessores && !erroProfessores && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {professores.map((prof) => (
                <div key={prof.id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center cursor-pointer hover:bg-blue-50"
                  onClick={() => {
                    setProfessorSelecionado({ id: prof.id, username: prof.username });
                    setViewMode("videos");
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold mb-2">
                    {prof.username[0].toUpperCase()}
                  </div>
                  <div className="font-bold text-lg mb-1">{prof.username}</div>
                  <div className="text-gray-600 text-sm mb-1">{prof.email}</div>
                  {/* <div className="text-blue-600 text-xs">{prof.tipo}</div> */}
                </div>
              ))}
              {professores.length === 0 && (
                <div className="col-span-full text-center text-gray-500">Nenhum professor encontrado.</div>
              )}
            </div>
          )}
        </div>
      </ProtectedRoute>
    )
  }

  // Renderização padrão: Todos os Vídeos (ou vídeos de uma playlist ou de um professor)
  return (
    <ProtectedRoute allowedTypes={["aluno"]}>
      <Navbar />
      <div className="p-8 bg-gray-50 mt-10 min-h-screen">
        {!playlistSelecionada && (
          <Breadcrumb
            items={[
              { label: "Painel do Aluno", href: "/painel/aluno" },
              professorSelecionado
                ? { label: `Conteúdos de ${professorSelecionado.username}` }
                : { label: "Todos os Vídeos" },
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

        {/* Se um professor foi selecionado e não está em uma playlist específica, mostrar playlists do professor */}
        {professorSelecionado && !playlistSelecionada && (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Playlists de {professorSelecionado.username}</h3>
            {loadingPlaylistsProf && <div className="text-center text-gray-500 mb-4">Carregando playlists...</div>}
            {erroPlaylistsProf && <div className="text-center text-red-500 mb-4">{erroPlaylistsProf}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {professorPlaylists.map((pl) => (
                <div
                  key={pl.id}
                  className="bg-white border border-gray-200 rounded shadow-sm p-4 cursor-pointer hover:bg-gray-100 flex flex-col items-center"
                  onClick={() => {
                    setViewMode("videos");
                    setPlaylistSelecionada(pl);
                  }}
                >
                  {pl.foto && (
                    <img src={pl.foto} alt={pl.nome} className="w-24 h-24 object-cover rounded mb-2" />
                  )}
                  <h4 className="font-bold text-lg text-gray-900 mb-1 text-center">{pl.nome}</h4>
                  <p className="text-gray-600 text-sm text-center">{pl.descricao}</p>
                </div>
              ))}
              {professorPlaylists.length === 0 && !loadingPlaylistsProf && (
                <div className="col-span-full text-center text-gray-500">Nenhuma playlist encontrada.</div>
              )}
            </div>
          </>
        )}

        {/* Grid de vídeos (de playlist, professor ou todos) */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {playlistSelecionada
            ? `Vídeos da Playlist: ${playlistSelecionada.nome}`
            : professorSelecionado
              ? `Todos os vídeos de ${professorSelecionado.username}`
              : "Todos os Vídeos"}
        </h3>
        {loading && <p className="text-center text-gray-500">Carregando vídeos...</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedVideos.map((video) => {
            return (
              <div key={video.id} className="bg-white border border-gray-200 rounded shadow-sm cursor-pointer hover:bg-gray-100 flex flex-col">
                <VideoCard
                  titulo={video.titulo}
                  descricao={video.descricao}
                  link={video.arquivo}
                  criado_em={video.criado_em}
                  onClick={() => router.push(`/video/${video.id}`)}
                  professor_nome={video.professor_nome}
                />
              </div>
            )
          })}
          {filteredAndSortedVideos.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-500">Nenhum vídeo encontrado.</div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
