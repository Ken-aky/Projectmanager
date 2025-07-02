import { useState, useEffect } from "react"; 

export function useSessionState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = sessionStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}