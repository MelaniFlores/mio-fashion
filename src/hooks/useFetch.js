import { useCallback, useEffect, useState } from "react";

// Hook reutilizable para consumir una API externa con estados de carga y error.
//  - transformar: función opcional para convertir la respuesta en lo que necesita el componente
//  - cacheMinutos: guarda la respuesta en sessionStorage para no repetir la petición
export function useFetch(url, { transformar, cacheMinutos = 10, tiempoLimiteMs = 10000 } = {}) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const clave = `fetch:${url}`;
    const ahora = Date.now();

    // 1) ¿Hay una respuesta reciente en caché?
    if (intento === 0) {
      try {
        const guardado = JSON.parse(sessionStorage.getItem(clave) || "null");
        if (guardado && ahora - guardado.hora < cacheMinutos * 60000) {
          setEstado({ datos: guardado.datos, cargando: false, error: null });
          return;
        }
      } catch (e) {
        /* sin caché, seguimos con la petición */
      }
    }

    // 2) Petición con tiempo límite y cancelación al salir del componente
    const controlador = new AbortController();
    let terminoPorTiempo = false;
    const temporizador = setTimeout(() => {
      terminoPorTiempo = true;
      controlador.abort();
    }, tiempoLimiteMs);

    setEstado({ datos: null, cargando: true, error: null });

    fetch(url, { signal: controlador.signal })
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error(`El servicio respondió con error ${respuesta.status}.`);
        return respuesta.json();
      })
      .then((json) => {
        const datos = transformar ? transformar(json) : json;
        try {
          sessionStorage.setItem(clave, JSON.stringify({ hora: Date.now(), datos }));
        } catch (e) {
          /* si no cabe en caché no pasa nada */
        }
        setEstado({ datos, cargando: false, error: null });
      })
      .catch((e) => {
        if (controlador.signal.aborted && !terminoPorTiempo) return; // el componente se desmontó
        setEstado({
          datos: null,
          cargando: false,
          error: terminoPorTiempo ? "El servicio tardó demasiado en responder." : "No se pudo conectar con el servicio.",
        });
      })
      .finally(() => clearTimeout(temporizador));

    return () => {
      clearTimeout(temporizador);
      controlador.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, intento]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);
  return { ...estado, reintentar };
}
