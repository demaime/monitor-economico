import React, { useEffect, useState } from "react";
import AsistenciaSocial from "@/components/AsistenciaSocial/AsistenciaSocial";
import CanastaSalario from "@/components/CanastaSalario/CanastaSalario";
import Inflacion from "@/components/Inflacion/Inflacion";
import Loader from "@/components/Loader/Loader";
import { Fade, Zoom } from "react-awesome-reveal";
import Portada from "@/components/Portada/Portada";

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
        const minimumWait = 2000; // 2 segundos en milisegundos

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
  if (error)
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
            <h1 className="text-lg font-semibold mb-8 text-[#FF5733] text-center px-2">
              No se pudo conectar. Por favor intente de nuevo
            </h1>
          </Fade>
        </Zoom>

        <Zoom>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#FF5733] text-white rounded-md hover:bg-[#E64A2E] transition-colors"
          >
            Recargar página
          </button>
        </Zoom>
      </section>
    );

  return (
    <div className="full-container">
      {data.meses && (
        <>
          <Portada />
          <Inflacion
            data={{
              nacional: {
                general: data.inflacionNacional,
                apertura: {
                  alimentos: data.alimentosNacional,
                  bebidas: data.bebidasNacional,
                  indumentaria: data.indumentariaNacional,
                  vivienda: data.viviendaNacional,
                  equipamiento: data.equipamientoNacional,
                  salud: data.saludNacional,
                  transporte: data.transporteNacional,
                  comunicacion: data.comunicacionNacional,
                  recreacion: data.recreacionNacional,
                  educacion: data.educacionNacional,
                  restaurantes: data.restaurantesNacional,
                  bienesServicios: data.bienesServiciosNacional,
                },
              },
              caba: {
                general: data.inflacionCaba,
                apertura: {
                  alimentos: data.alimentosCaba,
                  bebidas: data.bebidasCaba,
                  indumentaria: data.indumentariaCaba,
                  vivienda: data.viviendaCaba,
                  equipamiento: data.equipamientoCaba,
                  salud: data.saludCaba,
                  transporte: data.transporteCaba,
                  comunicacion: data.comunicacionCaba,
                  recreacion: data.recreacionCaba,
                  educacion: data.educacionCaba,
                  restaurantes: data.restaurantesCaba,
                  seguros: data.segurosCaba,
                  cuidadoPersonal: data.cuidadoPersonalCaba,
                },
              },
            }}
            months={data.meses}
          />
          <CanastaSalario
            data={{
              nacional: {
                individual: {
                  basica: data.cbaIndividualNacional,
                  total: data.cbtIndividualNacional,
                },
                familiar: {
                  basica: data.cbaFamiliarNacional,
                  total: data.cbtFamiliarNacional,
                },
              },
              caba: {
                individual: {
                  basica: data.cbaIndividualCaba,
                  total: data.cbtIndividualCaba,
                },
                familiar: {
                  basica: data.cbaFamiliarCaba,
                  total: data.cbtFamiliarCaba,
                },
              },
              smv: data.smv,
              jubilaciones: {
                conBono: data.jubConBono,
                sinBono: data.jubSinBono,
              },
            }}
            months={data.meses}
          />
          <AsistenciaSocial data={data} />
        </>
      )}
    </div>
  );
}
