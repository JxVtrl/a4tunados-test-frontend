import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import Breadcrumb from "@/components/Breadcrumb"
import Avatar from "@/components/Avatar"
import VideoForm from "@/components/VideoForm"
import api from "@/utils/axiosConfig"
import VideoLayout from "@/components/VideoLayout"

export default function VideoProfessorPage() {
    const router = useRouter()
    const { id } = router.query
    const [video, setVideo] = useState<any>(null)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!id) return
        api.get(`videos/${id}/`, { withCredentials: true })
            .then(res => setVideo(res.data))
    }, [id])

    const handleDelete = async () => {
        if (!window.confirm("Tem certeza que deseja excluir este vídeo?")) return
        setLoading(true)
        try {
            await api.delete(`videos/${id}/`, { withCredentials: true })
            router.push("/painel/professor/todos")
        } catch {
            alert("Erro ao excluir vídeo")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = async (formData: FormData) => {
        setLoading(true)
        try {
            await api.patch(`videos/${id}/`, formData, { withCredentials: true })
            setEditModalOpen(false)
            // Atualiza os dados do vídeo
            api.get(`videos/${id}/`, { withCredentials: true })
                .then(res => setVideo(res.data))
        } catch {
            alert("Erro ao editar vídeo")
        } finally {
            setLoading(false)
        }
    }

    if (!video) return <div>Carregando...</div>

    return (
        <ProtectedRoute allowedTypes={["professor"]}>
            <Navbar />
            <div className="p-8 bg-gray-100 mt-10 min-h-screen">
                <Breadcrumb
                    items={[
                        { label: "Painel do Professor", href: "/painel/professor" },
                        { label: "Todos seus vídeos", href: "/painel/professor/todos" },
                        { label: video?.titulo || "Vídeo" }
                    ]}
                />
                <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 bg-gray-800 text-white rounded shadow-sm hover:bg-gray-700 transition border border-gray-700 text-sm"
                                onClick={() => setEditModalOpen(true)}
                                disabled={loading}
                            >
                                Editar vídeo
                            </button>
                            <button
                                className="px-3 py-1 bg-red-600 text-white rounded shadow-sm hover:bg-red-700 transition border border-red-700 text-sm"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                Excluir vídeo
                            </button>
                        </div>
                    </div>
                    <VideoLayout video={video} />
                </div>
                {editModalOpen && (
                    <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative border border-gray-200">
                            <button className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-gray-700" onClick={() => setEditModalOpen(false)}>
                                ×
                            </button>
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Editar Vídeo</h2>
                            <VideoForm
                                onSubmit={handleEdit}
                                initialData={{ titulo: video.titulo, descricao: video.descricao, playlistsIds: video.playlists?.map((pl: any) => pl.id) || [], thumbnail: video.thumbnail }}
                                editMode
                                onCancel={() => setEditModalOpen(false)}
                                loading={loading}
                            />
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    )
}
