import { notFound } from "next/navigation";
import { getItem, listItems } from "@/lib/db";
import { dias, ESTADOS, fecha, parrafos, rango } from "@/lib/format";

export async function generateStaticParams() {
  return (await listItems("viaje")).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return { title: (await getItem("viaje", (await params).slug))?.data.titulo };
}

export default async function Viaje({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getItem("viaje", (await params).slug);
  if (!item) notFound();
  const d = item.data;
  const paradas: any[] = d.paradas ?? [];
  const plan: any[] = d.dias ?? [];
  const reservas: any[] = d.reservas ?? [];
  const checklist: any[] = d.checklist ?? [];
  const fotos: any[] = (d.fotos ?? []).filter((f: any) => f.url);
  const total = dias(d.inicio, d.fin);

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

        {d.relato && (
          <section>
            <h2 className="section-title">Crónica</h2>
            <div className="prose">
              {parrafos(d.relato).map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          </section>
        )}

        {fotos.length > 0 && (
          <section>
            <h2 className="section-title">Fotos</h2>
            <div className="fotos">
              {fotos.map((f, i) => (
                <figure key={i}>
                  <img src={f.url} alt={f.pie ?? ""} loading="lazy" />
                  {f.pie && <figcaption>{f.pie}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
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
