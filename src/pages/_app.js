import { useEffect } from "react";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("SW registrado con scope:", registration.scope);
        })
        .catch((error) => {
          console.error("Error al registrar SW:", error);
        });
    }
  }, []);

  return <Component {...pageProps} />;
}
