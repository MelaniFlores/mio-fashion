(function () {
  // Si el archivo ya se cargó en esta página, no lo volvemos a ejecutar
  if (window.temaCargado) return;
  window.temaCargado = true;

  // Estilos del modo nocturno
  const estilosOscuro = document.createElement("style");
  estilosOscuro.textContent = `
    html.modo-oscuro body { background-color: #0a0a0a; color: #f5f5f5; }
    .modo-oscuro .bg-white { background-color: #171717 !important; }
    .modo-oscuro .bg-neutral-100 { background-color: #262626 !important; }
    .modo-oscuro .bg-neutral-900 { background-color: #f5f5f5 !important; }
    .modo-oscuro .text-white { color: #171717 !important; }
    .modo-oscuro .text-neutral-900, .modo-oscuro .text-neutral-800 { color: #f5f5f5 !important; }
    .modo-oscuro .text-neutral-600, .modo-oscuro .text-neutral-500, .modo-oscuro .text-neutral-400 { color: #a3a3a3 !important; }
    .modo-oscuro .border-neutral-200, .modo-oscuro .border-neutral-300 { border-color: #404040 !important; }
    .modo-oscuro input, .modo-oscuro select, .modo-oscuro textarea { background-color: #262626 !important; color: #f5f5f5 !important; border-color: #404040 !important; }
    .modo-oscuro .hover\\:bg-neutral-100:hover { background-color: #262626 !important; }
  `;
  document.head.appendChild(estilosOscuro);

  // Aplica el tema guardado al cargar la página
  if (localStorage.getItem("tema") === "oscuro") {
    document.documentElement.classList.add("modo-oscuro");
  }

  // Cambia entre claro y oscuro y guarda la preferencia
  function alternarTema() {
    const esOscuro = document.documentElement.classList.toggle("modo-oscuro");
    localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");
  }

  document.addEventListener("click", (evento) => {
    if (evento.target.closest("#btn-tema")) alternarTema();
  });
})();