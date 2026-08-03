# Monitor Económico Argentina

Dashboard interactivo de indicadores económicos argentinos con datos en tiempo real y evolución histórica. Permite visualizar inflación, tipo de cambio, actividad económica, canasta básica, transporte, alquileres, consumos cotidianos, servicios y programas de asistencia social.

**[Ver sitio en vivo](https://monitor-economico.vercel.app)**

## Tecnologías

- **[Next.js 15](https://nextjs.org/)** — Framework React con Pages Router y Turbopack
- **[Tailwind CSS](https://tailwindcss.com/)** — Estilos utilitarios
- **[Recharts](https://recharts.org/)** — Gráficos interactivos
- **[Framer Motion](https://www.framer.com/motion/)** — Animaciones
- **[API Series de Tiempo datos.gob.ar](https://www.argentina.gob.ar/datos-abiertos/api-series-de-tiempo)** — Fuente de datos principal (INDEC, IDECBA, ANSES, Min. Trabajo)
- **[DolarAPI](https://dolarapi.com/)** — Cotizaciones del dólar en tiempo real

## Fuentes de datos

Los datos se actualizan solos: no hay carga manual.

| Fuente                                             | Uso                                                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [datos.gob.ar](https://datos.gob.ar/) (Series de Tiempo) | IPC nacional y por rubro, IPCBA (CABA), canasta básica, SMVM, jubilación mínima, AUH, EMAE |
| [INDEC](https://www.indec.gob.ar/) (XLS precios promedio) | Consumos cotidianos (pan, leche, yerba, carne, etc.), vía GitHub Action mensual           |
| [DolarAPI](https://dolarapi.com/)                  | Cotizaciones del dólar en tiempo real                                                            |
| [Argentina Datos API](https://argentinadatos.com/) | Cotizaciones históricas del dólar                                                                |

### Actualización automática

- `/api/indicadores` consulta las series oficiales en cada request, con caché CDN de 12 h (los datos son mensuales).
- `.github/workflows/actualizar-datos.yml` corre el día 18 de cada mes: descarga el XLS de precios promedio del INDEC, regenera `src/data/auto/consumos.json` y commitea (lo que dispara el redeploy en Vercel).
- Para forzar una actualización manual: `npm run actualizar-datos`.

## Características

- Tema oscuro con diseño responsivo mobile-first
- PWA instalable con soporte offline via Service Worker
- Scroll snap entre secciones a pantalla completa
- Actualización automática de cotizaciones cada 5 minutos
- Gráficos interactivos con tooltips
- Animaciones de entrada al hacer scroll
- Manejo de errores y reintentos para APIs con rate limiting

## Secciones

| Sección                 | Descripción                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Inflación**           | Variación mensual, anual y acumulada a nivel nacional y CABA, con desglose por categoría (alimentos, indumentaria, vivienda, etc.) |
| **Dólar**               | Cotizaciones en vivo (Oficial, Blue, MEP, CCL, Tarjeta, Mayorista) con actualización cada 5 minutos y evolución histórica          |
| **EMAE**                | Estimador Mensual de Actividad Económica con 16+ sectores y evolución de los últimos 24 meses                                      |
| **Canasta y Salario**   | Canasta básica alimentaria y total (individual/familiar), salario mínimo y jubilaciones                                            |
| **Consumos cotidianos** | Precios promedio INDEC de productos de consumo diario (pan, leche, yerba, cerveza, carne, gaseosa, fideos)                         |
| **Asistencia social**   | AUH, topes de ingreso y seguro de desempleo                                                                                        |
