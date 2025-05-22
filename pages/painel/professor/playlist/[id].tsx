import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Breadcrumb from "@/components/Breadcrumb"
import api from "@/utils/axiosConfig"
import VideoCard from "@/components/VideoCard"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import EditPlaylistModal from "@/components/EditPlaylistModal"
import VideoUploadModal from "@/components/VideoUploadModal"
import Image from "next/image"

export default function PlaylistProfessorPage() {
    const router = useRouter()
    const { id } = router.query
    const [playlist, setPlaylist] = useState<any>(null)
    const [videos, setVideos] = useState<any[]>([])
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchPlaylist = () => {
        if (!id) return
        setLoading(true)
        api.get(`playlists/${id}/`, { withCredentials: true })
            .then(res => setPlaylist(res.data))
            .finally(() => setLoading(false))
    }

    const fetchVideos = () => {
        if (!id) return
        setLoading(true)
        api.get(`playlists/${id}/videos/`, { withCredentials: true })
            .then(res => setVideos(res.data))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchPlaylist()
        fetchVideos()
    }, [id])

    return (
        <ProtectedRoute allowedTypes={["professor"]}>
            <Navbar />
            <div className="p-8 bg-gray-50 mt-10 min-h-screen">
                <Breadcrumb
                    items={[
                        { label: "Painel do Professor", href: "/painel/professor" },
                        { label: "Todas suas playlists", href: "/painel/professor/playlists" },
                        { label: playlist?.nome || "Playlist" }
                    ]}
                />
                <div className="flex items-center gap-4 mb-4 justify-between">
                    <div className="flex items-center gap-4">
                        <Image src={playlist?.foto_url} alt={playlist?.nome} width={80} height={80} />
                        <div>

                            <h2 className="text-2xl font-bold mb-1">{playlist?.nome}</h2>
                            <p className="text-gray-600">{playlist?.descricao}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 bg-blue-700 text-white rounded shadow-sm hover:bg-blue-800 transition border border-blue-800 text-sm"
                            onClick={() => setUploadModalOpen(true)}
                        >
                            Enviar vídeo
                        </button>
                        <button
                            className="px-3 py-1 bg-gray-800 text-white rounded shadow-sm hover:bg-gray-700 transition border border-gray-700 text-sm"
                            onClick={() => setEditModalOpen(true)}
                        >
                            Editar playlist
                        </button>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vídeos da Playlist</h3>
                {loading && <p className="text-center text-gray-500">Carregando vídeos...</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">Nenhum vídeo nesta playlist.</div>
                    )}
                    {videos.map(video => (
                        <VideoCard
                            key={video.id}
                            titulo={video.titulo}
                            descricao={video.descricao}
                            link={`/painel/professor/video/${video.id}`}
                            criado_em={video.criado_em}
                            thumbnail={video.thumbnail}
                            professor_nome={video.professor_nome}
                            professor_id={video.professor}
                        />
                    ))}
                </div>
                {editModalOpen && playlist && (
                    <EditPlaylistModal
                        open={editModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        playlist={playlist}
                        onSave={fetchPlaylist}
                    />
                )}
                {uploadModalOpen && playlist && (
                    <VideoUploadModal
                        open={uploadModalOpen}
                        onClose={() => setUploadModalOpen(false)}
                        onVideoUploaded={fetchVideos}
                        playlistId={playlist.id}
                    />
                )}
            </div>
        </ProtectedRoute>
    )
}