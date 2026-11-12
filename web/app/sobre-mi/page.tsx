import { getItem } from "@/lib/db";
import { parrafos } from "@/lib/format";

export const metadata = { title: "Sobre mí" };

export default async function SobreMi() {
  const p = (await getItem("perfil", "perfil"))?.data ?? {};
  return (
    <main className="wrap narrow">
      <h1 className="page-title">Sobre mí</h1>
      {p.foto && <img className="avatar big" src={p.foto} alt="" />}
      <div className="prose">
        {parrafos(p.bio).map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
      {p.enlaces?.length > 0 && (
        <ul className="enlaces">
          {p.enlaces.map((e: any) => (
            <li key={e.url}>
              <a href={e.url} target="_blank" rel="noreferrer">
                {e.nombre} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
