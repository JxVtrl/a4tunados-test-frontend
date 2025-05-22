import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 md:py-8 flex flex-col items-center bg-white shadow-sm">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight text-center">
          Plataforma de Aulas para Músicos
        </h1>
        <p className="text-base md:text-lg text-gray-600 font-medium text-center px-2">
          Compartilhe, organize e gerencie suas aulas em vídeo de forma privada e profissional.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 md:px-4">
        <section className="max-w-full md:max-w-2xl w-full mt-8 md:mt-12 mb-6 md:mb-8 bg-white rounded-xl shadow-lg p-4 md:p-8 border border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">🎵 Para Professores de Música</h2>
          <ul className="list-disc pl-5 md:pl-6 text-gray-700 mb-4 md:mb-6 space-y-1">
            <li>Cadastre suas aulas em vídeo de forma privada e segura.</li>
            <li>Gerencie o conteúdo que seus alunos têm acesso.</li>
            <li>Mantenha tudo organizado em playlists e vídeos.</li>
            <li>Controle total: só seus alunos veem seus vídeos.</li>
          </ul>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 mt-6 md:mt-8">👨‍🎓 Para Alunos</h2>
          <ul className="list-disc pl-5 md:pl-6 text-gray-700 mb-4 md:mb-6 space-y-1">
            <li>Acesse facilmente as aulas postadas pelo seu professor.</li>
            <li>Ambiente exclusivo, sem distrações ou anúncios.</li>
            <li>Visualização simples e organizada dos conteúdos.</li>
          </ul>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:mt-8 justify-center">
            <Link href="/login" className="px-4 md:px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold shadow hover:bg-gray-800 transition text-center w-full md:w-auto">
              Entrar na Plataforma
            </Link>
            <Link href="/register" className="px-4 md:px-6 py-3 bg-white border border-gray-900 text-gray-900 rounded-lg font-semibold shadow hover:bg-gray-100 transition text-center w-full md:w-auto">
              Criar Conta
            </Link>
          </div>
        </section>
        <section className="max-w-full md:max-w-2xl w-full text-center text-gray-500 text-xs md:text-sm mt-6 md:mt-8 px-2">
          <p>
            Projeto MVP para professores e alunos de música. <br />
            Desenvolvido para o desafio: <span className="font-semibold">Plataforma de Aulas para Músicos</span>.
          </p>
          <p className="mt-2">
            Prazo de entrega: <span className="font-bold text-gray-700">22/05 às 18h</span>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 md:py-4 text-center text-gray-400 text-xs border-t border-gray-200 mt-6 md:mt-8">
        &copy; {new Date().getFullYear()} Plataforma de Aulas para Músicos. Todos os direitos reservados.
      </footer>
    </div>
  )
}