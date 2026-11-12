import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Item, Tipo } from "./schema";

// Todo el contenido vive en el repo: content/<tipo>/<slug>.json, y las fotos en public/fotos.
// Así cualquier cambio (hecho a mano, por Claude o desde el panel) es un commit y Vercel redespliega.
//
// Desde el panel: con GITHUB_TOKEN y GITHUB_REPO configurados, los cambios se guardan como
// commits en GitHub (en Vercel el disco es de solo lectura). Sin ellos, se escribe en disco local.

const ROOT = process.cwd();
const CONTENT = "content";

function github() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;
  const branch = process.env.GITHUB_BRANCH || "main";
  // Carpeta del repo donde vive la web (vacío si está en la raíz).
  const prefix = (process.env.GITHUB_DIR || "").replace(/^\/+|\/+$/g, "");
  const api = async (file: string, init?: RequestInit) =>
    fetch(`https://api.github.com/repos/${repo}/contents/${prefix ? `${prefix}/` : ""}${file}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", ...init?.headers },
      cache: "no-store",
    });
  const sha = async (file: string) => {
    const res = await api(`${file}?ref=${branch}`);
    return res.ok ? ((await res.json()).sha as string) : undefined;
  };
  return {
    async put(file: string, content: Buffer, message: string) {
      const res = await api(file, {
        method: "PUT",
        body: JSON.stringify({ message, branch, content: content.toString("base64"), sha: await sha(file) }),
      });
      if (!res.ok) throw new Error(`GitHub: ${res.status} ${await res.text()}`);
    },
    async remove(file: string, message: string) {
      const s = await sha(file);
      if (!s) return;
      const res = await api(file, { method: "DELETE", body: JSON.stringify({ message, branch, sha: s }) });
      if (!res.ok) throw new Error(`GitHub: ${res.status} ${await res.text()}`);
    },
  };
}

async function writeRepoFile(file: string, content: Buffer, message: string) {
  const gh = github();
  if (gh) return gh.put(file, content, message);
  await fs.mkdir(path.dirname(path.join(/*turbopackIgnore: true*/ ROOT, file)), { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ ROOT, file), content);
}

async function removeRepoFile(file: string, message: string) {
  const gh = github();
  if (gh) return gh.remove(file, message);
  await fs.rm(path.join(/*turbopackIgnore: true*/ ROOT, file), { force: true });
}

const itemPath = (tipo: Tipo, slug: string) => `${CONTENT}/${tipo}/${slug}.json`;

export async function listItems(tipo: Tipo): Promise<Item[]> {
  const dir = path.join(ROOT, CONTENT, tipo);
  const files = await fs.readdir(dir).catch(() => [] as string[]);
  const items = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map((f) => getItem(tipo, f.replace(/\.json$/, ""))),
  );
  return sortItems(items.filter((i): i is Item => !!i));
}

// Lo más reciente primero, según la fecha del contenido.
function sortItems(items: Item[]) {
  const fecha = (i: Item) => String(i.data.inicio || i.data.fecha || "");
  return items.sort((a, b) => fecha(b).localeCompare(fecha(a)));
}

export async function getItem(tipo: Tipo, slug: string): Promise<Item | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const data = JSON.parse(await fs.readFile(path.join(ROOT, itemPath(tipo, slug)), "utf8"));
    return { tipo, slug, data };
  } catch {
    return null;
  }
}

export async function saveItem(item: Item, slugAnterior?: string) {
  const json = Buffer.from(JSON.stringify(item.data, null, 2) + "\n");
  await writeRepoFile(itemPath(item.tipo, item.slug), json, `Panel: guarda ${item.tipo} ${item.slug}`);
  if (slugAnterior && slugAnterior !== item.slug) {
    await removeRepoFile(itemPath(item.tipo, slugAnterior), `Panel: renombra ${item.tipo} ${slugAnterior}`);
  }
}

export async function deleteItem(tipo: Tipo, slug: string) {
  await removeRepoFile(itemPath(tipo, slug), `Panel: borra ${tipo} ${slug}`);
}

export async function uploadFile(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  await writeRepoFile(`public/fotos/${name}`, Buffer.from(await file.arrayBuffer()), `Panel: sube foto ${name}`);
  return `/fotos/${name}`;
}

// Si los cambios del panel van a GitHub, la web los muestra tras el siguiente despliegue.
export const cambiosDiferidos = () => !!github();
