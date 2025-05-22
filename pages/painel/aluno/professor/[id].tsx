import { useEffect, useState } from "react"
import ProtectedRoute from "../../../../components/ProtectedRoute"
import Navbar from "../../../../components/Navbar"
import Breadcrumb from "@/components/Breadcrumb"
import api from "@/utils/axiosConfig"
import { useRouter } from "next/router"
import VideoCard from "../../../../components/VideoCard"
import Image from "next/image"

export default function ProfessorAluno() {
    const router = useRouter()
    const { id } = router.query
    const [professor, setProfessor] = useState<any>(null)
    const [playlists, setPlaylists] = useState<any[]>([])
    const [videos, setVideos] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!id) return
        setLoading(true)
        api.get(`professores/`).then(res => {
            const prof = res.data.find((p: any) => p.id == id)
            setProfessor(prof)
        })
        api.get(`playlists/?professor=${id}`).then(res => setPlaylists(res.data))
        api.get(`videos/?professor=${id}`).then(res => setVideos(res.data)).finally(() => setLoading(false))
    }, [id])

    return (
        <ProtectedRoute allowedTypes={["aluno"]}>
            <Navbar />
            <div className="p-8 bg-gray-100 mt-10 min-h-screen">
                <Breadcrumb items={[{ label: "Painel do Aluno", href: "/painel/aluno" }, { label: professor?.username || "Professor" }]} />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Conteúdos de {professor?.username}</h3>
                <h4 className="text-lg font-semibold mb-2">Playlists</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {playlists.map((pl) => (
                        <div
                            key={pl.id}
                            className="p-4 bg-white border border-gray-200 rounded shadow-sm cursor-pointer hover:bg-gray-100 flex flex-col items-center"
                            onClick={() => router.push(`/painel/aluno/playlist/${pl.id}`)}
                        >
                            <Image src={pl.foto.replace(`http://`, `https://`)} alt={pl.nome} width={200} height={200} className="w-full object-cover rounded mb-2" style={{ aspectRatio: 1 }} />
                            <h3 className="text-lg font-semibold text-gray-900 text-center">{pl.nome}</h3>
                            <p className="text-gray-600 text-center">{pl.descricao}</p>
                        </div>
                    ))}
                    {playlists.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">Nenhuma playlist encontrada.</div>
                    )}
                </div>
                <h4 className="text-lg font-semibold mb-2">Todos os Vídeos</h4>
                {loading && <p className="text-center text-gray-500">Carregando vídeos...</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <VideoCard
                            key={video.id}
                            titulo={video.titulo}
                            descricao={video.descricao}
                            link={`/video/${video.id}`}
                            criado_em={video.criado_em}
                            professor_nome={video.professor_nome}
                            thumbnail={video.thumbnail.replace(`http://`, `https://`)}
                            professor_id={video.professor_id}
                        />
                    ))}
                    {videos.length === 0 && !loading && (
                        <div className="col-span-full text-center text-gray-500">Nenhum vídeo encontrado.</div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
} 