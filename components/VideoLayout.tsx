import React from 'react'
import Avatar from './Avatar'
import { useRouter } from 'next/router'
import { Video } from '@/pages/video/[id]'

export default function VideoLayout({ video }: {
    video: Video
}) {
    const router = useRouter()

    console.log(`video`, video)
    return (
        <div className="flex-1 bg-white rounded-xl shadow p-6">
            <video
                src={video.arquivo_url.replace(`http://`, `https://`)}
                controls
                className="w-full rounded mb-4 aspect-video"
                poster={video.thumbnail}
                preload="metadata"
                autoPlay={false}
                muted={false}
                loop={false}
                playsInline={false}
                controlsList="nodownload"
                disablePictureInPicture={false}
                disableRemotePlayback={false}
            />
            <h1 className="text-2xl font-bold mb-2">{video.titulo}</h1>
            {/* Avatar e nome do professor */}
            <div
                className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80"
                onClick={() => {
                    if (video.professor || video.professor_nome) {
                        router.push({
                            pathname: '/painel/aluno',
                            query: {
                                professorId: video.professor?.id,
                                professorNome: video.professor_nome || video.professor?.username
                            }
                        })
                    }
                }}
            >
                <Avatar
                    name={video.professor_nome || video.professor?.username || "?"}
                    size="40px"
                    onClick={() => { }}
                />
                <span className="text-gray-700 font-medium">
                    {video.professor_nome || video.professor?.username}
                </span>
            </div>
            <p className="text-gray-700 mb-2">{video.descricao}</p>
            <span className="text-xs text-gray-400">
                {new Date(video.criado_em).toLocaleString()}
            </span>
        </div>
    )
}