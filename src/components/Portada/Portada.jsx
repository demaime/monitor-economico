import React, { useState, useEffect, useMemo } from "react";
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
  FaEllipsisH,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import { Activity } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Portada({ data }) {
  const [variationType, setVariationType] = useState("mensual"); // "mensual" o "anual"
  const [dolarData, setDolarData] = useState(null);
  const [dolarHistorico, setDolarHistorico] = useState(null);
  const [dolarLoading, setDolarLoading] = useState(true);
  const [emaeData, setEmaeData] = useState(null);
  const [emaeLoading, setEmaeLoading] = useState(true);

  // Hook para detectar mobile - debe estar al inicio
  const [isMobile, setIsMobile] = useState(false);

  // Estado para rotación de cards en mobile
  const [currentMobileSet, setCurrentMobileSet] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Alternar entre variación mensual e interanual cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setVariationType((prev) => (prev === "mensual" ? "anual" : "mensual"));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Rotación automática de cards en mobile cada 4 segundos
  useEffect(() => {
    if (isMobile && !showAllCategories) {
      // Solo rotar si el modal NO está abierto
      const mobileSets = getMobileSets();
      const interval = setInterval(() => {
        setCurrentMobileSet((prev) => (prev + 1) % mobileSets.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isMobile, showAllCategories]); // Agregar showAllCategories como dependencia

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

  // Obtener datos del EMAE
  useEffect(() => {
    const fetchEmaeData = async () => {
      try {
        setEmaeLoading(true);
        const response = await fetch(
          "https://apis.datos.gob.ar/series/api/series/?ids=143.3_NO_PR_2004_A_21&limit=24&format=json"
        );

        if (response.ok) {
          const result = await response.json();
          setEmaeData(result.data);
        }
      } catch (error) {
        console.error("Error fetching EMAE data:", error);
      } finally {
        setEmaeLoading(false);
      }
    };

    fetchEmaeData();
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
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
      id: "emae",
      name: "EMAE",
      shortName: "EMAE",
      icon: Activity,
      dataKey: "emae",
      link: "#emae",
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

  // Dividir categorías en grupos de 4 para mobile
  const getMobileSets = () => {
    const sets = [];
    for (let i = 0; i < categories.length; i += 4) {
      sets.push(categories.slice(i, i + 4));
    }
    return sets;
  };

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

    if (category.isExternal && category.id === "emae") {
      if (emaeData && emaeData.length > 0) {
        const latestData = emaeData[emaeData.length - 1];
        const fecha = new Date(latestData[0]);
        const mes = fecha
          .toLocaleDateString("es-AR", { month: "short" })
          .toUpperCase();
        const año = fecha.getFullYear();
        return `${mes}/${año}`;
      }
      return "SIN FECHA";
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

  // Función para calcular variación del EMAE
  const getEmaeVariation = (type) => {
    if (!emaeData || emaeData.length < 2) return null;

    const latestValue = Number(emaeData[emaeData.length - 1][1]);
    let compareIndex;

    if (type === "mensual") {
      // Comparar con el mes anterior
      compareIndex = emaeData.length - 2;
    } else {
      // Comparar con 12 meses atrás
      compareIndex = emaeData.length - 13;
    }

    if (compareIndex < 0 || !emaeData[compareIndex]) return null;

    const previousValue = Number(emaeData[compareIndex][1]);
    const variation = ((latestValue - previousValue) / previousValue) * 100;
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
      case "emae":
        return `${value.toFixed(1)}`;
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

  // Componente modal para mostrar todas las categorías - Memoizado para evitar re-renders
  const AllCategoriesModal = useMemo(() => {
    if (!showAllCategories) return null;

    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAllCategories(false)}
        >
          <motion.div
            className="bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">
                Todos los indicadores
              </h3>
              <button
                onClick={() => setShowAllCategories(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de categorías */}
            <div className="p-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link key={category.id} href={category.link}>
                    <motion.div
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
                      whileHover={{ x: 4 }}
                      onClick={() => setShowAllCategories(false)}
                    >
                      <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-orange-custom transition-colors" />
                      <span className="flex-1 text-white font-medium">
                        {category.name}
                      </span>
                      <FaChevronRight className="w-4 h-4 text-gray-500 group-hover:text-orange-custom transition-colors" />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }, [showAllCategories]); // Solo re-renderizar cuando cambie showAllCategories

  // Componente de loader para cards
  const CardLoader = ({ category }) => {
    const IconComponent = category.icon;

    return (
      <div
        className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg relative overflow-hidden"
        style={{
          height: isMobile ? "140px" : "160px",
          width: isMobile ? "140px" : "260px",
          maxWidth: "100%",
        }}
      >
        <div className="h-full flex flex-col justify-between p-2 sm:p-3 lg:p-4 animate-pulse">
          {/* Header - altura fija */}
          <div className="flex items-center space-x-2 sm:space-x-3 h-6 sm:h-8">
            <IconComponent className="text-base sm:text-lg lg:text-xl text-gray-600 flex-shrink-0" />
            <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-400 truncate">
              {category.shortName}
            </h3>
          </div>

          {/* Variación - área principal */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gray-700 rounded h-6 sm:h-8 lg:h-10 w-16 sm:w-20 lg:w-24 mx-auto mb-2"></div>
              <div className="bg-gray-700 rounded h-2 sm:h-3 w-10 sm:w-12 lg:w-16 mx-auto"></div>
            </div>
          </div>

          {/* Valor y fecha - altura fija */}
          <div className="text-center h-8 sm:h-10 lg:h-12">
            <div className="bg-gray-700 rounded h-3 sm:h-4 lg:h-5 w-12 sm:w-16 lg:w-20 mx-auto mb-1"></div>
            <div className="bg-gray-700 rounded h-2 sm:h-3 w-8 sm:w-12 lg:w-16 mx-auto"></div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/10 to-transparent transform -skew-x-12 animate-pulse"></div>
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
    } else if (category.isExternal && category.id === "emae") {
      // Manejo especial para datos del EMAE
      if (emaeLoading) {
        return <CardLoader category={category} />;
      }
      latestValue =
        emaeData && emaeData.length > 0
          ? Number(emaeData[emaeData.length - 1][1])
          : null;
      variation = getEmaeVariation(variationType);
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
          className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:border-orange-custom rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden text-white group"
          style={{
            height: isMobile ? "140px" : "160px",
            width: isMobile ? "140px" : "260px",
            maxWidth: "100%",
          }}
          whileHover={{
            scale: 1.02,
            y: -4,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Efecto de brillo en hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-orange-custom/10 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ opacity: 1 }}
          />

          {/* Layout con flex para control total */}
          <div className="h-full flex flex-col justify-between p-2 sm:p-3 lg:p-4 relative z-10">
            {/* Header - altura fija */}
            <div className="flex items-center space-x-2 sm:space-x-3 h-6 sm:h-8">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <IconComponent className="text-base sm:text-lg lg:text-xl text-gray-400 group-hover:text-orange-custom transition-colors duration-300 flex-shrink-0" />
              </motion.div>
              <h3
                className={`font-semibold text-gray-200 truncate ${
                  isMobile ? "text-xs" : "text-xs sm:text-sm lg:text-base"
                }`}
              >
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
                      className={`flex items-center justify-center space-x-1 font-bold mb-1 ${
                        isMobile
                          ? "text-sm"
                          : "text-base sm:text-lg lg:text-xl xl:text-2xl"
                      } ${variation >= 0 ? "text-red-400" : "text-green-400"}`}
                    >
                      {variation >= 0 ? (
                        <FaArrowUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                      ) : (
                        <FaArrowDown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                      )}
                      <span>{Math.abs(variation).toFixed(1)}%</span>
                    </div>
                    {/* Tipo de variación */}
                    <div
                      className={`text-gray-400 ${
                        isMobile ? "text-xs" : "text-xs"
                      }`}
                    >
                      {variationType === "mensual"
                        ? isMobile
                          ? "Intermens."
                          : "Intermensual"
                        : isMobile
                        ? "Interanual"
                        : "Interanual"}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-500"
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
            <div className="text-center h-8 sm:h-10 lg:h-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${category.id}-value-${latestValue}`}
                  className="text-xs sm:text-sm lg:text-base font-medium text-gray-300"
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
      <section className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-custom rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-custom rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <Fade className="w-full">
          <div className="w-full text-orange-custom font-bold text-center text-lg sm:text-xl lg:text-2xl py-4 sm:py-6">
            Monitor Indicadores Económicos
          </div>
        </Fade>
        <div className="flex flex-col items-center justify-center text-white p-6 sm:p-8 min-h-96">
          <motion.div
            className="text-base sm:text-lg"
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
    <section className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-custom rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-custom rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header simplificado */}
      <Fade className="w-full relative z-10">
        <div className="w-full text-orange-custom font-bold text-center text-lg sm:text-xl lg:text-2xl py-2 sm:py-3">
          Monitor Indicadores Económicos
        </div>
      </Fade>

      {/* Contenido principal */}
      <div className="relative z-10 p-2 sm:p-3 lg:p-4 max-w-[1400px] mx-auto">
        {/* Título compacto con indicador de variación */}
        <motion.div
          className="text-center mb-3 sm:mb-4 lg:mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={variationType}
              className="text-sm sm:text-base lg:text-lg text-gray-300 font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              Variación{" "}
              {variationType === "mensual" ? "Intermensual" : "Interanual"}
              <motion.span
                className="ml-2 text-orange-custom"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ●
              </motion.span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Grid de cards responsive - optimizado para mobile */}
        <div className="w-full">
          {/* Grid principal */}
          <motion.div
            className={`grid gap-3 sm:gap-4 lg:gap-5 justify-items-center place-content-center ${
              isMobile
                ? "grid-cols-2 max-w-lg mx-auto"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isMobile ? (
              // Vista mobile con rotación
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMobileSet}
                  className="contents"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {(getMobileSets()[currentMobileSet] || []).map(
                    (category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                      >
                        <IndicatorCard category={category} />
                      </motion.div>
                    )
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              // Vista desktop sin rotación
              categories.map((category, index) => (
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
              ))
            )}
          </motion.div>

          {/* Indicadores de rotación y botón "Ver todos" solo en mobile */}
          {isMobile && (
            <motion.div
              className="mt-4 flex flex-col items-center space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {/* Indicadores de sets (dots) */}
              <div className="flex items-center space-x-2">
                {getMobileSets().map((_, index) => (
                  <motion.button
                    key={index}
                    className={`relative w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentMobileSet
                        ? "bg-orange-custom scale-125"
                        : "bg-gray-600 hover:bg-gray-500"
                    }`}
                    onClick={() => setCurrentMobileSet(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Indicador de progreso para el dot activo */}
                    {index === currentMobileSet && !showAllCategories && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-orange-custom/30"
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.8, 1] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Botón Ver todos */}
              <motion.button
                className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:border-orange-custom rounded-xl px-6 py-3 text-white font-medium text-sm flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAllCategories(true)}
              >
                <FaEllipsisH className="w-4 h-4" />
                <span>Ver todos los indicadores</span>
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Nota compacta sobre actualización */}
        <motion.div
          className="text-center mt-3 sm:mt-4 lg:mt-5 text-gray-500 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p>Última sincronización: {new Date().toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Modal de todas las categorías */}
      {AllCategoriesModal}
    </section>
  );
}
