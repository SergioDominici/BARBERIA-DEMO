"use client";

// Se re-monta en cada navegación → da una transición de entrada suave.
// Solo opacidad (sin transform) para no afectar los elementos position:fixed.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in motion-reduce:animate-none">{children}</div>;
}
