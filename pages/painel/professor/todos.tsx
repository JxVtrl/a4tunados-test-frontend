import { useEffect, useState } from "react"
import ProtectedRoute from "../../../components/ProtectedRoute"
import Navbar from "../../../components/Navbar"
import VideoCard from "../../../components/VideoCard"
import VideoUploadModal from "../../../components/VideoUploadModal"
import Breadcrumb from "@/components/Breadcrumb"
import api from "@/utils/axiosConfig"
import { useRouter } from "next/router"

export default function TodosVideosProfessor() {
    const router = useRouter()
    const [allVideos, setAllVideos] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

    const fetchVideos = () => {
        setLoading(true)
        api.get("videos/")
            .then((res) => setAllVideos(res.data))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchVideos()
    }, [])

    const handleVideoUploaded = () => {
        fetchVideos()
        setIsUploadModalOpen(false)
    }

    return (
        <ProtectedRoute allowedTypes={["professor"]}>
            <Navbar />
            <div className="p-8 bg-gray-50 mt-10 min-h-screen">
                <Breadcrumb items={[{ label: "Painel do Professor", href: "/painel/professor" }, { label: "Todos seus vídeos" }]} />
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 text-center">Todos seus vídeos</h2>
                    <button
                        className="px-4 py-2 bg-gray-800 text-white rounded shadow-sm hover:bg-gray-700 transition border border-gray-700"
                        onClick={() => setIsUploadModalOpen(true)}
                    >
                        Enviar Vídeo
                    </button>
                </div>
                {loading && <p className="text-center text-gray-600">Carregando...</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allVideos.map((video) => {
                        console.log(`video`, video)

                        return (
                            <VideoCard
                                key={video.id}
                                titulo={video.titulo}
                                descricao={video.descricao}
                                link={`/painel/professor/video/${video.id}`}
                                criado_em={video.criado_em}
                                professor_nome={video.professor_nome}
                                showActions
                                thumbnail={video.thumbnail}
                                professor_id={video.professor_id}
                            />
                        )
                    })}
                    {allVideos.length === 0 && !loading && (
                        <div className="col-span-full text-center text-gray-500">Nenhum vídeo encontrado.</div>
                    )}
                </div>
            </div>
            <VideoUploadModal
                open={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onVideoUploaded={handleVideoUploaded}
            />
        </ProtectedRoute>
    )
} 