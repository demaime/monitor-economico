import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp, FaHome } from "react-icons/fa";
import Link from "next/link";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(true); // Siempre visible

  // Opcional: cambiar opacidad según scroll
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Usamos Link con #inicio en lugar de función JavaScript

  return (
    <AnimatePresence>
      {isVisible && (
        <Link href="#inicio">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: scrolled ? 0.9 : 0.6,
              scale: 1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{
              scale: 1.1,
              opacity: 1,
              backgroundColor: "rgba(255, 87, 51, 0.9)",
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-custom/30 cursor-pointer"
            style={{
              background: scrolled
                ? "rgba(255, 87, 51, 0.8)"
                : "rgba(255, 87, 51, 0.5)",
            }}
            aria-label="Volver al inicio"
          >
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <FaHome className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </Link>
      )}
    </AnimatePresence>
  );
}
