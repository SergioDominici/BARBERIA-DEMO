import type { Metadata } from "next";
import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Reservar cita",
  description:
    "Reserva tu cita en línea: elige servicio, barbero, fecha y hora en pocos pasos.",
};

export default function ReservarPage() {
  return (
    <div className="pt-24">
      <section className="container-page py-6 sm:py-10">
        <Suspense
          fallback={<p className="text-stone-500">Cargando…</p>}
        >
          <BookingForm />
        </Suspense>
      </section>
    </div>
  );
}
