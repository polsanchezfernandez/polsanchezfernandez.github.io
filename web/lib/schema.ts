// Definición de los tipos de contenido. El panel /admin genera sus formularios
// a partir de aquí, así que añadir un campo nuevo es tocar solo este archivo.

export type Field =
  | { name: string; label: string; type: "text" | "textarea" | "date" | "url" | "image" | "number"; hint?: string }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[] }
  | { name: string; label: string; type: "tags"; hint?: string }
  | { name: string; label: string; type: "check" }
  | { name: string; label: string; type: "list"; itemLabel: string; fields: Field[] };

export type Tipo = "viaje" | "proyecto" | "hazana" | "interes" | "perfil";

export type Item = {
  tipo: Tipo;
  slug: string;
  data: Record<string, any>;
};

export const TIPOS: Record<Tipo, { singular: string; plural: string; titulo: string; fields: Field[] }> = {
  viaje: {
    singular: "Viaje",
    plural: "Viajes",
    titulo: "titulo",
    fields: [
      { name: "titulo", label: "Título", type: "text" },
      { name: "destino", label: "Destino", type: "text", hint: "Ej: Indonesia y Singapur" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          { value: "planeando", label: "Planeando" },
          { value: "en-curso", label: "En curso" },
          { value: "hecho", label: "Hecho" },
        ],
      },
      { name: "inicio", label: "Fecha de inicio", type: "date" },
      { name: "fin", label: "Fecha de fin", type: "date" },
      { name: "portada", label: "Foto de portada", type: "image" },
      { name: "resumen", label: "Resumen", type: "textarea" },
      {
        name: "paradas",
        label: "Ruta",
        type: "list",
        itemLabel: "Parada",
        fields: [
          { name: "emoji", label: "Emoji", type: "text" },
          { name: "lugar", label: "Lugar", type: "text" },
          { name: "noches", label: "Noches", type: "number" },
          { name: "transporte", label: "Cómo llegas", type: "text", hint: "Vuelo, barco, coche..." },
        ],
      },
      {
        name: "dias",
        label: "Plan día a día",
        type: "list",
        itemLabel: "Día",
        fields: [
          { name: "fecha", label: "Fecha", type: "date" },
          { name: "lugar", label: "Lugar", type: "text" },
          { name: "titulo", label: "Título del día", type: "text" },
          { name: "plan", label: "Plan", type: "textarea" },
        ],
      },
      {
        name: "reservas",
        label: "Reservas",
        type: "list",
        itemLabel: "Reserva",
        fields: [
          { name: "concepto", label: "Concepto", type: "text" },
          { name: "detalle", label: "Detalle", type: "textarea" },
          { name: "precio", label: "Precio", type: "text" },
          { name: "hecho", label: "Reservado", type: "check" },
        ],
      },
      {
        name: "checklist",
        label: "Checklist",
        type: "list",
        itemLabel: "Cosa",
        fields: [
          { name: "texto", label: "Qué", type: "text" },
          { name: "hecho", label: "Hecho", type: "check" },
        ],
      },
      { name: "relato", label: "Crónica del viaje", type: "textarea", hint: "Lo que pasó, cuando vuelvas" },
      { name: "fotos", label: "Fotos", type: "list", itemLabel: "Foto", fields: [
        { name: "url", label: "Foto", type: "image" },
        { name: "pie", label: "Pie de foto", type: "text" },
      ] },
    ],
  },
  proyecto: {
    singular: "Proyecto",
    plural: "Proyectos",
    titulo: "titulo",
    fields: [
      { name: "titulo", label: "Título", type: "text" },
      { name: "resumen", label: "Resumen corto", type: "text" },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: [
          { value: "idea", label: "Idea" },
          { value: "en-marcha", label: "En marcha" },
          { value: "terminado", label: "Terminado" },
        ],
      },
      { name: "fecha", label: "Fecha", type: "date" },
      { name: "portada", label: "Imagen", type: "image" },
      { name: "etiquetas", label: "Etiquetas", type: "tags", hint: "Separadas por comas" },
      { name: "enlace", label: "Enlace", type: "url" },
      { name: "descripcion", label: "Descripción", type: "textarea" },
    ],
  },
  hazana: {
    singular: "Hazaña",
    plural: "Hazañas",
    titulo: "titulo",
    fields: [
      { name: "titulo", label: "Título", type: "text", hint: "Ej: Primera maratón" },
      { name: "fecha", label: "Fecha", type: "date" },
      { name: "emoji", label: "Emoji", type: "text" },
      { name: "dato", label: "Dato destacado", type: "text", hint: "Ej: 3h 42min" },
      { name: "descripcion", label: "Descripción", type: "textarea" },
      { name: "foto", label: "Foto", type: "image" },
    ],
  },
  interes: {
    singular: "Cosa interesante",
    plural: "Cosas interesantes",
    titulo: "titulo",
    fields: [
      { name: "titulo", label: "Título", type: "text" },
      {
        name: "categoria",
        label: "Categoría",
        type: "select",
        options: [
          { value: "libro", label: "Libro" },
          { value: "musica", label: "Música" },
          { value: "peli", label: "Peli / serie" },
          { value: "lugar", label: "Lugar" },
          { value: "idea", label: "Idea" },
          { value: "otro", label: "Otro" },
        ],
      },
      { name: "enlace", label: "Enlace", type: "url" },
      { name: "nota", label: "Por qué me gusta", type: "textarea" },
    ],
  },
  perfil: {
    singular: "Sobre mí",
    plural: "Sobre mí",
    titulo: "nombre",
    fields: [
      { name: "nombre", label: "Nombre", type: "text" },
      { name: "lema", label: "Frase de portada", type: "text" },
      { name: "foto", label: "Foto", type: "image" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "ubicacion", label: "Dónde vivo", type: "text" },
      {
        name: "enlaces",
        label: "Enlaces",
        type: "list",
        itemLabel: "Enlace",
        fields: [
          { name: "nombre", label: "Nombre", type: "text" },
          { name: "url", label: "URL", type: "url" },
        ],
      },
    ],
  },
};

export function isTipo(t: string): t is Tipo {
  return t in TIPOS;
}

export function slugify(s: string) {
  return (
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "sin-titulo"
  );
}
