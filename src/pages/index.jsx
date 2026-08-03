import React, { useEffect, useState } from "react";

import CanastaSalario from "@/components/CanastaSalario/CanastaSalario";
import Inflacion from "@/components/Inflacion/Inflacion";
import Loader from "@/components/Loader/Loader";
import Portada from "@/components/Portada/Portada";
import Dolar from "@/components/Dolar/Dolar";
import EMAE from "@/components/EMAE/EMAE";
import ConsumosCotidianos from "@/components/ConsumosCotidianos/ConsumosCotidianos";
import AsistenciaSocial from "@/components/AsistenciaSocial/AsistenciaSocial";
import BackToTopButton from "@/components/BackToTopButton/BackToTopButton";

// Placeholder que ocupa la sección completa mientras llegan los indicadores;
// permite mostrar el sitio entero de entrada en vez de bloquear todo detrás
// de una pantalla de carga.
const SectionLoader = ({ titulo }) => (
  <div className="w-full h-full bg-gray-900 center-flex-col gap-6">
    <h2 className="text-lg font-semibold text-gray-500">{titulo}</h2>
    <Loader />
  </div>
);

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const fetchData = async () => {
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
      setData(result.data);
      setError(null);
      setCountdown(null);
    } catch (error) {
      console.error("Error fetching indicadores:", error.message);
      setError("Error de respuesta");
      setCountdown(3);
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

  return (
    <div className="full-container">
      {/* Aviso no bloqueante si falla la carga de indicadores */}
      {error && (
        <div className="fixed top-0 inset-x-0 z-50 bg-[#FF5733] text-white text-center text-sm font-semibold py-2 px-4">
          No se pudieron cargar los indicadores.{" "}
          {countdown > 0
            ? `Reintentando en ${countdown} ${
                countdown === 1 ? "segundo" : "segundos"
              }...`
            : "Reintentando..."}
        </div>
      )}

      <section id="inicio">
        <Portada data={data} />
      </section>
      <section id="inflacion">
        {data ? (
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
        ) : (
          <SectionLoader titulo="INFLACIÓN" />
        )}
      </section>
      <section id="canasta">
        {data ? (
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
        ) : (
          <SectionLoader titulo="CANASTA Y SALARIO" />
        )}
      </section>
      <section id="dolar">
        {data ? (
          <Dolar months={data.meses} />
        ) : (
          <SectionLoader titulo="DÓLAR" />
        )}
      </section>
      <section id="emae">
        <EMAE />
      </section>
      <section id="consumos">
        {data ? (
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
        ) : (
          <SectionLoader titulo="CONSUMOS COTIDIANOS" />
        )}
      </section>
      <section id="asistencia">
        {data ? (
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
        ) : (
          <SectionLoader titulo="ASISTENCIA SOCIAL" />
        )}
      </section>

      {/* Botón flotante para volver al inicio */}
      <BackToTopButton />
    </div>
  );
}
