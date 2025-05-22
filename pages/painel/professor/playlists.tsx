import { useEffect, useState } from "react"
import ProtectedRoute from "../../../components/ProtectedRoute"
import Navbar from "../../../components/Navbar"
import Breadcrumb from "@/components/Breadcrumb"
import api from "@/utils/axiosConfig"
import Image from "next/image"
import { useRouter } from "next/router"
import PlaylistSelectModal from "../../../components/PlaylistSelectModal"

export default function PlaylistsProfessor() {
    const router = useRouter()
    const [playlists, setPlaylists] = useState<any[]>([])
    const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false)

    const fetchPlaylists = () => {
        api.get("playlists/", {
            withCredentials: true
        }).then((res) => setPlaylists(res.data))
    }

    useEffect(() => {
        fetchPlaylists()
    }, [])

    return (
        <ProtectedRoute allowedTypes={["professor"]}>
            <Navbar />
            <div className="p-8 bg-gray-50 mt-10 min-h-screen">
                <Breadcrumb items={[{ label: "Painel do Professor", href: "/painel/professor" }, { label: "Todas suas playlists" }]} />
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 text-center">Suas Playlists</h2>
                    <button
                        className="px-4 py-2 bg-gray-800 text-white rounded shadow-sm hover:bg-gray-700 transition border border-gray-700 ml-2"
                        onClick={() => setIsCreatePlaylistModalOpen(true)}
                    >
                        Criar nova playlist
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {playlists.map((playlist) => {
                        return (
                            <div
                                key={playlist.id}
                                className="p-4 bg-white border border-gray-200 rounded shadow-sm cursor-pointer hover:bg-gray-100 flex flex-col items-center"
                                onClick={() => router.push(`/painel/professor/playlist/${playlist.id}`)}
                            >
                                <Image
                                    src={playlist.foto}
                                    alt={playlist.nome}
                                    width={200}
                                    height={200}
                                    className="w-full object-cover rounded mb-2"
                                    style={{ aspectRatio: 1 }}
                                />
                                <h3 className="text-lg font-semibold text-gray-900 text-center">{playlist.nome}</h3>
                                <p className="text-gray-600 text-center">{playlist.descricao}</p>
                            </div>
                        )
                    })}
                </div>
                {isCreatePlaylistModalOpen && (
                    <PlaylistSelectModal
                        onClose={() => {
                            setIsCreatePlaylistModalOpen(false)
                            fetchPlaylists()
                        }}
                    />
                )}
            </div>
        </ProtectedRoute>
    )
} 