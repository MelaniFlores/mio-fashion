import { useEffect, useReducer, useState } from "react";

// Lee un valor de localStorage. Si no existe (o está dañado) usa el valor inicial.
function leer(clave, inicial, normalizar) {
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado !== null) {
      const valor = JSON.parse(guardado);
      if (valor !== null) return normalizar ? normalizar(valor) : valor;
    }
  } catch (e) {
    console.warn(`No se pudo leer "${clave}" de localStorage`, e);
  }
  return typeof inicial === "function" ? inicial() : inicial;
}

function escribir(clave, valor) {
  try {
    if (valor === null || valor === undefined) localStorage.removeItem(clave);
    else localStorage.setItem(clave, JSON.stringify(valor));
  } catch (e) {
    // Puede fallar si el almacenamiento está lleno (por ejemplo, demasiadas imágenes locales)
    console.warn(`No se pudo guardar "${clave}" en localStorage`, e);
  }
}

// Como useState, pero el valor se conserva en localStorage
export function useLocalStorage(clave, inicial, normalizar) {
  const [valor, setValor] = useState(() => leer(clave, inicial, normalizar));
  useEffect(() => {
    escribir(clave, valor);
  }, [clave, valor]);
  return [valor, setValor];
}

// Como useReducer, pero el estado se conserva en localStorage
export function usePersistedReducer(clave, reducer, inicial, normalizar) {
  const [estado, dispatch] = useReducer(reducer, undefined, () => leer(clave, inicial, normalizar));
  useEffect(() => {
    escribir(clave, estado);
  }, [clave, estado]);
  return [estado, dispatch];
}
