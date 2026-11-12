import { listItems } from "@/lib/db";
import { ProyectoCard } from "@/components/Cards";

export const metadata = { title: "Proyectos" };

export default async function Proyectos() {
  const proyectos = await listItems("proyecto");
  return (
    <main className="wrap">
      <h1 className="page-title">Proyectos</h1>
      <div className="grid">
        {proyectos.map((p) => (
          <ProyectoCard key={p.slug} item={p} />
        ))}
      </div>
      {proyectos.length === 0 && <p className="muted">Pronto.</p>}
    </main>
  );
}
