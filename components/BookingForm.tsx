"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SERVICIOS, BARBEROS, FRANJAS_HORARIAS, formatCOP } from "@/lib/data";
import { addReserva, slotOcupado, type Reserva } from "@/lib/bookings";
import {
  ServiceIcon,
  Star,
  Check,
  ArrowRight,
  WhatsApp,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const PASOS = ["Servicio", "Barbero", "Fecha y hora", "Tus datos"];

const isoLocal = (d: Date) => {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
};

// Próximos N días de atención (domingo cerrado)
type DiaOpcion = { iso: string; dow: string; day: number; month: string };
function proximosDias(n: number): DiaOpcion[] {
  const dias: DiaOpcion[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; dias.length < n && i < n + 10; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    if (d.getDay() === 0) continue; // domingo cerrado
    dias.push({
      iso: isoLocal(d),
      dow: d.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", ""),
      day: d.getDate(),
      month: d.toLocaleDateString("es-CO", { month: "short" }).replace(".", ""),
    });
  }
  return dias;
}

const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function BookingForm({
  embedded = false,
  servicioId: servicioProp,
}: {
  embedded?: boolean;
  servicioId?: string;
} = {}) {
  const params = useSearchParams();
  const servParam = servicioProp ?? params.get("servicio") ?? "";
  const tieneServicioInicial = SERVICIOS.some((s) => s.id === servParam);
  const servicioInicial = tieneServicioInicial ? servParam : SERVICIOS[0].id;
  const barberoParam = params.get("barbero");
  const barberoInicial = BARBEROS.some((b) => b.id === barberoParam)
    ? (barberoParam as string)
    : "";

  const [paso, setPaso] = useState(
    tieneServicioInicial && barberoInicial
      ? 2 // ya trae servicio y barbero → directo a fecha
      : tieneServicioInicial
        ? 1 // trae servicio → elige barbero
        : 0 // desde cero (o solo barbero) → elige servicio
  );
  const [servicioId, setServicioId] = useState(servicioInicial);
  const [barberoId, setBarberoId] = useState<string>(barberoInicial);
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
  const dias = useMemo(() => proximosDias(14), []);

  const irArriba = () => {
    if (embedded) {
      document
        .getElementById("booking-scroll")
        ?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const avanzar = (n: number) => {
    setPaso(n);
    irArriba();
  };

  const elegirServicio = (id: string) => {
    setServicioId(id);
    // Si ya venía un barbero preseleccionado (desde su tarjeta), salta a fecha
    avanzar(barberoId ? 2 : 1);
  };
  const elegirBarbero = (id: string) => {
    setBarberoId(id);
    setHora("");
    avanzar(2);
  };
  const elegirHora = (h: string) => {
    setHora(h);
    avanzar(3);
  };

  const validarDatos = () => {
    const e: Record<string, string> = {};
    if (!cliente.trim()) e.cliente = "Escribe tu nombre.";
    if (!/^[0-9+\s()-]{7,}$/.test(telefono)) e.telefono = "Teléfono inválido.";
    if (!emailValido(email)) e.email = "Correo inválido.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const confirmar = () => {
    if (!validarDatos()) return;
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
    irArriba();
  };

  if (confirmada) return <Confirmacion reserva={confirmada} />;

  return (
    <div className={embedded ? "mx-auto max-w-xl" : "mx-auto max-w-xl pb-28"}>
      {/* Progreso */}
      <div className="mb-6">
        {paso > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => avanzar(paso - 1)}
            className="mb-4"
          >
            <ArrowRight className="h-4 w-4 rotate-180" aria-hidden />
            Atrás
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/">
              <ArrowRight className="h-4 w-4 rotate-180" aria-hidden />
              Volver al inicio
            </Link>
          </Button>
        )}
        <div className="flex gap-1.5">
          {PASOS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= paso ? "bg-navy" : "bg-cream-dark"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink/50">
          Paso {paso + 1} de {PASOS.length} · {PASOS[paso]}
        </p>
      </div>

      {/* Paso 0: Servicio */}
      {paso === 0 && (
        <Paso titulo="¿Qué servicio buscas?">
          <div className="grid grid-cols-2 gap-3">
            {SERVICIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => elegirServicio(s.id)}
                className={`flex flex-col rounded-2xl border p-4 text-left transition-colors ${
                  servicioId === s.id && paso === 0
                    ? "border-ink ring-1 ring-ink"
                    : "border-ink/15 hover:border-ink/40"
                }`}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-ink/15 bg-cream-dark">
                  <ServiceIcon name={s.icono} className="h-7 w-7" aria-hidden />
                </span>
                <span className="mt-3 font-heading text-lg leading-tight tracking-wide text-ink">
                  {s.nombre}
                </span>
                <span className="mt-1 text-xs text-ink/60">
                  {s.duracion} min
                </span>
                <span className="mt-2 font-heading text-lg text-ink">
                  {formatCOP(s.precio)}
                </span>
              </button>
            ))}
          </div>
        </Paso>
      )}

      {/* Paso 1: Barbero */}
      {paso === 1 && (
        <Paso titulo="Elige tu barbero">
          <div className="flex flex-col gap-2.5">
            <BarberRow
              activo={barberoId === "cualquiera"}
              onClick={() => elegirBarbero("cualquiera")}
              avatar={<Star className="h-5 w-5" aria-hidden />}
              nombre="Cualquiera disponible"
              detalle="El primero que esté libre"
            />
            {BARBEROS.map((b) => (
              <BarberRow
                key={b.id}
                activo={barberoId === b.id}
                onClick={() => elegirBarbero(b.id)}
                foto={b.foto}
                avatar={b.iniciales}
                nombre={b.nombre}
                detalle={b.especialidad}
              />
            ))}
          </div>
        </Paso>
      )}

      {/* Paso 2: Fecha y hora */}
      {paso === 2 && (
        <Paso titulo="¿Cuándo te viene bien?">
          <p className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/60">
            Elige el día
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {dias.map((d) => {
              const activo = fecha === d.iso;
              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => {
                    setFecha(d.iso);
                    setHora("");
                  }}
                  className={`flex flex-col items-center rounded-lg border px-2 py-2.5 transition-colors ${
                    activo
                      ? "border-ink bg-navy text-white"
                      : "border-ink/25 text-ink hover:border-ink"
                  }`}
                >
                  <span
                    className={`text-[11px] font-semibold uppercase ${
                      activo ? "text-white/70" : "text-ink/50"
                    }`}
                  >
                    {d.dow}
                  </span>
                  <span className="font-heading text-2xl leading-tight">
                    {d.day}
                  </span>
                  <span
                    className={`text-[10px] uppercase ${
                      activo ? "text-white/70" : "text-ink/50"
                    }`}
                  >
                    {d.month}
                  </span>
                </button>
              );
            })}
          </div>

          {fecha && (
            <div className="mt-6">
              <p className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/60">
                Elige una hora
              </p>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {FRANJAS_HORARIAS.map((h) => {
                  const ocupado =
                    barberoId !== "cualquiera" &&
                    slotOcupado(fecha, h, barberoId);
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={ocupado}
                      onClick={() => elegirHora(h)}
                      className={`rounded-lg border py-3 text-sm font-semibold transition-colors ${
                        ocupado
                          ? "cursor-not-allowed border-ink/15 text-ink/40 line-through"
                          : "border-ink/25 text-ink hover:border-ink active:bg-navy active:text-white"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Paso>
      )}

      {/* Paso 3: Datos + confirmar */}
      {paso === 3 && (
        <Paso titulo="Últimos datos y listo">
          {/* Resumen compacto */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-cream-dark p-4">
            <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-lg border border-ink/15 bg-cream-light">
              <ServiceIcon name={servicio.icono} className="h-6 w-6" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-semibold text-ink">
                {servicio.nombre}
              </p>
              <p className="truncate text-ink/60">
                {formatoFecha(fecha)} · {hora} ·{" "}
                {barbero ? barbero.nombre : "Cualquiera"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => avanzar(0)}
              className="flex-none text-xs font-semibold text-accent hover:underline"
            >
              Cambiar
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              confirmar();
            }}
            noValidate
            className="grid gap-4"
          >
            <div>
              <Label htmlFor="cliente">Nombre completo</Label>
              <Input
                id="cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Juan Pérez"
              />
              {errores.cliente && <ErrorMsg>{errores.cliente}</ErrorMsg>}
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono / WhatsApp</Label>
              <Input
                id="telefono"
                inputMode="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="300 123 4567"
              />
              {errores.telefono && <ErrorMsg>{errores.telefono}</ErrorMsg>}
            </div>
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@correo.com"
              />
              {errores.email && <ErrorMsg>{errores.email}</ErrorMsg>}
            </div>
            <div>
              <Label htmlFor="nota">Nota (opcional)</Label>
              <Input
                id="nota"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="¿Algo que debamos saber?"
              />
            </div>
            {/* submit accesible; el botón visible está en la barra fija */}
            <button type="submit" className="sr-only">
              Confirmar reserva
            </button>
          </form>
        </Paso>
      )}

      {/* Barra de acción: fija en página, pegajosa dentro del popup */}
      <div
        className={
          embedded
            ? "sticky bottom-0 z-40 -mx-5 mt-6 border-t border-ink/15 bg-cream-light/95 px-5 backdrop-blur"
            : "fixed inset-x-0 bottom-0 z-40 border-t border-ink/15 bg-cream-light/95 backdrop-blur"
        }
      >
        <div
          className={
            embedded
              ? "flex items-center gap-4 py-3"
              : "container-page mx-auto flex max-w-xl items-center gap-4 py-3"
          }
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-ink/60">{servicio.nombre}</p>
            <p className="font-heading text-2xl leading-none text-ink">
              {formatCOP(servicio.precio)}
            </p>
          </div>
          {paso < 3 ? (
            <span className="text-sm font-medium text-ink/50">
              {paso === 0
                ? "Toca un servicio"
                : paso === 1
                ? "Elige barbero"
                : fecha
                ? "Elige la hora"
                : "Elige la fecha"}
            </span>
          ) : (
            <Button type="button" onClick={confirmar} className="flex-none">
              Confirmar
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Paso({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-up">
      <h2 className="mb-5 font-display text-2xl font-bold text-ink sm:text-3xl">
        {titulo}
      </h2>
      {children}
    </div>
  );
}

function BarberRow({
  activo,
  onClick,
  avatar,
  foto,
  nombre,
  detalle,
}: {
  activo: boolean;
  onClick: () => void;
  avatar: React.ReactNode;
  foto?: string;
  nombre: string;
  detalle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
        activo ? "border-ink ring-1 ring-ink" : "border-ink/15 hover:border-ink/40"
      }`}
    >
      {foto ? (
        <span className="relative h-12 w-12 flex-none overflow-hidden rounded-full">
          <Image
            src={foto}
            alt={nombre}
            fill
            sizes="48px"
            className="object-cover object-center"
          />
        </span>
      ) : (
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-navy font-heading text-lg text-white">
          {avatar}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-ink">{nombre}</span>
        <span className="block truncate text-sm text-ink/60">{detalle}</span>
      </span>
      <ArrowRight className="h-5 w-5 flex-none text-ink/40" aria-hidden />
    </button>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs font-medium text-accent">{children}</p>;
}

function formatoFecha(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const dosDig = (n: number) => String(n).padStart(2, "0");

function descargarICS(reserva: Reserva) {
  const [y, m, d] = reserva.fecha.split("-").map(Number);
  const [hh, mm] = reserva.hora.split(":").map(Number);
  const dur = SERVICIOS.find((s) => s.id === reserva.servicioId)?.duracion ?? 45;
  const fin = new Date(y, m - 1, d, hh, mm + dur);
  const ini = `${y}${dosDig(m)}${dosDig(d)}T${dosDig(hh)}${dosDig(mm)}00`;
  const end = `${fin.getFullYear()}${dosDig(fin.getMonth() + 1)}${dosDig(
    fin.getDate()
  )}T${dosDig(fin.getHours())}${dosDig(fin.getMinutes())}00`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Navaja & Co.//Reserva//ES",
    "BEGIN:VEVENT",
    `UID:${reserva.id}@navajaco.com`,
    `DTSTART:${ini}`,
    `DTEND:${end}`,
    `SUMMARY:${reserva.servicioNombre} - Navaja & Co.`,
    `DESCRIPTION:Reserva con ${reserva.barberoNombre}. A nombre de ${reserva.cliente}.`,
    "LOCATION:Calle 85 #12-34, Chapinero, Bogotá",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reserva-navaja-${reserva.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function whatsappConfirmar(reserva: Reserva): string {
  const msg =
    `¡Hola Navaja & Co.! Confirmo mi reserva:\n` +
    `• Servicio: ${reserva.servicioNombre}\n` +
    `• Barbero: ${reserva.barberoNombre}\n` +
    `• Fecha: ${formatoFecha(reserva.fecha)} a las ${reserva.hora}\n` +
    `• A nombre de: ${reserva.cliente}`;
  return `https://wa.me/573001234567?text=${encodeURIComponent(msg)}`;
}

function Confirmacion({ reserva }: { reserva: Reserva }) {
  return (
    <div className="mx-auto max-w-lg py-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy text-white">
        <Check className="h-9 w-9" aria-hidden />
      </div>
      <h2 className="mt-6 font-display text-3xl font-bold text-ink sm:text-4xl">
        ¡Reserva confirmada!
      </h2>
      <p className="mt-3 text-ink/70">
        Te enviamos los detalles a{" "}
        <span className="text-ink">{reserva.email}</span>. Te esperamos.
      </p>

      <Card className="mt-8 p-6 text-left">
        <p className="text-xs uppercase tracking-wider text-ink/50">
          Código de reserva
        </p>
        <p className="font-heading text-2xl tracking-widest text-accent">
          {reserva.id.toUpperCase()}
        </p>
        <dl className="mt-5 space-y-3 text-sm">
          <Fila etiqueta="Servicio" valor={reserva.servicioNombre} />
          <Fila etiqueta="Barbero" valor={reserva.barberoNombre} />
          <Fila etiqueta="Fecha" valor={formatoFecha(reserva.fecha)} />
          <Fila etiqueta="Hora" valor={reserva.hora} />
          <Fila etiqueta="A nombre de" valor={reserva.cliente} />
          <Fila etiqueta="Total" valor={formatCOP(reserva.precio)} />
        </dl>
      </Card>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => descargarICS(reserva)}
        >
          Agregar al calendario
        </Button>
        <a
          href={whatsappConfirmar(reserva)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn inline-flex w-full bg-[#25D366] text-white shadow-sm hover:bg-[#1eb257]"
        >
          <WhatsApp className="h-4 w-4" aria-hidden />
          Confirmar por WhatsApp
        </a>
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">Volver al inicio</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/reservar">Hacer otra reserva</Link>
        </Button>
      </div>
    </div>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink/60">{etiqueta}</dt>
      <dd className="text-right font-medium text-ink">{valor}</dd>
    </div>
  );
}
