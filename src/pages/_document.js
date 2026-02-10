import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <title>Monitor Indicadores Económicos</title>
        <meta
          name="description"
          content="Monitor en tiempo real de indicadores económicos argentinos: inflación, dólar, EMAE, canasta básica y más."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="Monitor Económico"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Monitor Indicadores Económicos" />
        <meta
          property="og:description"
          content="📊 Seguí en tiempo real la inflación, dólar blue, EMAE, canasta básica y todos los indicadores económicos de Argentina"
        />
        <meta property="og:image" content="/logo.png" />
        <meta
          property="og:url"
          content="https://monitor-economico.vercel.app"
        />
        <meta
          property="og:site_name"
          content="Monitor Indicadores Económicos"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Monitor Indicadores Económicos" />
        <meta
          name="twitter:description"
          content="📊 Seguí en tiempo real la inflación, dólar blue, EMAE, canasta básica y todos los indicadores económicos de Argentina"
        />
        <meta name="twitter:image" content="/logo.png" />

        {/* WhatsApp optimizado */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Monitor Indicadores Económicos - Dashboard"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Oswald:wght@200..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
