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
    <div className="pt-20">
      <section className="container-page py-6 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">
              <span className="h-px w-8 bg-accent" />
              Administración
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-4xl">
              Panel de control
            </h1>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/reservar">+ Crear reserva</Link>
          </Button>
        </div>

        <div className="mt-6 sm:mt-8">
          <AdminDashboard />
        </div>
      </section>
    </div>
  );
}
