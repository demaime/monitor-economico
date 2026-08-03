import React, { useEffect, useState } from "react";

import CanastaSalario from "@/components/CanastaSalario/CanastaSalario";
import Inflacion from "@/components/Inflacion/Inflacion";
import Loader from "@/components/Loader/Loader";
import { Fade, Zoom } from "react-awesome-reveal";
import Portada from "@/components/Portada/Portada";
import Dolar from "@/components/Dolar/Dolar";
import EMAE from "@/components/EMAE/EMAE";
import ConsumosCotidianos from "@/components/ConsumosCotidianos/ConsumosCotidianos";
import AsistenciaSocial from "@/components/AsistenciaSocial/AsistenciaSocial";
import BackToTopButton from "@/components/BackToTopButton/BackToTopButton";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const fetchData = async () => {
    const startTime = Date.now();
    setLoading(true);

    try {
      const response = await fetch("/api/indicadores");
      if (!response.ok) {
        // Si es error de quota, esperar más tiempo
        if (response.status === 429) {
          const data = await response.json();
          const retryAfter = data.retryAfter || 60;
          setCountdown(retryAfter);
          throw new Error(
            `Límite de solicitudes excedido. Reintentando en ${retryAfter} segundos...`
          );
        }
        throw new Error(
          `Error de conexión (${response.status}). Por favor, intente más tarde.`
        );
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
      setError(null);
      setCountdown(null);
    } catch (error) {
      console.error("Error fetching sheets:", error.message);
      setError("Error de respuesta");
      setCountdown(3);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      fetchData();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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
            <h1 className="text-lg font-semibold mb-8 text-[#FF5733] text-center px-8">
              No se pudo conectar.{" "}
              {countdown > 0
                ? `Reintentando en ${countdown} ${
                    countdown === 1 ? "segundo" : "segundos"
                  }...`
                : "Reintentando..."}
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

  return (
    <div className="full-container">
      {data.meses && (
        <>
          <section id="inicio">
            <Portada data={data} />
          </section>
          <section id="inflacion">
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
          </section>
          <section id="canasta">
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
                smv: data.smv,
                jubilaciones: {
                  conBono: data.jubConBono,
                  sinBono: data.jubSinBono,
                },
              }}
              months={data.meses}
            />
          </section>
          <section id="dolar">
            <Dolar months={data.meses} />
          </section>
          <section id="emae">
            <EMAE />
          </section>
          <section id="consumos">
            <ConsumosCotidianos
              data={{
                consumos: {
                  kiloPan: data.kiloPan,
                  litroLeche: data.litroLeche,
                  kiloYerba: data.kiloYerba,
                  litroCerveza: data.litroCerveza,
                  kiloCarne: data.kiloCarne,
                  cocaCola: data.cocaCola,
                  fideos: data.fideos,
                },
              }}
              months={data.meses}
            />
          </section>
          <section id="asistencia">
            <AsistenciaSocial
              data={{
                auh: data.auh,
                auhTopeIndividual: data.auhTopeIndividual,
                auhTopeGrupoFamiliar: data.auhTopeGrupoFamiliar,
                seguroDesempleoMin: data.seguroDesempleoMin,
                seguroDesempleoMax: data.seguroDesempleoMax,
              }}
              months={data.meses}
            />
          </section>
        </>
      )}

      {/* Botón flotante para volver al inicio */}
      <BackToTopButton />
    </div>
  );
}
