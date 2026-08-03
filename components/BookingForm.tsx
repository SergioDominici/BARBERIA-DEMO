"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  SERVICIOS,
  BARBEROS,
  FRANJAS_HORARIAS,
  formatCOP,
} from "@/lib/data";
import { addReserva, slotOcupado, type Reserva } from "@/lib/bookings";
import { ServiceIcon, Star, Check, ArrowRight } from "@/components/icons";

const hoy = () => {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
};

const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function BookingForm() {
  const params = useSearchParams();
  const servicioInicial = params.get("servicio") ?? SERVICIOS[0].id;

  const [servicioId, setServicioId] = useState(servicioInicial);
  const [barberoId, setBarberoId] = useState("cualquiera");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [nota, setNota] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [confirmada, setConfirmada] = useState<Reserva | null>(null);

  const servicio = useMemo(
    () => SERVICIOS.find((s) => s.id === servicioId) ?? SERVICIOS[0],
    [servicioId]
  );
  const barbero = BARBEROS.find((b) => b.id === barberoId);

  const validar = () => {
    const e: Record<string, string> = {};
    if (!fecha) e.fecha = "Elige una fecha.";
    if (!hora) e.hora = "Elige un horario.";
    if (!cliente.trim()) e.cliente = "Escribe tu nombre.";
    if (!/^[0-9+\s()-]{7,}$/.test(telefono)) e.telefono = "Teléfono inválido.";
    if (!emailValido(email)) e.email = "Correo inválido.";
    if (
      fecha &&
      hora &&
      barberoId !== "cualquiera" &&
      slotOcupado(fecha, hora, barberoId)
    ) {
      e.hora = "Ese horario ya está reservado con este barbero.";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validar()) return;
    const reserva = addReserva({
      servicioId: servicio.id,
      servicioNombre: servicio.nombre,
      precio: servicio.precio,
      barberoId,
      barberoNombre: barbero ? barbero.nombre : "Cualquier barbero disponible",
      fecha,
      hora,
      cliente: cliente.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
      nota: nota.trim() || undefined,
    });
    setConfirmada(reserva);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (confirmada) {
    return <Confirmacion reserva={confirmada} />;
  }

  return (
    <div className="grid gap-8 pb-28 lg:grid-cols-[1fr_360px] lg:pb-0">
      <form onSubmit={enviar} noValidate className="space-y-10">
        {/* 1. Servicio */}
        <fieldset>
          <legend className="mb-4 font-heading text-2xl tracking-wide text-ink">
            <span className="text-accent">01.</span> Elige tu servicio
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {SERVICIOS.map((s) => (
              <label
                key={s.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                  servicioId === s.id
                    ? "border-ink bg-stone-50 ring-1 ring-ink"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                <input
                  type="radio"
                  name="servicio"
                  value={s.id}
                  checked={servicioId === s.id}
                  onChange={() => setServicioId(s.id)}
                  className="sr-only"
                />
                <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-stone-200 bg-white">
                  <ServiceIcon name={s.icono} className="h-6 w-6" aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-ink">
                    {s.nombre}
                  </span>
                  <span className="block text-xs text-stone-500">
                    {s.duracion} min · {formatCOP(s.precio)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* 2. Barbero */}
        <fieldset>
          <legend className="mb-4 font-heading text-2xl tracking-wide text-ink">
            <span className="text-accent">02.</span> Elige tu barbero
          </legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <BarberOption
              activo={barberoId === "cualquiera"}
              onClick={() => setBarberoId("cualquiera")}
              iniciales={<Star className="h-4 w-4" aria-hidden />}
              nombre="Cualquiera"
              detalle="El primero disponible"
            />
            {BARBEROS.map((b) => (
              <BarberOption
                key={b.id}
                activo={barberoId === b.id}
                onClick={() => setBarberoId(b.id)}
                iniciales={b.iniciales}
                nombre={b.nombre}
                detalle={b.especialidad}
              />
            ))}
          </div>
        </fieldset>

        {/* 3. Fecha y hora */}
        <fieldset>
          <legend className="mb-4 font-heading text-2xl tracking-wide text-ink">
            <span className="text-accent">03.</span> Fecha y hora
          </legend>
          <div className="max-w-xs">
            <label htmlFor="fecha" className="field-label">
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              min={hoy()}
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setHora("");
              }}
              className="field-input"
            />
            {errores.fecha && <ErrorMsg>{errores.fecha}</ErrorMsg>}
          </div>

          {fecha && (
            <div className="mt-5">
              <p className="field-label">Horario disponible</p>
              <div className="flex flex-wrap gap-2">
                {FRANJAS_HORARIAS.map((h) => {
                  const ocupado =
                    barberoId !== "cualquiera" &&
                    slotOcupado(fecha, h, barberoId);
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={ocupado}
                      onClick={() => setHora(h)}
                      className={`min-w-[4.25rem] rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        hora === h
                          ? "border-ink bg-ink text-white"
                          : ocupado
                          ? "cursor-not-allowed border-stone-200 text-stone-300 line-through"
                          : "border-stone-300 text-ink hover:border-ink"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
              {errores.hora && <ErrorMsg>{errores.hora}</ErrorMsg>}
            </div>
          )}
        </fieldset>

        {/* 4. Datos del cliente */}
        <fieldset>
          <legend className="mb-4 font-heading text-2xl tracking-wide text-ink">
            <span className="text-accent">04.</span> Tus datos
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cliente" className="field-label">
                Nombre completo
              </label>
              <input
                id="cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Juan Pérez"
                className="field-input"
              />
              {errores.cliente && <ErrorMsg>{errores.cliente}</ErrorMsg>}
            </div>
            <div>
              <label htmlFor="telefono" className="field-label">
                Teléfono
              </label>
              <input
                id="telefono"
                inputMode="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="300 123 4567"
                className="field-input"
              />
              {errores.telefono && <ErrorMsg>{errores.telefono}</ErrorMsg>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="field-label">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@correo.com"
                className="field-input"
              />
              {errores.email && <ErrorMsg>{errores.email}</ErrorMsg>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="nota" className="field-label">
                Nota (opcional)
              </label>
              <textarea
                id="nota"
                rows={3}
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="¿Algo que debamos saber?"
                className="field-input resize-none"
              />
            </div>
          </div>
        </fieldset>
      </form>

      {/* Resumen */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card">
          <h3 className="font-heading text-xl tracking-wide text-ink">
            Resumen de tu cita
          </h3>
          <dl className="mt-5 space-y-3 text-sm">
            <ResumenFila etiqueta="Servicio" valor={servicio.nombre} />
            <ResumenFila etiqueta="Duración" valor={`${servicio.duracion} min`} />
            <ResumenFila
              etiqueta="Barbero"
              valor={barbero ? barbero.nombre : "Cualquiera disponible"}
            />
            <ResumenFila
              etiqueta="Fecha"
              valor={fecha ? formatoFecha(fecha) : "—"}
            />
            <ResumenFila etiqueta="Hora" valor={hora || "—"} />
          </dl>
          <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4">
            <span className="text-sm text-stone-500">Total</span>
            <span className="font-heading text-3xl text-ink">
              {formatCOP(servicio.precio)}
            </span>
          </div>
          <button
            type="submit"
            onClick={enviar}
            className="btn-primary mt-6 w-full"
          >
            Confirmar reserva
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <p className="mt-3 text-center text-xs text-stone-400">
            Pago en el establecimiento · Cancela gratis hasta 2h antes
          </p>
        </div>
      </aside>

      {/* Barra de acción fija en móvil: total + confirmar siempre visibles */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="container-page flex items-center gap-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-stone-500">
              {servicio.nombre}
              {hora ? ` · ${hora}` : ""}
            </p>
            <p className="font-heading text-2xl leading-none text-ink">
              {formatCOP(servicio.precio)}
            </p>
          </div>
          <button type="submit" onClick={enviar} className="btn-primary flex-none">
            Confirmar
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

function BarberOption({
  activo,
  onClick,
  iniciales,
  nombre,
  detalle,
}: {
  activo: boolean;
  onClick: () => void;
  iniciales: React.ReactNode;
  nombre: string;
  detalle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
        activo
          ? "border-ink bg-stone-50 ring-1 ring-ink"
          : "border-stone-200 hover:border-stone-400"
      }`}
    >
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ink font-heading text-lg text-white">
        {iniciales}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-ink">
          {nombre}
        </span>
        <span className="block truncate text-xs text-stone-500">{detalle}</span>
      </span>
    </button>
  );
}

function ResumenFila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-stone-500">{etiqueta}</dt>
      <dd className="text-right font-medium text-ink">{valor}</dd>
    </div>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs font-medium text-accent">{children}</p>;
}

function formatoFecha(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function Confirmacion({ reserva }: { reserva: Reserva }) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ink text-white">
        <Check className="h-9 w-9" aria-hidden />
      </div>
      <h2 className="mt-6 font-display text-4xl font-bold text-ink">
        ¡Reserva confirmada!
      </h2>
      <p className="mt-3 text-stone-600">
        Te enviamos los detalles a{" "}
        <span className="text-ink">{reserva.email}</span>. Te esperamos.
      </p>

      <div className="card mt-8 text-left">
        <p className="text-xs uppercase tracking-wider text-stone-400">
          Código de reserva
        </p>
        <p className="font-heading text-2xl tracking-widest text-accent">
          {reserva.id.toUpperCase()}
        </p>
        <dl className="mt-5 space-y-3 text-sm">
          <ResumenFila etiqueta="Servicio" valor={reserva.servicioNombre} />
          <ResumenFila etiqueta="Barbero" valor={reserva.barberoNombre} />
          <ResumenFila etiqueta="Fecha" valor={formatoFecha(reserva.fecha)} />
          <ResumenFila etiqueta="Hora" valor={reserva.hora} />
          <ResumenFila etiqueta="A nombre de" valor={reserva.cliente} />
          <ResumenFila etiqueta="Total" valor={formatCOP(reserva.precio)} />
        </dl>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="btn-outline">
          Volver al inicio
        </Link>
        <Link href="/reservar" className="btn-primary">
          Otra reserva
        </Link>
      </div>
    </div>
  );
}
