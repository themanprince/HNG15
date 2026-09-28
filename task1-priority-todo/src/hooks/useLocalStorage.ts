import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "../lib/storage";

/** State that is loaded from and persisted to localStorage under `key`. */
export function useLocalStorage<T>(key: string, parse: (raw: unknown) => T) {
  const [value, setValue] = useState<T>(() => parse(readJSON(key)));

  useEffect(() => {
    writeJSON(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
