// frontend/pages/video/[id].tsx

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import VideoCard from "@/components/VideoCard"
import { useAuth } from "@/utils/AuthContext"
import Breadcrumb from "@/components/Breadcrumb"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import api from "@/utils/axiosConfig"
import Avatar from "@/components/Avatar"
import VideoLayout from "@/components/VideoLayout"

export interface Video {
  id: number
  titulo: string
  descricao: string
  arquivo: string
  criado_em: string
  playlists?: { id: number; nome: string }[]
  professor: { id: number; username: string }
  professor_nome?: string
  thumbnail: string
}
export default function VideoPage() {
  const router = useRouter()
  const { id } = router.query
  const [video, setVideo] = useState<Video | null>(null)
  const [playlistVideos, setPlaylistVideos] = useState<Video[]>([])
  const [outrosVideos, setOutrosVideos] = useState<Video[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!id) return
    api.get(`videos/${id}/`)
      .then((res) => res.data)
      .then((data) => {
        setVideo(data)
        if (data.playlists && data.playlists.length > 0) {
          api.get(`playlists/${data.playlists[0].id}/videos/`)
            .then((res) => res.data)
            .then((data) => {
              const filteredVideos = data.filter((item: any) => {
                return item.id != id
              })

              setPlaylistVideos(filteredVideos)
            })
        }
      })
    // Buscar outros vídeos aleatórios
    api.get("videos/")
      .then((res) => res.data)
      .then((data: any) => {
        const filteredVideos = data.filter((item: any) => item.id !== id)
        setOutrosVideos(filteredVideos)
      })
  }, [id])

  if (!video) return <div>Carregando...</div>

  return (
    <ProtectedRoute allowedTypes={[`aluno`, `professor`]}>
      <Navbar />
      <div className="p-8 bg-gray-100 mt-10 min-h-screen">
        <Breadcrumb
          items={[
            {
              label: `Painel do ${user?.tipo.toWellFormed()}`,
              href: `/painel/${user?.tipo}`,
            },
            ...(video?.playlists?.map((pl) => ({
              label: pl.nome,
              href: `/painel/${user?.tipo}?playlist=${pl.id}`,
            })) || []),
            { label: video?.titulo || "" },
          ]}
          showBack
        />
        <div className="flex flex-col md:flex-row gap-8 ">
          {/* Vídeo principal */}
          <VideoLayout video={video} />
          {(playlistVideos.length === 0 && outrosVideos.filter(
            (v) =>
              v.id !== video.id &&
              (!playlistVideos.length ||
                !playlistVideos.some((pv) => pv.id === v.id))
          ).length === 0) || (
              <div className="w-full md:w-96 flex-shrink-0">
                {playlistVideos.length > 0 && (
                  <>
                    <h2 className="text-lg font-semibold mb-2">
                      Mais desta playlist
                    </h2>
                    <ul>
                      {playlistVideos.map((v) => (
                        <VideoCard
                          key={v.id}
                          titulo={v.titulo}
                          descricao={v.descricao}
                          link={`/video/${v.id}`}
                          criado_em={v.criado_em}
                          onEdit={() => router.push(`/video/${v.id}`)}
                          thumbnail={v.thumbnail}
                          professor_id={v.professor?.id}
                        />
                      ))}
                    </ul>
                  </>
                )}
                {outrosVideos.filter(
                  (v) =>
                    v.id !== video.id &&
                    (!playlistVideos.length ||
                      !playlistVideos.some((pv) => pv.id === v.id))
                ).length > 0 && (
                    <>
                      <h2 className="text-lg font-semibold mt-6 mb-2">
                        Outros vídeos
                      </h2>
                      <ul>
                        {outrosVideos
                          .filter(
                            (v) =>
                              v.id !== video.id &&
                              (!playlistVideos.length ||
                                !playlistVideos.some((pv) => pv.id === v.id))
                          )
                          .slice(0, 8)
                          .map((v) => (
                            <VideoCard
                              key={v.id}
                              titulo={v.titulo}
                              descricao={v.descricao}
                              link={`/video/${v.id}`}
                              criado_em={v.criado_em}
                              onEdit={() => router.push(`/video/${v.id}`)}
                              thumbnail={v.thumbnail}
                              professor_id={v.professor?.id}
                            />
                          ))}
                      </ul>
                    </>
                  )}
              </div>
            )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
