const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("es-ES", { ...opts, timeZone: "UTC" });

export function fecha(d?: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  if (!d) return "";
  const date = new Date(d);
  return isNaN(+date) ? d : fmt(opts).format(date);
}

export function rango(inicio?: string, fin?: string) {
  if (!inicio) return "";
  if (!fin) return fecha(inicio);
  const a = new Date(inicio);
  const b = new Date(fin);
  const mismoMes = a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear();
  return mismoMes
    ? `${a.getUTCDate()}–${fecha(fin)}`
    : `${fecha(inicio, { day: "numeric", month: "short" })} – ${fecha(fin, { day: "numeric", month: "short", year: "numeric" })}`;
}

export function dias(inicio?: string, fin?: string) {
  if (!inicio || !fin) return null;
  return Math.round((+new Date(fin) - +new Date(inicio)) / 86400000);
}

export const ESTADOS: Record<string, string> = {
  planeando: "Planeando",
  "en-curso": "En curso",
  hecho: "Hecho",
  idea: "Idea",
  "en-marcha": "En marcha",
  terminado: "Terminado",
};

// Párrafos a partir de texto plano con saltos de línea.
export function parrafos(texto?: string) {
  return (texto ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}
