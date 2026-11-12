import type { Metadata } from "next";
import Link from "next/link";
import { getItem } from "@/lib/db";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const perfil = await getItem("perfil", "perfil");
  const nombre = perfil?.data.nombre || "Pol";
  return { title: { default: nombre, template: `%s · ${nombre}` }, description: perfil?.data.lema };
}

const NAV = [
  ["/viajes", "Viajes"],
  ["/proyectos", "Proyectos"],
  ["/hazanas", "Hazañas"],
  ["/cosas", "Cosas que me gustan"],
  ["/sobre-mi", "Sobre mí"],
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const perfil = await getItem("perfil", "perfil");
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="site-head wrap">
          <Link href="/" className="logo">
            {perfil?.data.nombre || "Pol"}
          </Link>
          <nav>
            {NAV.map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </header>
        {children}
        <footer className="site-foot wrap">
          <span>© {new Date().getFullYear()} {perfil?.data.nombre || "Pol"}</span>
          <Link href="/admin">Panel</Link>
        </footer>
      </body>
    </html>
  );
}
