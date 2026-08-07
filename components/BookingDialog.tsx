"use client";

import { Suspense } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import BookingForm from "@/components/BookingForm";

export default function BookingDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <div id="booking-scroll" className="max-h-[85vh] overflow-y-auto p-5">
          <DialogTitle className="sr-only">Reservar cita</DialogTitle>
          <DialogDescription className="sr-only">
            Elige servicio, barbero, fecha y hora sin salir de la página.
          </DialogDescription>
          <Suspense fallback={<p className="text-stone-500">Cargando…</p>}>
            <BookingForm embedded />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
}
