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

const SERVICIOS_KEY = "barberia:servicios";

const ESTADOS: { valor: EstadoReserva | "todas"; etiqueta: string }[] = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "pendiente", etiqueta: "Pendientes" },
  { valor: "confirmada", etiqueta: "Confirmadas" },
  { valor: "completada", etiqueta: "Completadas" },
  { valor: "cancelada", etiqueta: "Canceladas" },
];

const ESTADO_ESTILO: Record<EstadoReserva, string> = {
  pendiente: "bg-amber-50 text-amber-700 border-amber-200",
  confirmada: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completada: "bg-sky-50 text-sky-700 border-sky-200",
  cancelada: "bg-red-50 text-red-700 border-red-200",
};

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
    <div className="card">
      <p className="text-xs uppercase tracking-wider text-stone-400">
        {etiqueta}
      </p>
      <p className="mt-2 font-heading text-3xl text-ink">{valor}</p>
    </div>
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
          <button
            key={e.valor}
            onClick={() => setFiltro(e.valor)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              filtro === e.valor
                ? "border-ink bg-ink text-white"
                : "border-stone-300 text-stone-600 hover:border-ink"
            }`}
          >
            {e.etiqueta}
          </button>
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
        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Servicio</th>
                <th className="px-4 py-3 font-semibold">Barbero</th>
                <th className="px-4 py-3 font-semibold">Fecha y hora</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
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
                    <select
                      value={r.estado}
                      onChange={(e) =>
                        updateEstado(r.id, e.target.value as EstadoReserva)
                      }
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize outline-none ${ESTADO_ESTILO[r.estado]}`}
                    >
                      <option value="pendiente">pendiente</option>
                      <option value="confirmada">confirmada</option>
                      <option value="completada">completada</option>
                      <option value="cancelada">cancelada</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la reserva de ${r.cliente}?`))
                          deleteReserva(r.id);
                      }}
                      className="text-xs font-semibold text-stone-500 hover:text-accent"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <div className="overflow-x-auto rounded-2xl border border-stone-200">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Servicio</th>
              <th className="px-4 py-3 font-semibold">Duración</th>
              <th className="px-4 py-3 font-semibold">Precio</th>
              <th className="px-4 py-3 font-semibold text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {servicios.map((s) => (
              <tr key={s.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2.5">
                    <ServiceIcon
                      name={s.icono}
                      className="h-4 w-4 text-ink"
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
                  <button
                    onClick={() =>
                      persistir(servicios.filter((x) => x.id !== s.id))
                    }
                    className="text-xs font-semibold text-stone-500 hover:text-accent"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <form onSubmit={agregar} className="card space-y-4">
          <h3 className="font-heading text-xl tracking-wide text-ink">
            Nuevo servicio
          </h3>
          <div>
            <label htmlFor="s-nombre" className="field-label">
              Nombre
            </label>
            <input
              id="s-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Corte + mascarilla"
              className="field-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="s-precio" className="field-label">
                Precio (COP)
              </label>
              <input
                id="s-precio"
                type="number"
                min="0"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="40000"
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="s-duracion" className="field-label">
                Min
              </label>
              <input
                id="s-duracion"
                type="number"
                min="5"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                placeholder="30"
                className="field-input"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            Agregar servicio
          </button>
        </form>

        <button
          onClick={() => {
            window.localStorage.removeItem(SERVICIOS_KEY);
            setServicios(SERVICIOS);
          }}
          className="btn-outline w-full !py-2.5 text-xs"
        >
          Restaurar servicios originales
        </button>
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
