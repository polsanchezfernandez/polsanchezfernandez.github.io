import { notFound } from "next/navigation";
import { getItem } from "@/lib/db";
import PrintButton from "@/components/PrintButton";

export const metadata = { title: "CV" };

export default async function CV() {
  const [cv, perfil] = await Promise.all([getItem("cv", "cv"), getItem("perfil", "perfil")]);
  if (!cv) notFound();
  const d = cv.data;
  const p = perfil?.data ?? {};
  const linkedin = (p.enlaces ?? []).find((e: any) => /linkedin/i.test(e.url));

  return (
    <main className="wrap cv">
      <header className="cv-head">
        <img className="cv-foto" src="/fotos/pol.jpg" alt={p.nombre} />
        <div>
          <small className="kicker">Currículum</small>
          <h1>{p.nombre}</h1>
          <p className="cv-rol">{d.rol}</p>
          <p className="lead">{d.resumen}</p>
          <div className="cv-actions">
            {linkedin && (
              <a className="btn primary" href={linkedin.url} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            )}
            <PrintButton />
          </div>
        </div>
      </header>

      {d.cifras?.length > 0 && (
        <section className="cifras">
          {d.cifras.map((c: any, i: number) => (
            <div key={i} className="cifra">
              <strong>{c.valor}</strong>
              <span>{c.texto}</span>
            </div>
          ))}
        </section>
      )}

      {d.experiencia?.length > 0 && (
        <section>
          <h2 className="section-title">Experiencia</h2>
          <ol className="exp">
            {d.experiencia.map((e: any, i: number) => (
              <li key={i}>
                <div className="exp-fechas">
                  {e.desde} – {e.hasta || "hoy"}
                </div>
                <div>
                  <h3>{e.puesto}</h3>
                  <p className="exp-empresa">
                    <strong>{e.empresa}</strong>
                    {[e.descripcionEmpresa, e.lugar].filter(Boolean).map((t) => ` · ${t}`)}
                  </p>
                  <ul className="logros">
                    {String(e.logros ?? "")
                      .split("\n")
                      .filter((l) => l.trim())
                      .map((l, j) => (
                        <li key={j}>{l}</li>
                      ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {d.proyectos?.length > 0 && (
        <section>
          <h2 className="section-title">Proyectos clave</h2>
          <div className="cv-proyectos">
            {d.proyectos.map((pr: any, i: number) => (
              <div key={i} className="cv-proyecto">
                {pr.anio && <small>{pr.anio}</small>}
                <h3>{pr.titulo}</h3>
                <p>{pr.texto}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="cv-cols">
        {d.formacion?.length > 0 && (
          <div>
            <h2 className="section-title">Formación</h2>
            {d.formacion.map((f: any, i: number) => (
              <div key={i} className="cv-item">
                <strong>{f.titulo}</strong>
                <span>
                  {f.centro} · {f.anios}
                </span>
              </div>
            ))}
          </div>
        )}
        {d.idiomas?.length > 0 && (
          <div>
            <h2 className="section-title">Idiomas</h2>
            {d.idiomas.map((f: any, i: number) => (
              <div key={i} className="cv-item row">
                <strong>{f.idioma}</strong>
                <span>{f.nivel}</span>
              </div>
            ))}
          </div>
        )}
        {d.habilidades?.length > 0 && (
          <div>
            <h2 className="section-title">Habilidades</h2>
            {d.habilidades.map((h: any, i: number) => (
              <div key={i} className="cv-item">
                <strong>{h.grupo}</strong>
                <div className="tags">
                  {(h.items ?? []).filter(Boolean).map((t: string) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
