import { notFound } from "next/navigation";
import { getItem, listItems } from "@/lib/db";
import { ESTADOS, fecha, parrafos } from "@/lib/format";

export async function generateStaticParams() {
  return (await listItems("proyecto")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return { title: (await getItem("proyecto", (await params).slug))?.data.titulo };
}

export default async function Proyecto({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getItem("proyecto", (await params).slug);
  if (!item) notFound();
  const d = item.data;
  return (
    <main className="wrap narrow">
      <small className="muted">
        {[ESTADOS[d.estado], fecha(d.fecha, { month: "long", year: "numeric" })].filter(Boolean).join(" · ")}
      </small>
      <h1 className="page-title">{d.titulo}</h1>
      {d.resumen && <p className="lead">{d.resumen}</p>}
      {d.portada && <img className="cover" src={d.portada} alt="" />}
      <div className="prose">
        {parrafos(d.descripcion).map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
      {d.etiquetas?.length > 0 && (
        <div className="tags">
          {d.etiquetas.filter(Boolean).map((t: string) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
      {d.enlace && (
        <p>
          <a className="btn primary" href={d.enlace} target="_blank" rel="noreferrer">
            Ver proyecto ↗
          </a>
        </p>
      )}
    </main>
  );
}
