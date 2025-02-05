import { useMemo } from "react";

export const usePercentageVariation = (currentValue, previousValue) => {
  const percentageVariation = useMemo(() => {
    // Si alguno de los valores es null, undefined o 0, retornamos null
    if (!currentValue || !previousValue) return null;

    // Fórmula: ((valor_actual - valor_anterior) / valor_anterior) * 100
    const variation = ((currentValue - previousValue) / previousValue) * 100;

    // Redondeamos a 1 decimal
    return Number(variation.toFixed(1));
  }, [currentValue, previousValue]);

  return percentageVariation;
};
