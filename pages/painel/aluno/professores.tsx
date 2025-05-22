import { useEffect, useState } from "react"
import ProtectedRoute from "../../../components/ProtectedRoute"
import Navbar from "../../../components/Navbar"
import Breadcrumb from "@/components/Breadcrumb"
import api from "@/utils/axiosConfig"
import { useRouter } from "next/router"

export default function ProfessoresAluno() {
    const router = useRouter()
    const [professores, setProfessores] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState<string | null>(null)
    useEffect(() => {
        setLoading(true)
        setErro(null)
        api.get("professores/")
            .then(res => setProfessores(res.data))
            .catch(() => setErro("Erro ao carregar professores"))
            .finally(() => setLoading(false))
    }, [])
    return (
        <ProtectedRoute allowedTypes={["aluno"]}>
            <Navbar />
            <div className="p-8 bg-gray-100 mt-10 min-h-screen">
                <Breadcrumb items={[{ label: "Painel do Aluno", href: "/painel/aluno" }, { label: "Professores" }]} />
                <h2 className="text-2xl font-bold mb-6 text-center">Professores</h2>
                {loading && <div className="text-center text-gray-500">Carregando professores...</div>}
                {erro && <div className="text-center text-red-500">{erro}</div>}
                {!loading && !erro && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {professores.map((prof) => (
                            <div key={prof.id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center cursor-pointer hover:bg-blue-50"
                                onClick={() => router.push(`/painel/aluno/professor/${prof.id}`)}
                            >
                                <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold mb-2">
                                    {prof.username[0].toUpperCase()}
                                </div>
                                <div className="font-bold text-lg mb-1">{prof.username}</div>
                                <div className="text-gray-600 text-sm mb-1">{prof.email}</div>
                            </div>
                        ))}
                        {professores.length === 0 && (
                            <div className="col-span-full text-center text-gray-500">Nenhum professor encontrado.</div>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    )
} 