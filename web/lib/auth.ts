import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "admin";

function token() {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return null;
  return createHmac("sha256", pass).update("web-personal-admin").digest("hex");
}

export async function isAdmin() {
  const expected = token();
  const got = (await cookies()).get(COOKIE)?.value;
  if (!expected || !got || got.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function login(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) return false;
  (await cookies()).set(COOKIE, token()!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return true;
}

export async function logout() {
  (await cookies()).delete(COOKIE);
}
