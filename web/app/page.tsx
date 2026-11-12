import Link from "next/link";
import { getItem, listItems } from "@/lib/db";
import { Hazana, ProyectoCard, ViajeCard } from "@/components/Cards";

export default async function Home() {
  const [perfil, viajes, proyectos, hazanas] = await Promise.all([
    getItem("perfil", "perfil"),
    listItems("viaje"),
    listItems("proyecto"),
    listItems("hazana"),
  ]);
  const p = perfil?.data ?? {};
  const proximo = viajes.find((v) => v.data.estado === "planeando" || v.data.estado === "en-curso");

  return (
    <main className="wrap">
      <section className="hero">
        {p.foto && <img className="avatar" src={p.foto} alt="" />}
        <h1>{p.lema || `Hola, soy ${p.nombre || "Pol"}.`}</h1>
        <p className="hero-meta">
          {p.rol && <span>{p.rol}</span>}
          {p.ubicacion && <span>📍 {p.ubicacion}</span>}
        </p>
        <p className="hero-links">
          <Link className="btn primary" href="/cv">
            Ver mi CV
          </Link>
          <Link className="btn" href="/sobre-mi">
            Sobre mí
          </Link>
        </p>
      </section>

      {proximo && (
        <section>
          <h2 className="section-title">{proximo.data.estado === "en-curso" ? "Ahora mismo" : "Próximo viaje"}</h2>
          <ViajeCard item={proximo} />
        </section>
      )}

      <Bloque titulo="Viajes" href="/viajes" vacio={viajes.length === 0}>
        <div className="grid">
          {viajes.slice(0, 3).map((v) => (
            <ViajeCard key={v.slug} item={v} />
          ))}
        </div>
      </Bloque>

      <Bloque titulo="Proyectos" href="/proyectos" vacio={proyectos.length === 0}>
        <div className="grid">
          {proyectos.slice(0, 3).map((v) => (
            <ProyectoCard key={v.slug} item={v} />
          ))}
        </div>
      </Bloque>

      <Bloque titulo="Hazañas" href="/hazanas" vacio={hazanas.length === 0}>
        <ul className="hazanas">
          {hazanas.slice(0, 3).map((h) => (
            <Hazana key={h.slug} item={h} />
          ))}
        </ul>
      </Bloque>
    </main>
  );
}

function Bloque({ titulo, href, vacio, children }: { titulo: string; href: string; vacio: boolean; children: React.ReactNode }) {
  if (vacio) return null;
  return (
    <section>
      <div className="section-head">
        <h2 className="section-title">{titulo}</h2>
        <Link href={href}>Ver todo →</Link>
      </div>
      {children}
    </section>
  );
}
