import { notFound } from "next/navigation";
import { getItem, listItems } from "@/lib/db";
import { dias, ESTADOS, fecha, parrafos, rango } from "@/lib/format";
import TripTabs from "@/components/TripTabs";

export async function generateStaticParams() {
  return (await listItems("viaje")).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return { title: (await getItem("viaje", (await params).slug))?.data.titulo };
}

const RECOMENDACIONES: Record<string, string> = {
  comer: "🍜 Dónde comer",
  dormir: "🛏 Dónde dormir",
  hacer: "🌋 Qué hacer",
  consejo: "💡 Consejos",
};

export default async function Viaje({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getItem("viaje", (await params).slug);
  if (!item) notFound();
  const d = item.data;
  const paradas: any[] = d.paradas ?? [];
  const total = dias(d.inicio, d.fin);
  const hayDiario = !!(d.relato || d.historias?.length || d.recomendaciones?.length || d.fotos?.some((f: any) => f.url));

  return (
    <main>
      <section className="trip-hero" style={d.portada ? { backgroundImage: `url(${d.portada})` } : undefined}>
        <div className="wrap">
          {d.estado && <span className={`pill ${d.estado}`}>{ESTADOS[d.estado]}</span>}
          <small>{rango(d.inicio, d.fin)}</small>
          <h1>{d.titulo}</h1>
          {d.resumen && <p className="lead">{d.resumen}</p>}
          <div className="stats">
            {total && <Stat n={total} label="días" />}
            {paradas.length > 0 && <Stat n={paradas.length} label="paradas" />}
            {d.destino && <Stat n="📍" label={d.destino} />}
          </div>
        </div>
      </section>

      <TripTabs
        inicial={hayDiario && d.estado === "hecho" ? "diario" : "planning"}
        planning={<Planning d={d} />}
        diario={<Diario d={d} />}
      />
    </main>
  );
}

function Planning({ d }: { d: Record<string, any> }) {
  const paradas: any[] = d.paradas ?? [];
  const plan: any[] = d.dias ?? [];
  const reservas: any[] = d.reservas ?? [];
  const checklist: any[] = d.checklist ?? [];
  return (
    <div className="wrap trip">
      {paradas.length > 0 && (
        <section>
          <h2 className="section-title">La ruta</h2>
          <ol className="ruta-list">
            {paradas.map((p, i) => (
              <li key={i}>
                {p.transporte && i > 0 && <span className="transporte">{p.transporte}</span>}
                <div className="parada">
                  <span className="parada-emoji">{p.emoji || "•"}</span>
                  <strong>{p.lugar}</strong>
                  {p.noches ? <small>{p.noches} {p.noches === 1 ? "noche" : "noches"}</small> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {plan.length > 0 && (
        <section>
          <h2 className="section-title">Día a día</h2>
          <ol className="dias">
            {plan.map((dia, i) => (
              <li key={i}>
                <div className="dia-num">
                  <span>Día</span>
                  <strong>{i + 1}</strong>
                </div>
                <div>
                  <small>{[fecha(dia.fecha, { weekday: "short", day: "numeric", month: "short" }), dia.lugar].filter(Boolean).join(" · ")}</small>
                  {dia.titulo && <h3>{dia.titulo}</h3>}
                  {parrafos(dia.plan).map((t, j) => (
                    <p key={j}>{t}</p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {reservas.length > 0 && (
        <section>
          <h2 className="section-title">Reservas</h2>
          <ul className="reservas">
            {reservas.map((r, i) => (
              <li key={i} className={r.hecho ? "hecho" : ""}>
                <span className="tick">{r.hecho ? "✓" : "○"}</span>
                <div>
                  <strong>{r.concepto}</strong>
                  {r.detalle && <p>{r.detalle}</p>}
                </div>
                {r.precio && <span className="precio">{r.precio}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {checklist.length > 0 && (
        <section>
          <h2 className="section-title">
            Checklist <small className="muted">{checklist.filter((c) => c.hecho).length}/{checklist.length}</small>
          </h2>
          <ul className="checklist">
            {checklist.map((c, i) => (
              <li key={i} className={c.hecho ? "hecho" : ""}>
                <span className="tick">{c.hecho ? "✓" : "○"}</span> {c.texto}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Diario({ d }: { d: Record<string, any> }) {
  const historias: any[] = d.historias ?? [];
  const recomendaciones: any[] = d.recomendaciones ?? [];
  const fotos: any[] = (d.fotos ?? []).filter((f: any) => f.url);
  const grupos = Object.entries(RECOMENDACIONES)
    .map(([cat, label]) => [label, recomendaciones.filter((r) => (r.categoria || "consejo") === cat)] as const)
    .filter(([, items]) => items.length > 0);
  const vacio = !d.relato && !historias.length && !grupos.length && !fotos.length;

  return (
    <div className="wrap trip diario">
      {vacio && (
        <section className="diario-vacio">
          <p className="lead">El diario de este viaje está por escribir.</p>
        </section>
      )}

      {d.relato && (
        <section className="diario-intro prose">
          {parrafos(d.relato).map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </section>
      )}

      {historias.map((h, i) => (
        <article key={i} className="historia">
          {h.portada && <img className="historia-portada" src={h.portada} alt={h.titulo ?? ""} loading="lazy" />}
          <header>
            <small>{[h.lugar, fecha(h.fecha, { day: "numeric", month: "long" })].filter(Boolean).join(" · ")}</small>
            {h.titulo && <h2>{h.titulo}</h2>}
          </header>
          <div className="prose">
            {parrafos(h.texto).map((t, j) => (
              <p key={j}>{t}</p>
            ))}
          </div>
          {h.fotos?.some((f: any) => f.url) && <Galeria fotos={h.fotos.filter((f: any) => f.url)} />}
        </article>
      ))}

      {grupos.length > 0 && (
        <section>
          <h2 className="section-title">Recomendaciones</h2>
          <div className="recos">
            {grupos.map(([label, items]) => (
              <div key={label} className="reco-grupo">
                <h3>{label}</h3>
                <ul>
                  {items.map((r, i) => (
                    <li key={i}>
                      <strong>
                        {r.enlace ? (
                          <a href={r.enlace} target="_blank" rel="noreferrer">
                            {r.nombre} ↗
                          </a>
                        ) : (
                          r.nombre
                        )}
                      </strong>
                      {r.lugar && <small> · {r.lugar}</small>}
                      {r.nota && <p>{r.nota}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {fotos.length > 0 && (
        <section>
          <h2 className="section-title">Galería</h2>
          <Galeria fotos={fotos} />
        </section>
      )}
    </div>
  );
}

function Galeria({ fotos }: { fotos: any[] }) {
  return (
    <div className="fotos">
      {fotos.map((f, i) => (
        <figure key={i}>
          <a href={f.url} target="_blank" rel="noreferrer">
            <img src={f.url} alt={f.pie ?? ""} loading="lazy" />
          </a>
          {f.pie && <figcaption>{f.pie}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

function Stat({ n, label }: { n: React.ReactNode; label: string }) {
  return (
    <div className="stat">
      <strong>{n}</strong>
      <span>{label}</span>
    </div>
  );
}
