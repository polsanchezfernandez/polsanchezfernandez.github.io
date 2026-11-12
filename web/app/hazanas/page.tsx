import { listItems } from "@/lib/db";
import { Hazana } from "@/components/Cards";

export const metadata = { title: "Hazañas" };

export default async function Hazanas() {
  const hazanas = await listItems("hazana");
  return (
    <main className="wrap">
      <h1 className="page-title">Hazañas</h1>
      <ul className="hazanas">
        {hazanas.map((h) => (
          <Hazana key={h.slug} item={h} />
        ))}
      </ul>
      {hazanas.length === 0 && <p className="muted">Pronto.</p>}
    </main>
  );
}
