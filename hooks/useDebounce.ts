import { useState, useEffect } from "react";

/**
 * Custom hook that delays updating the state until after the specified delay period has passed
 * since the last time the value was changed.
 *
 * @param value The value to be debounced
 * @param delay The delay in milliseconds (defaults to 350ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
