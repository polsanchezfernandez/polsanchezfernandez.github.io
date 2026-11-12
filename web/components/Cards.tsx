import Link from "next/link";
import type { Item } from "@/lib/schema";
import { ESTADOS, fecha, rango } from "@/lib/format";

export function ViajeCard({ item }: { item: Item }) {
  const d = item.data;
  return (
    <Link href={`/viajes/${item.slug}`} className="card viaje-card">
      <div className="card-img" style={d.portada ? { backgroundImage: `url(${d.portada})` } : undefined}>
        {d.estado && <span className={`pill ${d.estado}`}>{ESTADOS[d.estado]}</span>}
      </div>
      <div className="card-body">
        <small>{rango(d.inicio, d.fin)}</small>
        <h3>{d.titulo}</h3>
        {d.paradas?.length > 0 && (
          <p className="ruta">{d.paradas.map((p: any) => `${p.emoji ?? ""} ${p.lugar}`.trim()).join(" → ")}</p>
        )}
      </div>
    </Link>
  );
}

export function ProyectoCard({ item }: { item: Item }) {
  const d = item.data;
  return (
    <Link href={`/proyectos/${item.slug}`} className="card proyecto-card">
      {d.portada && <div className="card-img" style={{ backgroundImage: `url(${d.portada})` }} />}
      <div className="card-body">
        <small>
          {[ESTADOS[d.estado], fecha(d.fecha, { month: "long", year: "numeric" })].filter(Boolean).join(" · ")}
        </small>
        <h3>{d.titulo}</h3>
        {d.resumen && <p>{d.resumen}</p>}
        {d.etiquetas?.length > 0 && (
          <div className="tags">
            {d.etiquetas.filter(Boolean).map((t: string) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function Hazana({ item }: { item: Item }) {
  const d = item.data;
  return (
    <li className="hazana">
      <span className="hazana-emoji">{d.emoji || "★"}</span>
      <div>
        <small>{fecha(d.fecha, { month: "long", year: "numeric" })}</small>
        <h3>
          {d.titulo} {d.dato && <em>{d.dato}</em>}
        </h3>
        {d.descripcion && <p>{d.descripcion}</p>}
        {d.foto && <img src={d.foto} alt="" />}
      </div>
    </li>
  );
}
