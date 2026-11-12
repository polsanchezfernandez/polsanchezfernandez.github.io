import { listItems } from "@/lib/db";

export const metadata = { title: "Cosas que me gustan" };

const CATEGORIAS: Record<string, string> = {
  libro: "📚 Libros",
  musica: "🎧 Música",
  peli: "🎬 Pelis y series",
  lugar: "📍 Lugares",
  idea: "💡 Ideas",
  otro: "✨ Otras cosas",
};

export default async function Cosas() {
  const cosas = await listItems("interes");
  const grupos = Object.entries(CATEGORIAS)
    .map(([cat, label]) => [label, cosas.filter((c) => (c.data.categoria || "otro") === cat)] as const)
    .filter(([, items]) => items.length > 0);
  return (
    <main className="wrap">
      <h1 className="page-title">Cosas que me gustan</h1>
      {grupos.map(([label, items]) => (
        <section key={label}>
          <h2 className="section-title">{label}</h2>
          <ul className="cosas">
            {items.map((c) => (
              <li key={c.slug}>
                <h3>{c.data.enlace ? <a href={c.data.enlace} target="_blank" rel="noreferrer">{c.data.titulo} ↗</a> : c.data.titulo}</h3>
                {c.data.nota && <p>{c.data.nota}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {cosas.length === 0 && <p className="muted">Pronto.</p>}
    </main>
  );
}
