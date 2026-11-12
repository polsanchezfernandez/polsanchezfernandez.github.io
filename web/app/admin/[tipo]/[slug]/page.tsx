import Link from "next/link";
import { notFound } from "next/navigation";
import ItemForm from "@/components/ItemForm";
import { requireAdmin } from "@/lib/auth";
import { getItem } from "@/lib/db";
import { isTipo, TIPOS } from "@/lib/schema";
import { deleteAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function Editar({ params }: { params: Promise<{ tipo: string; slug: string }> }) {
  await requireAdmin();
  const { tipo, slug } = await params;
  if (!isTipo(tipo)) notFound();
  const item = slug === "nuevo" ? null : await getItem(tipo, slug);
  if (slug !== "nuevo" && !item && tipo !== "perfil") notFound();
  const nombre = TIPOS[tipo].singular.toLowerCase();

  return (
    <main className="wrap admin">
      <p>
        <Link href="/admin">← Panel</Link>
      </p>
      <h1>{item ? `Editar ${nombre}` : `Nuevo: ${nombre}`}</h1>
      <ItemForm tipo={tipo} fields={TIPOS[tipo].fields} slug={item?.slug} initial={item?.data ?? {}} />
      {item && tipo !== "perfil" && (
        <form action={deleteAction} className="danger-zone">
          <input type="hidden" name="tipo" value={tipo} />
          <input type="hidden" name="slug" value={item.slug} />
          <button className="btn danger">Borrar</button>
        </form>
      )}
    </main>
  );
}
