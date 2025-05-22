import ProtectedRoute from "../../components/ProtectedRoute"
import Navbar from "../../components/Navbar"
import Link from "next/link"

export default function PainelProfessor() {
  return (
    <ProtectedRoute allowedTypes={["professor"]}>
      <Navbar />
      <div className="p-8 pb-[25vh] flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">O que você deseja ver?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          <Link
            href="/painel/professor/todos"
            className="bg-white text-gray-900 border border-gray-300 rounded-xl shadow-md p-8 text-xl font-semibold hover:bg-gray-900 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 font-sans flex items-center justify-center"
          >
            Todos seus vídeos
          </Link>
          <Link
            href="/painel/professor/playlists"
            className="bg-white text-gray-900 border border-gray-300 rounded-xl shadow-md p-8 text-xl font-semibold hover:bg-gray-900 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 font-sans flex items-center justify-center"
          >
            Todas suas playlists
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  )
}
