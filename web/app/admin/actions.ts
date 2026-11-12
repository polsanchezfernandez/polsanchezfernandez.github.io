"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, login, logout } from "@/lib/auth";
import { deleteItem, saveItem, uploadFile } from "@/lib/db";
import { isTipo, slugify, TIPOS } from "@/lib/schema";

export async function loginAction(_: unknown, form: FormData) {
  if (await login(String(form.get("password") ?? ""))) redirect("/admin");
  return { error: "Contraseña incorrecta" };
}

export async function logoutAction() {
  await logout();
  redirect("/");
}

function tipoDe(form: FormData) {
  const tipo = String(form.get("tipo"));
  if (!isTipo(tipo)) throw new Error("Tipo desconocido");
  return tipo;
}

export async function saveAction(form: FormData) {
  await requireAdmin();
  const tipo = tipoDe(form);
  const data = JSON.parse(String(form.get("data") ?? "{}"));
  const titulo = String(data[TIPOS[tipo].titulo] ?? "");
  const slug = tipo === "perfil" ? "perfil" : slugify(String(form.get("slug") || "") || titulo);
  await saveItem({ tipo, slug, data }, String(form.get("slugAnterior") || "") || undefined);
  revalidatePath("/", "layout");
  redirect(`/admin?ok=1`);
}

export async function deleteAction(form: FormData) {
  await requireAdmin();
  await deleteItem(tipoDe(form), String(form.get("slug")));
  revalidatePath("/", "layout");
  redirect("/admin?ok=1");
}

export async function uploadAction(form: FormData) {
  await requireAdmin();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("No hay archivo");
  return uploadFile(file);
}
