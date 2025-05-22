import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#4b1c13" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="João - 4tunados" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        {/* Open Graph padrão */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Plataforma de Aulas para Músicos | 4tunados" />
        <meta property="og:image" content="https://a4tunados-test-frontend.vercel.app/og-image.png" />
        {/* Twitter Card padrão */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://a4tunados-test-frontend.vercel.app/og-image.png" />
        {/* JSON-LD global */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Plataforma de Aulas para Músicos",
              "url": "https://a4tunados-test-frontend.vercel.app/",
              "description": "Plataforma exclusiva para professores de música compartilharem aulas em vídeo de forma privada e organizada para seus alunos.",
              "publisher": {
                "@type": "Organization",
                "name": "4tunados"
              }
            }),
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
