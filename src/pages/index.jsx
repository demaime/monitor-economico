import React, { useEffect, useState } from "react";
import AsistenciaSocial from "@/components/AsistenciaSocial/AsistenciaSocial";
import CanastaSalario from "@/components/CanastaSalario/CanastaSalario";
import Inflacion from "@/components/Inflacion/Inflacion";
import Loader from "@/components/Loader/Loader";
import { Fade, Zoom, JackInTheBox, Roll } from "react-awesome-reveal";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();

      try {
        const response = await fetch("/api/sheets");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        // Calcular tiempo transcurrido y esperar si es necesario
        const elapsedTime = Date.now() - startTime;
        const minimumWait = 3000; // 2 segundos en milisegundos

        if (elapsedTime < minimumWait) {
          await new Promise((resolve) =>
            setTimeout(resolve, minimumWait - elapsedTime)
          );
        }

        setData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <section className="center-flex-col bg-gradient">
        <Fade>
          <h1 className="text-5xl text-[#FF5733] w-full mb-12 font-semibold">
            <span className="text-white font-black">M</span>ONITOR <br />
            <span className="text-white font-black">I</span>NDICADORES <br />
            <span className="text-white font-black">E</span>CONOMICOS
          </h1>
        </Fade>

        <Zoom>
          <Fade>
            <h1 className="text-lg font-semibold mb-8 text-gray-500">
              CARGANDO...
            </h1>
          </Fade>
        </Zoom>
        <Zoom>
          <Fade>
            <Loader />
          </Fade>
        </Zoom>
      </section>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="full-container">
      {data.meses && (
        <>
          <Inflacion data={data.inflacion} months={data.meses} />
          <CanastaSalario data={data.cba} months={data.meses} />
          <AsistenciaSocial data={data} />
        </>
      )}
    </div>
  );
}
