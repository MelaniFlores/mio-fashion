import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { STOCK_BAJO } from "../data/config";
import { formatearFecha } from "./fechas";
import { formatearPrecio } from "./formato";

// Copia un canvas de Chart.js sobre fondo blanco (así se ve bien aunque esté activo el modo oscuro)
function canvasAImagen(canvas) {
  const copia = document.createElement("canvas");
  copia.width = canvas.width;
  copia.height = canvas.height;
  const ctx = copia.getContext("2d");
  const oscuro = document.documentElement.classList.contains("modo-oscuro");
  ctx.fillStyle = oscuro ? "#171717" : "#ffffff";
  ctx.fillRect(0, 0, copia.width, copia.height);
  ctx.drawImage(canvas, 0, 0);
  return { data: copia.toDataURL("image/png"), ancho: canvas.width, alto: canvas.height };
}

// Genera y descarga el reporte PDF del panel de administración
export function generarReportePdf({ periodo, estadisticas, productos, contenedorGraficas }) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margen = 40;
  const anchoUtil = doc.internal.pageSize.getWidth() - margen * 2;
  const altoPagina = doc.internal.pageSize.getHeight();
  let y = 50;

  // Encabezado
  doc.setFont("helvetica", "bold").setFontSize(20).text("Mío Fashion — Reporte", margen, y);
  y += 20;
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(100);
  doc.text(`Período: ${periodo}`, margen, y);
  doc.text(`Generado: ${new Date().toLocaleString("es-SV")}`, margen, y + 14);
  doc.setTextColor(0);
  y += 36;

  // Resumen
  const valorInventario = productos.reduce((suma, p) => suma + p.precio * p.stock, 0);
  autoTable(doc, {
    startY: y,
    head: [["Indicador", "Valor"]],
    body: [
      ["Pedidos (sin cancelados)", estadisticas.pedidosPeriodo.length],
      ["Pedidos cancelados", estadisticas.canceladosPeriodo],
      ["Solicitudes especiales", estadisticas.solicitudesPeriodo.length],
      ["Ingresos cobrados", formatearPrecio(estadisticas.ingresosCobrados)],
      ["Por cobrar", formatearPrecio(estadisticas.porCobrar)],
      ["Productos en catálogo", productos.length],
      ["Valor del inventario", formatearPrecio(valorInventario)],
    ],
    headStyles: { fillColor: [219, 39, 119] },
    margin: { left: margen, right: margen },
  });
  y = doc.lastAutoTable.finalY + 24;

  // Productos más vendidos
  doc.setFont("helvetica", "bold").setFontSize(13).text("Productos más vendidos", margen, y);
  autoTable(doc, {
    startY: y + 8,
    head: [["#", "Producto", "Unidades"]],
    body: estadisticas.masVendidos.length
      ? estadisticas.masVendidos.map((p, i) => [i + 1, p.nombre, p.unidades])
      : [["", "Sin ventas en este período", ""]],
    headStyles: { fillColor: [219, 39, 119] },
    margin: { left: margen, right: margen },
  });
  y = doc.lastAutoTable.finalY + 24;

  // Productos con poco stock
  const bajos = productos.filter((p) => p.stock <= STOCK_BAJO);
  if (bajos.length) {
    doc.setFont("helvetica", "bold").setFontSize(13).text("Productos con stock bajo", margen, y);
    autoTable(doc, {
      startY: y + 8,
      head: [["Producto", "Categoría", "Stock"]],
      body: bajos.map((p) => [p.nombre, p.categoria, p.stock]),
      headStyles: { fillColor: [219, 39, 119] },
      margin: { left: margen, right: margen },
    });
    y = doc.lastAutoTable.finalY + 24;
  }

  // Detalle de pedidos
  doc.setFont("helvetica", "bold").setFontSize(13).text("Detalle de pedidos", margen, y);
  autoTable(doc, {
    startY: y + 8,
    head: [["Fecha", "Cliente", "Estado", "Total"]],
    body: estadisticas.pedidosPeriodo.length
      ? estadisticas.pedidosPeriodo.map((p) => [formatearFecha(p), p.cliente ?? "—", p.estado, formatearPrecio(p.total)])
      : [["", "Sin pedidos en este período", "", ""]],
    headStyles: { fillColor: [219, 39, 119] },
    margin: { left: margen, right: margen },
  });

  // Gráficas (cada una en su página nueva)
  const canvases = contenedorGraficas ? [...contenedorGraficas.querySelectorAll("canvas")] : [];
  canvases.forEach((canvas, i) => {
    const { data, ancho, alto } = canvasAImagen(canvas);
    const altoImg = Math.min((anchoUtil * alto) / ancho, altoPagina - 140);
    if (i === 0) {
      doc.addPage();
      doc.setFont("helvetica", "bold").setFontSize(16).text("Gráficas", margen, 50);
      y = 70;
    } else if (y + altoImg > altoPagina - 40) {
      doc.addPage();
      y = 50;
    }
    doc.addImage(data, "PNG", margen, y, anchoUtil, altoImg);
    y += altoImg + 20;
  });

  // Numeración de páginas
  const total = doc.getNumberOfPages();
  for (let n = 1; n <= total; n++) {
    doc.setPage(n);
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(130);
    doc.text(`Página ${n} de ${total}`, doc.internal.pageSize.getWidth() - margen, altoPagina - 20, { align: "right" });
  }

  doc.save(`reporte-mio-fashion-${new Date().toISOString().slice(0, 10)}.pdf`);
}
