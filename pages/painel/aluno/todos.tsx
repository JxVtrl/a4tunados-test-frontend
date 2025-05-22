import { useEffect, useState, useMemo } from "react"
import ProtectedRoute from "../../../components/ProtectedRoute"
import Navbar from "../../../components/Navbar"
import VideoCard from "../../../components/VideoCard"
import Breadcrumb from "@/components/Breadcrumb"
import api from "@/utils/axiosConfig"
import { useRouter } from "next/router"

export default function TodosVideosAluno() {
    const router = useRouter()
    const [allVideos, setAllVideos] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOption, setSortOption] = useState("criado_em")

    useEffect(() => {
        setLoading(true)
        api.get("videos/")
            .then((res) => setAllVideos(res.data))
            .finally(() => setLoading(false))
    }, [])

    const filteredAndSortedVideos = useMemo(() => {
        let videosToShow = [...allVideos]
        if (searchTerm) {
            videosToShow = videosToShow.filter(
                (video) =>
                    video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    video.descricao.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        videosToShow.sort((a, b) => {
            if (sortOption === "titulo") {
                return a.titulo.localeCompare(b.titulo)
            } else if (sortOption === "criado_em") {
                return new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
            }
            return 0
        })
        return videosToShow
    }, [allVideos, searchTerm, sortOption])

    return (
        <ProtectedRoute allowedTypes={["aluno"]}>
            <Navbar />
            <div className="p-8 bg-gray-50 mt-10 min-h-screen">
                <Breadcrumb items={[{ label: "Painel do Aluno", href: "/painel/aluno" }, { label: "Todos os Vídeos" }]} />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Todos os Vídeos</h3>
                {loading && <p className="text-center text-gray-500">Carregando vídeos...</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedVideos.map((video) => {
                        console.log(video); return (
                            <div key={video.id} className="bg-white border border-gray-200 rounded shadow-sm cursor-pointer hover:bg-gray-100 flex flex-col">
                                <VideoCard
                                    titulo={video.titulo}
                                    descricao={video.descricao}
                                    link={video.arquivo}
                                    criado_em={video.criado_em}
                                    onClick={() => router.push(`/video/${video.id}`)}
                                    professor_nome={video.professor_nome}
                                    thumbnail={video.thumbnail}
                                    professor_id={video.professor}
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