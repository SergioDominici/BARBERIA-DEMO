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
      <section className="container-page py-12">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Reserva en línea
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
            Agenda tu cita
          </h1>
          <p className="mt-4 text-stone-600">
            En menos de un minuto. Elige tu servicio, tu barbero y el horario que
            mejor te quede.
          </p>
        </div>

        <div className="mt-12">
          <Suspense
            fallback={<p className="text-stone-500">Cargando formulario…</p>}
          >
            <BookingForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
