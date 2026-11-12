"use client";

export default function PrintButton() {
  return (
    <button className="btn" onClick={() => window.print()}>
      Guardar en PDF
    </button>
  );
}
