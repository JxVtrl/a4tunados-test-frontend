import ProtectedRoute from "../../components/ProtectedRoute"
import Navbar from "../../components/Navbar"
import Link from "next/link"

export default function PainelAluno() {
  return (
    <ProtectedRoute allowedTypes={["aluno"]}>
      <Navbar />
      <div className="p-8 pb-[25vh] flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">O que você deseja ver?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
          <Link
            href="/painel/aluno/todos"
            className="bg-white text-gray-900 border border-gray-300 rounded-xl shadow-md p-8 text-xl font-semibold hover:bg-gray-900 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 font-sans flex items-center justify-center"
          >
            Todos os Vídeos
          </Link>
          <Link
            href="/painel/aluno/playlists"
            className="bg-white text-gray-900 border border-gray-300 rounded-xl shadow-md p-8 text-xl font-semibold hover:bg-gray-900 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 font-sans flex items-center justify-center"
          >
            Playlists
          </Link>
          <Link
            href="/painel/aluno/professores"
            className="bg-white text-gray-900 border border-gray-300 rounded-xl shadow-md p-8 text-xl font-semibold hover:bg-gray-900 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 font-sans flex items-center justify-center"
          >
            Professores
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  )
}
