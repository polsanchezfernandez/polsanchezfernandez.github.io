import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { cambiosDiferidos, listItems } from "@/lib/db";
import { TIPOS, Tipo } from "@/lib/schema";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

const ORDEN: Tipo[] = ["viaje", "proyecto", "hazana", "interes"];

export default async function Admin({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await requireAdmin();
  const { ok } = await searchParams;
  const grupos = await Promise.all(ORDEN.map(async (t) => [t, await listItems(t)] as const));

  return (
    <main className="wrap admin">
      <header className="admin-head">
        <h1>Panel</h1>
        <form action={logoutAction}>
          <button className="btn">Salir</button>
        </form>
      </header>
      {ok && (
        <p className="notice">
          Guardado ✓{cambiosDiferidos() && " Se verá en la web en un minuto, cuando termine de desplegarse."}
        </p>
      )}

      <section>
        <div className="admin-row">
          <h2>Sobre mí</h2>
          <Link className="btn" href="/admin/perfil/perfil">
            Editar
          </Link>
        </div>
        <div className="admin-row">
          <h2>CV</h2>
          <Link className="btn" href="/admin/cv/cv">
            Editar
          </Link>
        </div>
      </section>

      {grupos.map(([tipo, items]) => (
        <section key={tipo}>
          <div className="admin-row">
            <h2>{TIPOS[tipo].plural}</h2>
            <Link className="btn primary" href={`/admin/${tipo}/nuevo`}>
              + Nuevo
            </Link>
          </div>
          <ul className="admin-list">
            {items.map((i) => (
              <li key={i.slug}>
                <Link href={`/admin/${tipo}/${i.slug}`}>{i.data[TIPOS[tipo].titulo] || "Sin título"}</Link>
                <small>{i.data.inicio || i.data.fecha || ""}</small>
              </li>
            ))}
            {items.length === 0 && <li className="muted">Nada todavía</li>}
          </ul>
        </section>
      ))}
    </main>
  );
}
