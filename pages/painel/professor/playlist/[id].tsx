import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Breadcrumb from "@/components/Breadcrumb"
import api from "@/utils/axiosConfig"
import VideoCard from "@/components/VideoCard"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import EditPlaylistModal from "@/components/EditPlaylistModal"

export default function PlaylistProfessorPage() {
    const router = useRouter()
    const { id } = router.query
    const [playlist, setPlaylist] = useState<any>(null)
    const [videos, setVideos] = useState<any[]>([])
    const [editModalOpen, setEditModalOpen] = useState(false)

    const fetchPlaylist = () => {
        if (!id) return
        api.get(`playlists/${id}/`, { withCredentials: true })
            .then(res => setPlaylist(res.data))
    }

    useEffect(() => {
        fetchPlaylist()
        if (!id) return
        api.get(`playlists/${id}/videos/`, { withCredentials: true })
            .then(res => setVideos(res.data))
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
                    <h2 className="text-2xl font-bold text-gray-900">{playlist?.nome}</h2>
                    <button
                        className="px-3 py-1 bg-gray-800 text-white rounded shadow-sm hover:bg-gray-700 transition border border-gray-700 text-sm"
                        onClick={() => setEditModalOpen(true)}
                    >
                        Editar playlist
                    </button>
                </div>
                <p className="text-gray-600 mb-6">{playlist?.descricao}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">Nenhum vídeo nesta playlist.</div>
                    )}
                    {videos.map(video => (
                        <VideoCard
                            key={video.id}
                            titulo={video.titulo}
                            descricao={video.descricao}
                            link={`/video/${video.id}`}
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
            </div>
        </ProtectedRoute>
    )
}