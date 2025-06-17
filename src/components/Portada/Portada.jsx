import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import {
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaDollarSign,
  FaShoppingCart,
  FaBus,
  FaHome,
  FaShoppingBag,
  FaBolt,
  FaHandsHelping,
} from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Portada({ data }) {
  const [variationType, setVariationType] = useState("mensual"); // "mensual" o "anual"
  const [dolarData, setDolarData] = useState(null);
  const [dolarHistorico, setDolarHistorico] = useState(null);
  const [dolarLoading, setDolarLoading] = useState(true);

  // Alternar entre variación mensual e interanual cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setVariationType((prev) => (prev === "mensual" ? "anual" : "mensual"));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Obtener datos del dólar actual y histórico
  useEffect(() => {
    const fetchDolarData = async () => {
      try {
        setDolarLoading(true);

        // Obtener datos actuales y históricos en paralelo
        const [currentResponse, historicResponse] = await Promise.all([
          fetch("/api/getDolar"),
          fetch("/api/getDolarHistorico"),
        ]);

        if (currentResponse.ok) {
          const dolarInfo = await currentResponse.json();
          setDolarData(dolarInfo);
        }

        if (historicResponse.ok) {
          const historicoInfo = await historicResponse.json();
          setDolarHistorico(historicoInfo);
        }
      } catch (error) {
        console.error("Error fetching dolar data:", error);
      } finally {
        setDolarLoading(false);
      }
    };

    fetchDolarData();
  }, []);

  // Configuración de categorías con sus datos correspondientes
  const categories = [
    {
      id: "inflacion",
      name: "Inflación",
      shortName: "Inflación",
      icon: FaChartLine,
      dataKey: "inflacionNacional",
      link: "#inflacion",
    },
    {
      id: "dolar",
      name: "Dólar Blue",
      shortName: "Dólar",
      icon: FaDollarSign,
      dataKey: "dolarBlue",
      link: "#dolar",
      isExternal: true,
    },
    {
      id: "canasta",
      name: "Canasta Básica",
      shortName: "Canasta",
      icon: FaShoppingCart,
      dataKey: "cbaFamiliarNacional",
      link: "#canasta",
    },
    {
      id: "transporte",
      name: "Transporte",
      shortName: "Transporte",
      icon: FaBus,
      dataKey: "subte",
      link: "#transporte",
    },
    {
      id: "alquileres",
      name: "Alquileres",
      shortName: "Alquileres",
      icon: FaHome,
      dataKey: "alquilerCaba",
      link: "#alquileres",
    },
    {
      id: "consumos",
      name: "Consumos",
      shortName: "Consumos",
      icon: FaShoppingBag,
      dataKey: "kiloPan",
      link: "#consumos",
    },
    {
      id: "servicios",
      name: "Servicios",
      shortName: "Servicios",
      icon: FaBolt,
      dataKey: "gimnasio",
      link: "#servicios",
    },
    {
      id: "asistencia",
      name: "Asistencia Social",
      shortName: "Asistencia",
      icon: FaHandsHelping,
      dataKey: "auh",
      link: "#asistencia",
    },
  ];

  // Función para obtener el último valor disponible
  const getLatestValue = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return null;
    // Encontrar el último valor no nulo/no vacío
    for (let i = dataArray.length - 1; i >= 0; i--) {
      if (
        dataArray[i] !== null &&
        dataArray[i] !== undefined &&
        dataArray[i] !== ""
      ) {
        return dataArray[i];
      }
    }
    return null;
  };

  // Función para obtener el índice del último valor
  const getLatestValueIndex = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return -1;
    for (let i = dataArray.length - 1; i >= 0; i--) {
      if (
        dataArray[i] !== null &&
        dataArray[i] !== undefined &&
        dataArray[i] !== ""
      ) {
        return i;
      }
    }
    return -1;
  };

  // Función para obtener el mes del último dato
  const getLatestMonth = (category) => {
    if (category.isExternal && category.id === "dolar") {
      const fecha = dolarData?.blue?.fecha;
      if (fecha) {
        const date = new Date(fecha);
        const mes = date
          .toLocaleDateString("es-AR", { month: "short" })
          .toUpperCase();
        const año = date.getFullYear();
        return `${mes}/${año}`;
      }
      return "TIEMPO REAL";
    }

    const categoryData = data?.[category.dataKey];
    const latestIndex = getLatestValueIndex(categoryData);

    if (latestIndex >= 0 && data?.meses && data.meses[latestIndex]) {
      const mesData = data.meses[latestIndex];
      return `${mesData.mes}/${mesData.año}`;
    }

    return "SIN FECHA";
  };

  // Función para calcular variación del dólar
  const getDolarVariation = (type) => {
    if (!dolarData?.blue?.venta || !dolarHistorico?.blue) return null;

    const currentValue = dolarData.blue.venta;
    const historicalData = dolarHistorico.blue;

    if (!Array.isArray(historicalData) || historicalData.length === 0)
      return null;

    let compareIndex;
    if (type === "mensual") {
      // Comparar con el mes anterior (índice 1, ya que 0 es el mes actual parcial)
      compareIndex = 1;
    } else {
      // Comparar con 12 meses atrás
      compareIndex = 12;
    }

    if (compareIndex >= historicalData.length) return null;

    const previousValue = historicalData[compareIndex].average;
    const variation = ((currentValue - previousValue) / previousValue) * 100;
    return Number(variation.toFixed(1));
  };

  // Función para calcular variación
  const getVariation = (dataArray, type) => {
    if (!dataArray || dataArray.length < 2) return null;

    const latestValue = getLatestValue(dataArray);
    if (!latestValue) return null;

    let compareIndex;
    if (type === "mensual") {
      // Variación intermensual: comparar con el mes anterior
      compareIndex = dataArray.length - 2;
    } else {
      // Variación interanual: comparar con 12 meses atrás
      compareIndex = dataArray.length - 13;
    }

    if (compareIndex < 0 || !dataArray[compareIndex]) return null;

    // Calcular variación manualmente
    const previousValue = dataArray[compareIndex];
    const variation = ((latestValue - previousValue) / previousValue) * 100;
    return Number(variation.toFixed(1));
  };

  // Función para formatear valores
  const formatValue = (value, category) => {
    if (!value) return "Sin datos";

    // Formateo específico por categoría
    switch (category.id) {
      case "inflacion":
        return `${value.toFixed(1)}%`;
      case "dolar":
        return `$${value.toFixed(0)}`;
      case "canasta":
      case "alquileres":
      case "consumos":
      case "servicios":
      case "asistencia":
        return `$${value.toLocaleString()}`;
      case "transporte":
        return `$${value.toFixed(0)}`;
      default:
        return value.toString();
    }
  };

  // Componente de loader para cards
  const CardLoader = ({ category }) => {
    const IconComponent = category.icon;

    return (
      <div
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg relative overflow-hidden"
        style={{ height: "208px", width: "100%" }}
      >
        <div className="h-full flex flex-col justify-between p-6 animate-pulse">
          {/* Header - altura fija */}
          <div className="flex items-center space-x-3 h-8">
            <IconComponent className="text-xl text-gray-600 flex-shrink-0" />
            <h3 className="font-semibold text-base text-gray-400 truncate">
              {category.shortName}
            </h3>
          </div>

          {/* Variación - área principal */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gray-700 rounded h-10 w-24 mx-auto mb-2"></div>
              <div className="bg-gray-700 rounded h-3 w-16 mx-auto"></div>
            </div>
          </div>

          {/* Valor y fecha - altura fija */}
          <div className="text-center h-12">
            <div className="bg-gray-700 rounded h-5 w-20 mx-auto mb-1"></div>
            <div className="bg-gray-700 rounded h-3 w-16 mx-auto"></div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-10 transform -skew-x-12 animate-pulse"></div>
      </div>
    );
  };

  const IndicatorCard = ({ category }) => {
    let categoryData, latestValue, variation;
    const IconComponent = category.icon;

    if (category.isExternal && category.id === "dolar") {
      // Manejo especial para datos del dólar
      if (dolarLoading) {
        return <CardLoader category={category} />;
      }
      latestValue = dolarData?.blue?.venta || null;
      variation = getDolarVariation(variationType);
    } else {
      // Datos normales del Google Sheets
      categoryData = data?.[category.dataKey];
      latestValue = getLatestValue(categoryData);
      variation = getVariation(categoryData, variationType);
    }

    const latestMonth = getLatestMonth(category);

    return (
      <Link href={category.link}>
        <motion.div
          className="bg-gray-800 border border-gray-700 hover:border-orange-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden text-white"
          style={{ height: "208px", width: "100%" }}
          whileHover={{
            scale: 1.02,
            y: -4,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Efecto de brillo en hover */}
          <motion.div
            className="absolute inset-0 bg-orange-500 opacity-0 hover:opacity-5 transition-opacity duration-300"
            whileHover={{ opacity: 0.05 }}
          />

          {/* Layout con flex para control total */}
          <div className="h-full flex flex-col justify-between p-6">
            {/* Header - altura fija */}
            <div className="flex items-center space-x-3 h-8">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <IconComponent className="text-xl text-gray-400 flex-shrink-0" />
              </motion.div>
              <h3 className="font-semibold text-base text-gray-200 truncate">
                {category.shortName}
              </h3>
            </div>

            {/* Variación - área principal */}
            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {variation !== null ? (
                  <motion.div
                    key={`${category.id}-${variationType}-${variation}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    {/* Variación principal */}
                    <div
                      className={`flex items-center justify-center space-x-2 text-3xl font-bold mb-1 ${
                        variation >= 0 ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {variation >= 0 ? (
                        <FaArrowUp className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <FaArrowDown className="w-5 h-5 flex-shrink-0" />
                      )}
                      <span>{Math.abs(variation).toFixed(1)}%</span>
                    </div>
                    {/* Tipo de variación */}
                    <div className="text-xs text-gray-400">
                      {variationType === "mensual"
                        ? "Intermensual"
                        : "Interanual"}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-2xl font-bold text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Sin variación
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Valor y fecha - altura fija */}
            <div className="text-center h-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${category.id}-value-${latestValue}`}
                  className="text-base font-medium text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {formatValue(latestValue, category)}
                </motion.div>
              </AnimatePresence>
              <div className="text-xs text-gray-500 mt-1 truncate">
                {latestValue && latestMonth}
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  if (!data) {
    return (
      <section className="bg-gray-900 min-h-screen">
        <Fade className="w-full h-20">
          <div className="w-full h-full text-orange-custom font-semibold center-flex-col text-lg border-b-2 border-white">
            MONITOR INDICADORES ECONOMICOS
          </div>
        </Fade>
        <div className="center-flex-col text-white p-8">
          <motion.div
            className="text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Cargando indicadores...
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-900 min-h-screen">
      <Fade className="w-full h-20">
        <div className="w-full h-full text-orange-custom font-semibold center-flex-col text-lg border-b-2 border-white">
          MONITOR INDICADORES ECONOMICOS
        </div>
      </Fade>

      <div className="p-8">
        {/* Título y descripción */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Tablero de Indicadores Económicos
          </h1>
          <p className="text-gray-400 text-lg">
            Monitoreo en tiempo real de los principales indicadores económicos
            argentinos
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={variationType}
              className="mt-2 text-sm text-gray-500"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              Mostrando variación{" "}
              {variationType === "mensual" ? "intermensual" : "interanual"}
              <motion.span
                className="ml-2 text-orange-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ●
              </motion.span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Grid de cards */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <IndicatorCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Nota sobre actualización */}
        <motion.div
          className="text-center mt-12 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p>Datos actualizados desde Google Sheets</p>
          <p>Última sincronización: {new Date().toLocaleString()}</p>
        </motion.div>
      </div>
    </section>
  );
}
