import { useEffect, useState } from "react"
import ProtectedRoute from "../../../components/ProtectedRoute"
import Navbar from "../../../components/Navbar"
import Breadcrumb from "@/components/Breadcrumb"
import api from "@/utils/axiosConfig"
import Image from "next/image"
import { useRouter } from "next/router"

export default function PlaylistsAluno() {
    const router = useRouter()
    const [playlists, setPlaylists] = useState<any[]>([])
    useEffect(() => {
        api.get("playlists/").then((res) => setPlaylists(res.data))
    }, [])
    return (
        <ProtectedRoute allowedTypes={["aluno"]}>
            <Navbar />
            <div className="p-8 bg-gray-100 mt-10 min-h-screen">
                <Breadcrumb items={[{ label: "Painel do Aluno", href: "/painel/aluno" }, { label: "Playlists" }]} />
                <h2 className="text-2xl font-bold mb-6 text-center">Playlists</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {playlists.map((pl) => (
                        <div
                            key={pl.id}
                            className="bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:bg-blue-50"
                            onClick={() => router.push(`/painel/aluno/playlist/${pl.id}`)}
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