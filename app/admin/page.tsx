import type { Metadata } from "next";
import Link from "next/link";
import AdminDashboard from "@/components/AdminDashboard";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="pt-24">
      <section className="container-page py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              <span className="h-px w-8 bg-accent" />
              Administración
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
              Panel de control
            </h1>
            <p className="mt-3 max-w-xl text-stone-600">
              Gestiona reservas y servicios. Los datos se guardan en tu navegador
              (demo, sin base de datos).
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/reservar">+ Crear reserva</Link>
          </Button>
        </div>

        <div className="mt-12">
          <AdminDashboard />
        </div>
      </section>
    </div>
  );
}
