"use client";

import { useEffect, useState } from "react";

type Vista = "planning" | "diario";

// Las dos vistas se renderizan en el servidor; aquí solo se elige cuál se ve.
// La pestaña activa queda en la URL (#planning / #diario) para poder enlazarla.
export default function TripTabs({
  inicial,
  planning,
  diario,
}: {
  inicial: Vista;
  planning: React.ReactNode;
  diario: React.ReactNode;
}) {
  const [vista, setVista] = useState<Vista>(inicial);

  useEffect(() => {
    const desdeHash = () => {
      const h = window.location.hash.slice(1);
      if (h === "planning" || h === "diario") setVista(h);
    };
    desdeHash();
    window.addEventListener("hashchange", desdeHash);
    return () => window.removeEventListener("hashchange", desdeHash);
  }, []);

  function elegir(v: Vista) {
    setVista(v);
    history.replaceState(null, "", `#${v}`);
  }

  return (
    <>
      <div className="tabs-bar">
        <div className="wrap tabs" role="tablist">
          {(["planning", "diario"] as const).map((v) => (
            <button key={v} role="tab" aria-selected={vista === v} className={vista === v ? "on" : ""} onClick={() => elegir(v)}>
              {v === "planning" ? "🗺 Planning" : "📖 Diario"}
            </button>
          ))}
        </div>
      </div>
      <div hidden={vista !== "planning"}>{planning}</div>
      <div hidden={vista !== "diario"}>{diario}</div>
    </>
  );
}
