import { useState, useEffect } from 'react';

/**
 * Hook personnalisé useDebounce
 * Temporise une valeur de saisie pour limiter la fréquence des appels API (ex: recherche).
 *
 * @param {any} value - La valeur à temporiser
 * @param {number} delay - Le délai en millisecondes (défaut: 300ms)
 * @returns {any} La valeur temporisée
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
