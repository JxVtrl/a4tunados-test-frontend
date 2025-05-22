import { useEffect, useState } from "react"
import ProtectedRoute from "../../../../components/ProtectedRoute"
import Navbar from "../../../../components/Navbar"
import Breadcrumb from "@/components/Breadcrumb"
import api from "@/utils/axiosConfig"
import { useRouter } from "next/router"
import VideoCard from "../../../../components/VideoCard"
import Image from "next/image"

export default function PlaylistAluno() {
    const router = useRouter()
    const { id } = router.query
    const [playlist, setPlaylist] = useState<any>(null)
    const [videos, setVideos] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!id) return
        setLoading(true)
        api.get(`playlists/${id}/`).then(res => setPlaylist(res.data))
        api.get(`playlists/${id}/videos/`).then(res => setVideos(res.data)).finally(() => setLoading(false))
    }, [id])

    return (
        <ProtectedRoute allowedTypes={["aluno"]}>
            <Navbar />
            <div className="p-8 bg-gray-100 mt-10 min-h-screen">
                <Breadcrumb items={[{ label: "Painel do Aluno", href: "/painel/aluno" }, { label: playlist?.nome || "Playlist" }]} />
                {playlist && (
                    <div className="flex items-center gap-4 mb-6">
                        <Image src={playlist.foto.replace(`http://`, `https://`)} alt={playlist.nome} width={80} height={80} />
                        <div>
                            <h2 className="text-2xl font-bold mb-1">{playlist.nome}</h2>
                            <p className="text-gray-600">{playlist.descricao}</p>
                        </div>
                    </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vídeos da Playlist</h3>
                {loading && <p className="text-center text-gray-500">Carregando vídeos...</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video) => {
                        return (
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
                        )
                    })}
                    {videos.length === 0 && !loading && (
                        <div className="col-span-full text-center text-gray-500">Nenhum vídeo encontrado.</div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
} 