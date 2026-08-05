"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getReservas,
  updateEstado,
  deleteReserva,
  type Reserva,
  type EstadoReserva,
} from "@/lib/bookings";
import { SERVICIOS, formatCOP, type Service } from "@/lib/data";
import { BarberPole, ServiceIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SERVICIOS_KEY = "barberia:servicios";

const ESTADOS: { valor: EstadoReserva | "todas"; etiqueta: string }[] = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "pendiente", etiqueta: "Pendientes" },
  { valor: "confirmada", etiqueta: "Confirmadas" },
  { valor: "completada", etiqueta: "Completadas" },
  { valor: "cancelada", etiqueta: "Canceladas" },
];

const ESTADO_ESTILO: Record<EstadoReserva, string> = {
  pendiente: "border-amber-200 bg-amber-50 text-amber-700",
  confirmada: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completada: "border-sky-200 bg-sky-50 text-sky-700",
  cancelada: "border-red-200 bg-red-50 text-red-700",
};

const ESTADO_OPCIONES: EstadoReserva[] = [
  "pendiente",
  "confirmada",
  "completada",
  "cancelada",
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<"reservas" | "servicios">("reservas");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtro, setFiltro] = useState<EstadoReserva | "todas">("todas");

  useEffect(() => {
    const cargar = () => setReservas(getReservas());
    cargar();
    window.addEventListener("barberia:reservas-updated", cargar);
    window.addEventListener("storage", cargar);
    return () => {
      window.removeEventListener("barberia:reservas-updated", cargar);
      window.removeEventListener("storage", cargar);
    };
  }, []);

  const visibles = useMemo(
    () =>
      [...reservas]
        .filter((r) => filtro === "todas" || r.estado === filtro)
        .sort((a, b) =>
          `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`)
        ),
    [reservas, filtro]
  );

  const stats = useMemo(() => {
    const activas = reservas.filter((r) => r.estado !== "cancelada");
    return {
      total: reservas.length,
      pendientes: reservas.filter((r) => r.estado === "pendiente").length,
      ingresos: activas
        .filter((r) => r.estado === "completada")
        .reduce((s, r) => s + r.precio, 0),
      confirmadas: reservas.filter((r) => r.estado === "confirmada").length,
    };
  }, [reservas]);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard etiqueta="Reservas totales" valor={String(stats.total)} />
        <StatCard etiqueta="Pendientes" valor={String(stats.pendientes)} />
        <StatCard etiqueta="Confirmadas" valor={String(stats.confirmadas)} />
        <StatCard
          etiqueta="Ingresos (completadas)"
          valor={formatCOP(stats.ingresos)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200">
        {(["reservas", "servicios"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold capitalize transition-colors ${
              tab === t
                ? "border-ink text-ink"
                : "border-transparent text-stone-500 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "reservas" ? (
        <ReservasPanel
          reservas={visibles}
          filtro={filtro}
          setFiltro={setFiltro}
          hayReservas={reservas.length > 0}
        />
      ) : (
        <ServiciosPanel />
      )}
    </div>
  );
}

function StatCard({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <Card className="p-6">
      <p className="text-xs uppercase tracking-wider text-stone-400">
        {etiqueta}
      </p>
      <p className="mt-2 font-heading text-3xl text-ink">{valor}</p>
    </Card>
  );
}

/* ---------------------------------- Reservas ---------------------------------- */

function ReservasPanel({
  reservas,
  filtro,
  setFiltro,
  hayReservas,
}: {
  reservas: Reserva[];
  filtro: EstadoReserva | "todas";
  setFiltro: (f: EstadoReserva | "todas") => void;
  hayReservas: boolean;
}) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {ESTADOS.map((e) => (
          <Button
            key={e.valor}
            size="sm"
            variant={filtro === e.valor ? "default" : "outline"}
            onClick={() => setFiltro(e.valor)}
          >
            {e.etiqueta}
          </Button>
        ))}
      </div>

      {!hayReservas ? (
        <EmptyState
          titulo="Aún no hay reservas"
          texto="Cuando un cliente reserve desde la web, aparecerá aquí. Prueba a crear una reserva de ejemplo."
        />
      ) : reservas.length === 0 ? (
        <EmptyState
          titulo="Sin resultados"
          texto="No hay reservas con este estado."
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Servicio</th>
                <th className="px-4 py-3 font-semibold">Barbero</th>
                <th className="px-4 py-3 font-semibold">Fecha y hora</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {reservas.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{r.cliente}</p>
                    <p className="text-xs text-stone-400">{r.telefono}</p>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {r.servicioNombre}
                    <p className="text-xs text-stone-400">
                      {formatCOP(r.precio)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{r.barberoNombre}</td>
                  <td className="px-4 py-3 text-stone-600">
                    {r.fecha}
                    <p className="text-xs text-stone-400">{r.hora}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={r.estado}
                      onValueChange={(v) =>
                        updateEstado(r.id, v as EstadoReserva)
                      }
                    >
                      <SelectTrigger
                        className={`h-8 w-[140px] rounded-full border px-3 text-xs font-semibold capitalize ${ESTADO_ESTILO[r.estado]}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADO_OPCIONES.map((op) => (
                          <SelectItem key={op} value={op}>
                            {op}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`¿Eliminar la reserva de ${r.cliente}?`))
                          deleteReserva(r.id);
                      }}
                      className="text-stone-500 hover:text-accent"
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

/* ---------------------------------- Servicios ---------------------------------- */

function loadServicios(): Service[] {
  if (typeof window === "undefined") return SERVICIOS;
  try {
    const raw = window.localStorage.getItem(SERVICIOS_KEY);
    if (raw) return JSON.parse(raw) as Service[];
  } catch {
    /* noop */
  }
  return SERVICIOS;
}

function ServiciosPanel() {
  const [servicios, setServicios] = useState<Service[]>([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [duracion, setDuracion] = useState("");

  useEffect(() => setServicios(loadServicios()), []);

  const persistir = (lista: Service[]) => {
    setServicios(lista);
    window.localStorage.setItem(SERVICIOS_KEY, JSON.stringify(lista));
  };

  const agregar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !precio || !duracion) return;
    const nuevo: Service = {
      id: "srv_" + Math.random().toString(36).slice(2, 8),
      nombre: nombre.trim(),
      descripcion: "Servicio agregado desde el panel de administración.",
      precio: Number(precio),
      duracion: Number(duracion),
      icono: "scissors",
    };
    persistir([...servicios, nuevo]);
    setNombre("");
    setPrecio("");
    setDuracion("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Servicio</th>
              <th className="px-4 py-3 font-semibold">Duración</th>
              <th className="px-4 py-3 font-semibold">Precio</th>
              <th className="px-4 py-3 text-right font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {servicios.map((s) => (
              <tr key={s.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2.5">
                    <ServiceIcon
                      name={s.icono}
                      className="h-4 w-4"
                      aria-hidden
                    />
                    <span className="font-medium text-ink">{s.nombre}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600">{s.duracion} min</td>
                <td className="px-4 py-3 font-medium text-ink">
                  {formatCOP(s.precio)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      persistir(servicios.filter((x) => x.id !== s.id))
                    }
                    className="text-stone-500 hover:text-accent"
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="space-y-4">
        <Card className="p-6">
          <form onSubmit={agregar} className="space-y-4">
            <h3 className="font-heading text-xl tracking-wide text-ink">
              Nuevo servicio
            </h3>
            <div>
              <Label htmlFor="s-nombre">Nombre</Label>
              <Input
                id="s-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Corte + mascarilla"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="s-precio">Precio (COP)</Label>
                <Input
                  id="s-precio"
                  type="number"
                  min="0"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="40000"
                />
              </div>
              <div>
                <Label htmlFor="s-duracion">Min</Label>
                <Input
                  id="s-duracion"
                  type="number"
                  min="5"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Agregar servicio
            </Button>
          </form>
        </Card>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            window.localStorage.removeItem(SERVICIOS_KEY);
            setServicios(SERVICIOS);
          }}
        >
          Restaurar servicios originales
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center">
      <BarberPole className="mx-auto h-10 w-10 text-stone-300" aria-hidden />
      <h3 className="mt-4 font-heading text-xl tracking-wide text-ink">
        {titulo}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">{texto}</p>
    </div>
  );
}
