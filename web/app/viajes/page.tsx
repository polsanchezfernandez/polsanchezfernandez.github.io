import { listItems } from "@/lib/db";
import { ViajeCard } from "@/components/Cards";

export const metadata = { title: "Viajes" };

export default async function Viajes() {
  const viajes = await listItems("viaje");
  return (
    <main className="wrap">
      <h1 className="page-title">Viajes</h1>
      <div className="grid">
        {viajes.map((v) => (
          <ViajeCard key={v.slug} item={v} />
        ))}
      </div>
      {viajes.length === 0 && <p className="muted">Pronto.</p>}
    </main>
  );
}
