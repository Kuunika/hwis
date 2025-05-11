import { useEffect, useState } from "react";

/**
 * Debounces a value by a given delay.
 * @param value The value to debounce
 * @param delay Time in ms to wait before updating
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}