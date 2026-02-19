# Monitor Económico Argentina

Dashboard interactivo de indicadores económicos argentinos con datos en tiempo real y evolución histórica. Permite visualizar inflación, tipo de cambio, actividad económica, canasta básica, transporte, alquileres, consumos cotidianos, servicios y programas de asistencia social.

**[Ver sitio en vivo](https://monitor-economico.vercel.app)**

## Tecnologías

- **[Next.js 15](https://nextjs.org/)** — Framework React con Pages Router y Turbopack
- **[Tailwind CSS](https://tailwindcss.com/)** — Estilos utilitarios
- **[Recharts](https://recharts.org/)** — Gráficos interactivos
- **[Framer Motion](https://www.framer.com/motion/)** — Animaciones
- **[Google Sheets API](https://developers.google.com/sheets/api)** — Fuente de datos principal
- **[DolarAPI](https://dolarapi.com/)** — Cotizaciones del dólar en tiempo real
- **[APIs datos.gob.ar](https://datos.gob.ar/)** — Datos oficiales de actividad económica

## Fuentes de datos

| Fuente                                             | Uso                                                                                 |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Google Sheets API                                  | Indicadores económicos generales (inflación, canasta, transporte, alquileres, etc.) |
| [DolarAPI](https://dolarapi.com/)                  | Cotizaciones del dólar en tiempo real                                               |
| [Argentina Datos API](https://argentinadatos.com/) | Cotizaciones históricas del dólar                                                   |
| [datos.gob.ar](https://datos.gob.ar/)              | EMAE y series de actividad económica                                                |

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
| **Transporte**          | Costos de transporte público (subte, tren, colectivo) y privado (nafta, peajes, patente)                                           |
| **Alquileres**          | Precios de alquiler por zona: CABA, Zona Norte, Zona Oeste-Sur                                                                     |
| **Consumos cotidianos** | Precios de productos de consumo diario (pan, leche, yerba, cerveza, etc.)                                                          |
| **Servicios**           | Precios de gimnasio, cine, libros, peluquería                                                                                      |
| **Asistencia social**   | Programas sociales: AUH, becas, seguro de desempleo                                                                                |
