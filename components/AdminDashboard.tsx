"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  getReservas,
  addReserva,
  updateEstado,
  deleteReserva,
  type Reserva,
  type EstadoReserva,
} from "@/lib/bookings";
import {
  getGaleriaExtra,
  addGaleriaExtra,
  deleteGaleriaExtra,
  type GaleriaExtra,
} from "@/lib/store";
import {
  getEquipo,
  updateBarbero,
  addBarbero,
  deleteBarbero,
  resetEquipo,
  type BarberoPerfil,
  type ServicioBarbero,
} from "@/lib/team";
import { getAjustes, saveAjustes, type Ajustes } from "@/lib/settings";
import {
  formatCOP,
  BARBEROS,
  SERVICIOS,
  FRANJAS_HORARIAS,
} from "@/lib/data";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceIcon } from "@/components/icons";
import RevenueChart from "@/components/RevenueChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------------------------------- utils ---------------------------------- */

function redimensionar(file: File, maxW = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

const TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "agenda", label: "Agenda" },
  { id: "reservas", label: "Reservas" },
  { id: "clientes", label: "Clientes" },
  { id: "caja", label: "Caja" },
  { id: "equipo", label: "Equipo" },
  { id: "ajustes", label: "Ajustes" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const hoyISO = () => {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
};

const METODOS = ["Efectivo", "Nequi", "Tarjeta"] as const;
// Método de pago demo, determinista por id de reserva
function metodoPago(id: string): (typeof METODOS)[number] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return METODOS[h % METODOS.length];
}

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

/* --------------------------------- principal --------------------------------- */

export default function AdminDashboard() {
  const [tab, setTab] = useState<TabId>("resumen");

  return (
    <div>
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-ink/15">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px whitespace-nowrap border-b-2 px-5 py-3 font-heading text-lg tracking-wide transition-colors ${
              tab === t.id
                ? "border-accent text-ink"
                : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "resumen" && <ResumenPanel />}
      {tab === "agenda" && <AgendaPanel />}
      {tab === "reservas" && <ReservasPanel />}
      {tab === "clientes" && <ClientesPanel />}
      {tab === "caja" && <CajaPanel />}
      {tab === "equipo" && <EquipoPanel />}
      {tab === "ajustes" && <AjustesPanel />}
    </div>
  );
}

/* --------------------------------- Resumen --------------------------------- */

function useReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
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
  return reservas;
}

function ResumenPanel() {
  const reservas = useReservas();
  const stats = useMemo(
    () => ({
      total: reservas.length,
      pendientes: reservas.filter((r) => r.estado === "pendiente").length,
      confirmadas: reservas.filter((r) => r.estado === "confirmada").length,
      ingresos: reservas
        .filter((r) => r.estado === "completada")
        .reduce((s, r) => s + r.precio, 0),
    }),
    [reservas]
  );

  const porBarbero = useMemo(() => {
    const map = new Map<string, { reservas: number; ingresos: number }>();
    for (const r of reservas) {
      if (/cualquier/i.test(r.barberoNombre)) continue;
      const cur = map.get(r.barberoNombre) ?? { reservas: 0, ingresos: 0 };
      cur.reservas += 1;
      if (r.estado === "completada") cur.ingresos += r.precio;
      map.set(r.barberoNombre, cur);
    }
    return [...map.entries()].sort((a, b) => b[1].ingresos - a[1].ingresos);
  }, [reservas]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard etiqueta="Reservas totales" valor={String(stats.total)} />
        <StatCard etiqueta="Pendientes" valor={String(stats.pendientes)} />
        <StatCard etiqueta="Confirmadas" valor={String(stats.confirmadas)} />
        <StatCard
          etiqueta="Ingresos (completadas)"
          valor={formatCOP(stats.ingresos)}
          destacado
        />
      </div>
      <RevenueChart />
      <Card className="p-4 sm:p-6">
        <h3 className="font-heading text-lg tracking-wide text-ink">
          Desempeño por barbero
        </h3>
        {porBarbero.length === 0 ? (
          <p className="mt-2 text-sm text-ink/50">
            Aún no hay reservas asignadas a un barbero específico.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-ink/10">
            {porBarbero.map(([nombre, d]) => (
              <li
                key={nombre}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <span className="min-w-0 truncate font-medium text-ink">
                  {nombre}
                </span>
                <span className="flex flex-none items-center gap-4 text-sm">
                  <span className="text-ink/60">{d.reservas} reservas</span>
                  <span className="font-heading text-lg text-ink">
                    {formatCOP(d.ingresos)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  etiqueta,
  valor,
  destacado,
}: {
  etiqueta: string;
  valor: string;
  destacado?: boolean;
}) {
  return (
    <Card className={`p-4 sm:p-5 ${destacado ? "bg-navy" : ""}`}>
      <p
        className={`text-[10px] uppercase leading-tight tracking-wider sm:text-xs ${
          destacado ? "text-white/60" : "text-ink/50"
        }`}
      >
        {etiqueta}
      </p>
      <p
        className={`mt-1.5 font-heading text-2xl sm:text-3xl ${
          destacado ? "text-white" : "text-ink"
        }`}
      >
        {valor}
      </p>
    </Card>
  );
}

/* --------------------------------- Reservas --------------------------------- */

function ReservasPanel() {
  const reservas = useReservas();
  const [filtro, setFiltro] = useState<EstadoReserva | "todas">("todas");
  const [busqueda, setBusqueda] = useState("");
  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return [...reservas]
      .filter((r) => filtro === "todas" || r.estado === filtro)
      .filter(
        (r) =>
          !q ||
          `${r.cliente} ${r.telefono} ${r.servicioNombre} ${r.barberoNombre}`
            .toLowerCase()
            .includes(q)
      )
      .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`));
  }, [reservas, filtro, busqueda]);

  return (
    <div>
      <div className="mb-4">
        <Input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por cliente, teléfono, servicio o barbero…"
          className="max-w-md"
        />
      </div>
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

      {reservas.length === 0 ? (
        <EmptyState
          titulo="Aún no hay reservas"
          texto="Cuando un cliente reserve desde la web aparecerá aquí."
        />
      ) : visibles.length === 0 ? (
        <EmptyState titulo="Sin resultados" texto="No hay reservas con este estado." />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {visibles.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{r.cliente}</p>
                    <p className="text-xs text-ink/50">{r.telefono}</p>
                  </div>
                  <EstadoSelect id={r.id} estado={r.estado} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <Dato etiqueta="Servicio" valor={r.servicioNombre} />
                  <Dato etiqueta="Barbero" valor={r.barberoNombre} />
                  <Dato etiqueta="Fecha" valor={`${r.fecha} · ${r.hora}`} />
                  <Dato etiqueta="Precio" valor={formatCOP(r.precio)} />
                </div>
                <div className="mt-3 flex justify-end border-t border-ink/10 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-ink/50 hover:text-accent"
                    onClick={() => {
                      if (confirm(`¿Eliminar la reserva de ${r.cliente}?`))
                        deleteReserva(r.id);
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="hidden overflow-hidden md:block">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Barbero</TableHead>
                  <TableHead>Fecha y hora</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibles.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-medium text-ink">{r.cliente}</p>
                      <p className="text-xs text-ink/50">{r.telefono}</p>
                    </TableCell>
                    <TableCell>
                      {r.servicioNombre}
                      <p className="text-xs text-ink/50">{formatCOP(r.precio)}</p>
                    </TableCell>
                    <TableCell>{r.barberoNombre}</TableCell>
                    <TableCell>
                      {r.fecha}
                      <p className="text-xs text-ink/50">{r.hora}</p>
                    </TableCell>
                    <TableCell>
                      <EstadoSelect id={r.id} estado={r.estado} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-ink/50 hover:text-accent"
                        onClick={() => {
                          if (confirm(`¿Eliminar la reserva de ${r.cliente}?`))
                            deleteReserva(r.id);
                        }}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}

function EstadoSelect({ id, estado }: { id: string; estado: EstadoReserva }) {
  return (
    <Select value={estado} onValueChange={(v) => updateEstado(id, v as EstadoReserva)}>
      <SelectTrigger
        className={`h-8 w-[130px] flex-none rounded-lg border px-3 text-xs font-semibold capitalize ${ESTADO_ESTILO[estado]}`}
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
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-ink/50">{etiqueta}</p>
      <p className="truncate text-ink">{valor}</p>
    </div>
  );
}

/* ---------------------------------- Equipo ---------------------------------- */

const SUBTABS = ["Perfil", "Servicios", "Horario", "Galería"] as const;
type SubTab = (typeof SUBTABS)[number];

function EquipoPanel() {
  const [equipo, setEquipo] = useState<BarberoPerfil[]>([]);
  const [selId, setSelId] = useState<string | null>(null);
  const [sub, setSub] = useState<SubTab>("Perfil");

  useEffect(() => setEquipo(getEquipo()), []);

  const sel = equipo.find((b) => b.id === selId) ?? null;

  const guardar = (cambios: Partial<BarberoPerfil>) => {
    if (!sel) return;
    setEquipo(updateBarbero(sel.id, cambios));
  };

  if (!sel) {
    return (
      <div>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-ink/60">
            Elige un barbero para configurar su perfil, servicios, horario y galería.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEquipo(resetEquipo())}
          >
            Restaurar equipo
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {equipo.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelId(b.id);
                setSub("Perfil");
              }}
              className="group overflow-hidden rounded-2xl border border-ink/15 bg-cream-light text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.foto}
                  alt={b.nombre}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="font-heading text-lg tracking-wide text-ink">
                  {b.nombre}
                </p>
                <p className="text-xs italic text-accent">“{b.alias}”</p>
                <p className="mt-1 text-[11px] text-ink/50">
                  {b.servicios.length} servicios
                </p>
              </div>
            </button>
          ))}
          <button
            onClick={() => {
              const n = prompt("Nombre del nuevo barbero:");
              if (n && n.trim()) setEquipo(addBarbero(n.trim()));
            }}
            className="flex min-h-[180px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-ink/25 text-ink/50 transition-colors hover:border-ink hover:text-ink"
          >
            <span className="text-3xl">+</span>
            <span className="font-heading text-sm tracking-wide">
              Agregar barbero
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Cabecera del barbero */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setSelId(null)}>
          ← Equipo
        </Button>
        <div className="flex items-center gap-3">
          <span className="h-11 w-11 overflow-hidden rounded-full border border-ink/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sel.foto} alt={sel.nombre} className="h-full w-full object-cover" />
          </span>
          <div>
            <p className="font-heading text-xl tracking-wide text-ink">{sel.nombre}</p>
            <p className="text-xs italic text-accent">“{sel.alias}”</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-ink/50 hover:text-accent"
          onClick={() => {
            if (confirm(`¿Eliminar a ${sel.nombre} del equipo?`)) {
              setEquipo(deleteBarbero(sel.id));
              setSelId(null);
            }
          }}
        >
          Eliminar barbero
        </Button>
      </div>

      {/* Sub-tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-ink/15">
        {SUBTABS.map((s) => (
          <button
            key={s}
            onClick={() => setSub(s)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              sub === s
                ? "border-accent text-ink"
                : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {sub === "Perfil" && <PerfilTab barbero={sel} onSave={guardar} />}
      {sub === "Servicios" && <ServiciosTab barbero={sel} onSave={guardar} />}
      {sub === "Horario" && <HorarioTab barbero={sel} onSave={guardar} />}
      {sub === "Galería" && <GaleriaTab barberoId={sel.id} />}
    </div>
  );
}

function PerfilTab({
  barbero,
  onSave,
}: {
  barbero: BarberoPerfil;
  onSave: (c: Partial<BarberoPerfil>) => void;
}) {
  const [nombre, setNombre] = useState(barbero.nombre);
  const [alias, setAlias] = useState(barbero.alias);
  const [especialidad, setEspecialidad] = useState(barbero.especialidad);
  const [experiencia, setExperiencia] = useState(barbero.experiencia);
  const [descripcion, setDescripcion] = useState(barbero.descripcion);
  const [foto, setFoto] = useState(barbero.foto);
  const [ok, setOk] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFoto(await redimensionar(f, 700));
  };

  const guardar = () => {
    onSave({ nombre, alias, especialidad, experiencia, descripcion, foto });
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <div className="space-y-3">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-ink/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={foto} alt={nombre} className="h-full w-full object-cover" />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          className="block w-full text-xs text-ink/60 file:mr-3 file:rounded-lg file:border-0 file:bg-navy file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-navy-dark"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Nombre</Label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div>
          <Label>Alias</Label>
          <Input value={alias} onChange={(e) => setAlias(e.target.value)} />
        </div>
        <div>
          <Label>Especialidad</Label>
          <Input
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
          />
        </div>
        <div>
          <Label>Experiencia</Label>
          <Input
            value={experiencia}
            onChange={(e) => setExperiencia(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Descripción</Label>
          <Textarea
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <Button onClick={guardar}>Guardar perfil</Button>
          {ok && <Badge variant="emerald">Guardado ✓</Badge>}
        </div>
      </div>
    </div>
  );
}

function ServiciosTab({
  barbero,
  onSave,
}: {
  barbero: BarberoPerfil;
  onSave: (c: Partial<BarberoPerfil>) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [duracion, setDuracion] = useState("");

  const servicios = barbero.servicios;
  const setServicios = (lista: ServicioBarbero[]) => onSave({ servicios: lista });

  const editar = (id: string, campo: "precio" | "duracion", valor: string) =>
    setServicios(
      servicios.map((s) =>
        s.id === id ? { ...s, [campo]: Number(valor) || 0 } : s
      )
    );

  const agregar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !precio || !duracion) return;
    setServicios([
      ...servicios,
      {
        id: "srv_" + Math.random().toString(36).slice(2, 8),
        nombre: nombre.trim(),
        precio: Number(precio),
        duracion: Number(duracion),
        icono: "scissors",
      },
    ]);
    setNombre("");
    setPrecio("");
    setDuracion("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <Card className="divide-y divide-ink/10">
        {servicios.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 p-3 sm:p-4"
          >
            <span className="flex min-w-0 flex-1 basis-full items-center gap-2 sm:basis-auto">
              <ServiceIcon name={s.icono} className="h-4 w-4 flex-none" aria-hidden />
              <span className="truncate font-medium text-ink">{s.nombre}</span>
            </span>
            <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink/50">
              Precio
              <Input
                type="number"
                value={s.precio}
                onChange={(e) => editar(s.id, "precio", e.target.value)}
                className="h-9 w-28"
              />
            </label>
            <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink/50">
              Min
              <Input
                type="number"
                value={s.duracion}
                onChange={(e) => editar(s.id, "duracion", e.target.value)}
                className="h-9 w-16"
              />
            </label>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-ink/50 hover:text-accent"
              onClick={() => setServicios(servicios.filter((x) => x.id !== s.id))}
            >
              Eliminar
            </Button>
          </div>
        ))}
        {servicios.length === 0 && (
          <p className="p-4 text-sm text-ink/50">Sin servicios. Agrega uno →</p>
        )}
      </Card>

      <Card className="h-fit p-5">
        <form onSubmit={agregar} className="space-y-3">
          <h3 className="font-heading text-lg tracking-wide text-ink">
            Nuevo servicio
          </h3>
          <div>
            <Label>Nombre</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Precio</Label>
              <Input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </div>
            <div>
              <Label>Min</Label>
              <Input
                type="number"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Agregar
          </Button>
        </form>
      </Card>
    </div>
  );
}

function HorarioTab({
  barbero,
  onSave,
}: {
  barbero: BarberoPerfil;
  onSave: (c: Partial<BarberoPerfil>) => void;
}) {
  const [horario, setHorario] = useState(barbero.horario);
  const [ok, setOk] = useState(false);

  const editar = (i: number, horas: string) =>
    setHorario((prev) => prev.map((h, idx) => (idx === i ? { ...h, horas } : h)));

  const guardar = () => {
    onSave({ horario });
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  };

  return (
    <div className="max-w-xl">
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Día</TableHead>
              <TableHead>Horario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {horario.map((h, i) => (
              <TableRow key={h.dia}>
                <TableCell className="font-medium text-ink">{h.dia}</TableCell>
                <TableCell>
                  <Input
                    value={h.horas}
                    onChange={(e) => editar(i, e.target.value)}
                    className="h-9 max-w-[220px]"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={guardar}>Guardar horario</Button>
        {ok && <Badge variant="emerald">Guardado ✓</Badge>}
      </div>
    </div>
  );
}

function GaleriaTab({ barberoId }: { barberoId: string }) {
  const [items, setItems] = useState<GaleriaExtra[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const recargar = () =>
    setItems(getGaleriaExtra().filter((g) => g.barbero === barberoId));

  useEffect(recargar, [barberoId]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(await redimensionar(f));
  };

  const guardar = () => {
    if (!preview) return;
    addGaleriaExtra({
      src: preview,
      titulo: titulo.trim() || "Nuevo trabajo",
      barbero: barberoId,
    });
    recargar();
    setPreview(null);
    setTitulo("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Card className="h-fit space-y-3 p-5">
        <h3 className="font-heading text-lg tracking-wide text-ink">Agregar foto</h3>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          className="block w-full text-sm text-ink/60 file:mr-3 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-dark"
        />
        {preview && (
          <div className="aspect-square w-full overflow-hidden rounded-lg border border-ink/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
          </div>
        )}
        <div>
          <Label>Título</Label>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Degradado moderno"
          />
        </div>
        <Button className="w-full" disabled={!preview} onClick={guardar}>
          Agregar a su galería
        </Button>
        <p className="text-xs text-ink/40">
          Aparece en la galería pública filtrada por este barbero.
        </p>
      </Card>

      <div>
        {items.length === 0 ? (
          <EmptyState
            titulo="Sin fotos"
            texto="Sube trabajos de este barbero para mostrarlos en su portafolio."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((g) => (
              <div
                key={g.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-ink/15"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.titulo} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-2">
                  <p className="truncate text-xs font-semibold text-white">{g.titulo}</p>
                </div>
                <button
                  onClick={() => {
                    deleteGaleriaExtra(g.id);
                    recargar();
                  }}
                  className="absolute right-1.5 top-1.5 rounded-md bg-cream-light/90 px-2 py-0.5 text-[11px] font-semibold text-red-600 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Clientes --------------------------------- */

function ClientesPanel() {
  const reservas = useReservas();
  const [q, setQ] = useState("");

  const clientes = useMemo(() => {
    const map = new Map<
      string,
      {
        nombre: string;
        telefono: string;
        email: string;
        visitas: number;
        gastado: number;
        ultima: string;
      }
    >();
    for (const r of reservas) {
      const key = (r.email || r.telefono).toLowerCase();
      const cur =
        map.get(key) ??
        {
          nombre: r.cliente,
          telefono: r.telefono,
          email: r.email,
          visitas: 0,
          gastado: 0,
          ultima: "",
        };
      cur.visitas += 1;
      if (r.estado === "completada") cur.gastado += r.precio;
      const stamp = `${r.fecha} ${r.hora}`;
      if (stamp > cur.ultima) {
        cur.ultima = stamp;
        cur.nombre = r.cliente;
      }
      map.set(key, cur);
    }
    let arr = [...map.values()].sort((a, b) => b.visitas - a.visitas);
    const t = q.trim().toLowerCase();
    if (t)
      arr = arr.filter((c) =>
        `${c.nombre} ${c.telefono} ${c.email}`.toLowerCase().includes(t)
      );
    return arr;
  }, [reservas, q]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar cliente…"
          className="max-w-xs"
        />
        <p className="text-sm text-ink/60">{clientes.length} clientes</p>
      </div>

      {clientes.length === 0 ? (
        <EmptyState
          titulo="Sin clientes todavía"
          texto="Los clientes aparecen automáticamente a partir de las reservas."
        />
      ) : (
        <>
          {/* Móvil */}
          <div className="space-y-3 md:hidden">
            {clientes.map((c) => (
              <Card key={c.telefono + c.email} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate font-semibold text-ink">
                    {c.nombre}
                  </p>
                  <Badge variant="outline">{c.visitas} visitas</Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  <Dato etiqueta="Teléfono" valor={c.telefono} />
                  <Dato etiqueta="Gastado" valor={formatCOP(c.gastado)} />
                  <Dato etiqueta="Correo" valor={c.email} />
                  <Dato etiqueta="Última" valor={c.ultima} />
                </div>
              </Card>
            ))}
          </div>
          {/* Escritorio */}
          <Card className="hidden overflow-hidden md:block">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Gastado</TableHead>
                  <TableHead>Última</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((c) => (
                  <TableRow key={c.telefono + c.email}>
                    <TableCell className="font-medium text-ink">
                      {c.nombre}
                    </TableCell>
                    <TableCell>
                      {c.telefono}
                      <p className="text-xs text-ink/50">{c.email}</p>
                    </TableCell>
                    <TableCell>{c.visitas}</TableCell>
                    <TableCell className="font-heading text-ink">
                      {formatCOP(c.gastado)}
                    </TableCell>
                    <TableCell>{c.ultima}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}

/* --------------------------------- Ajustes --------------------------------- */

function AjustesPanel() {
  const [a, setA] = useState<Ajustes | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => setA(getAjustes()), []);
  if (!a) return null;

  const set = (k: keyof Ajustes, v: string) => setA({ ...a, [k]: v });
  const guardar = () => {
    saveAjustes(a);
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <Card className="space-y-4 p-5 sm:p-6">
        <h3 className="font-heading text-lg tracking-wide text-ink">
          Información del negocio
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Nombre</Label>
            <Input value={a.nombre} onChange={(e) => set("nombre", e.target.value)} />
          </div>
          <div>
            <Label>Eslogan</Label>
            <Input value={a.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Dirección</Label>
            <Input
              value={a.direccion}
              onChange={(e) => set("direccion", e.target.value)}
            />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input value={a.telefono} onChange={(e) => set("telefono", e.target.value)} />
          </div>
          <div>
            <Label>WhatsApp (solo números)</Label>
            <Input value={a.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Correo</Label>
            <Input value={a.email} onChange={(e) => set("email", e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <h3 className="font-heading text-lg tracking-wide text-ink">Redes sociales</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Instagram</Label>
            <Input
              value={a.instagram}
              onChange={(e) => set("instagram", e.target.value)}
            />
          </div>
          <div>
            <Label>Facebook</Label>
            <Input value={a.facebook} onChange={(e) => set("facebook", e.target.value)} />
          </div>
          <div>
            <Label>TikTok</Label>
            <Input value={a.tiktok} onChange={(e) => set("tiktok", e.target.value)} />
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={guardar}>Guardar ajustes</Button>
        {ok && <Badge variant="emerald">Guardado ✓</Badge>}
      </div>
    </div>
  );
}

/* ---------------------------------- Agenda ---------------------------------- */

const EJEMPLOS = [
  { b: "andres", h: "09:00", s: "corte-clasico", c: "Juan Pérez" },
  { b: "camilo", h: "10:00", s: "corte-barba", c: "Luis Gómez" },
  { b: "sofia", h: "11:00", s: "disenos-lineas", c: "Andrés Motta" },
  { b: "julian", h: "14:00", s: "afeitado-navaja", c: "Mateo Ruiz" },
  { b: "andres", h: "16:00", s: "corte-clasico", c: "Carlos Díaz" },
  { b: "camilo", h: "17:00", s: "arreglo-barba", c: "Felipe Soto" },
];

function sembrarEjemplos() {
  EJEMPLOS.forEach((e, i) => {
    const s = SERVICIOS.find((x) => x.id === e.s);
    const b = BARBEROS.find((x) => x.id === e.b);
    if (!s || !b) return;
    const r = addReserva({
      servicioId: s.id,
      servicioNombre: s.nombre,
      precio: s.precio,
      barberoId: b.id,
      barberoNombre: b.nombre,
      fecha: hoyISO(),
      hora: e.h,
      cliente: e.c,
      telefono: "300 000 0000",
      email: "",
    });
    updateEstado(r.id, i < 3 ? "completada" : "confirmada");
  });
}

type Prefill = { barberoId: string; hora: string; fecha: string } | null;

function AgendaPanel() {
  const reservas = useReservas();
  const [fecha, setFecha] = useState(hoyISO());
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<Prefill>(null);

  const delDia = reservas.filter(
    (r) => r.fecha === fecha && r.estado !== "cancelada"
  );
  const hoy = reservas.filter(
    (r) => r.fecha === hoyISO() && r.estado !== "cancelada"
  );
  const ingresosHoy = hoy
    .filter((r) => r.estado === "completada")
    .reduce((s, r) => s + r.precio, 0);
  const proxima = [...hoy].sort((a, b) => a.hora.localeCompare(b.hora))[0];

  const buscar = (hora: string, barberoId: string) =>
    delDia.find((r) => r.hora === hora && r.barberoId === barberoId);

  const abrirNueva = (p: Prefill) => {
    setPrefill(p);
    setOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Vista Hoy */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard etiqueta="Citas hoy" valor={String(hoy.length)} />
        <StatCard etiqueta="Ingresos hoy" valor={formatCOP(ingresosHoy)} destacado />
        <StatCard
          etiqueta="Próxima"
          valor={proxima ? proxima.hora : "—"}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div>
          <Label>Ver día</Label>
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-auto"
          />
        </div>
        <Button className="mt-5" onClick={() => abrirNueva(null)}>
          + Nueva reserva
        </Button>
        <Button
          variant="outline"
          className="mt-5"
          onClick={() => {
            sembrarEjemplos();
            setFecha(hoyISO());
          }}
        >
          Generar ejemplos de hoy
        </Button>
      </div>

      {/* Móvil: lista del día */}
      <div className="space-y-2 md:hidden">
        {delDia.length === 0 ? (
          <EmptyState titulo="Día libre" texto="No hay citas para esta fecha." />
        ) : (
          [...delDia]
            .sort((a, b) => a.hora.localeCompare(b.hora))
            .map((r) => (
              <Card key={r.id} className="flex items-center gap-3 p-3">
                <span className="font-heading text-lg text-accent">{r.hora}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{r.cliente}</p>
                  <p className="truncate text-xs text-ink/60">
                    {r.servicioNombre} · {r.barberoNombre}
                  </p>
                </div>
              </Card>
            ))
        )}
      </div>

      {/* Escritorio: grilla por barbero */}
      <div className="hidden overflow-x-auto md:block">
        <div
          className="grid min-w-[640px] gap-1.5"
          style={{
            gridTemplateColumns: `64px repeat(${BARBEROS.length}, minmax(140px, 1fr))`,
          }}
        >
          <div />
          {BARBEROS.map((b) => (
            <div
              key={b.id}
              className="pb-1 text-center font-heading text-sm tracking-wide text-ink"
            >
              {b.nombre.split(" ")[0]}
            </div>
          ))}
          {FRANJAS_HORARIAS.map((slot) => (
            <Fragment key={slot}>
              <div className="flex items-center text-xs font-semibold text-ink/50">
                {slot}
              </div>
              {BARBEROS.map((b) => {
                const r = buscar(slot, b.id);
                return r ? (
                  <div
                    key={b.id}
                    className="rounded-lg border border-accent/30 bg-accent/10 p-2 text-left"
                  >
                    <p className="truncate text-xs font-semibold text-ink">
                      {r.cliente}
                    </p>
                    <p className="truncate text-[11px] text-ink/60">
                      {r.servicioNombre}
                    </p>
                  </div>
                ) : (
                  <button
                    key={b.id}
                    onClick={() =>
                      abrirNueva({ barberoId: b.id, hora: slot, fecha })
                    }
                    className="rounded-lg border border-dashed border-ink/15 p-2 text-[11px] text-ink/30 transition-colors hover:border-ink hover:text-ink/60"
                  >
                    libre
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <NuevaReservaDialog open={open} onOpenChange={setOpen} prefill={prefill} />
    </div>
  );
}

function NuevaReservaDialog({
  open,
  onOpenChange,
  prefill,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  prefill: Prefill;
}) {
  const [servicioId, setServicioId] = useState(SERVICIOS[0].id);
  const [barberoId, setBarberoId] = useState(BARBEROS[0].id);
  const [fecha, setFecha] = useState(hoyISO());
  const [hora, setHora] = useState(FRANJAS_HORARIAS[0]);
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    if (open) {
      setServicioId(SERVICIOS[0].id);
      setBarberoId(prefill?.barberoId ?? BARBEROS[0].id);
      setFecha(prefill?.fecha ?? hoyISO());
      setHora(prefill?.hora ?? FRANJAS_HORARIAS[0]);
      setCliente("");
      setTelefono("");
    }
  }, [open, prefill]);

  const crear = () => {
    const s = SERVICIOS.find((x) => x.id === servicioId);
    const b = BARBEROS.find((x) => x.id === barberoId);
    if (!s || !b || !cliente.trim()) return;
    addReserva({
      servicioId: s.id,
      servicioNombre: s.nombre,
      precio: s.precio,
      barberoId: b.id,
      barberoNombre: b.nombre,
      fecha,
      hora,
      cliente: cliente.trim(),
      telefono: telefono.trim() || "—",
      email: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="space-y-3 p-5">
          <DialogTitle>Nueva reserva</DialogTitle>
          <div>
            <Label>Servicio</Label>
            <Select value={servicioId} onValueChange={setServicioId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICIOS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nombre} · {formatCOP(s.precio)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Barbero</Label>
              <Select value={barberoId} onValueChange={setBarberoId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BARBEROS.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hora</Label>
              <Select value={hora} onValueChange={setHora}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FRANJAS_HORARIAS.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Fecha</Label>
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Cliente</Label>
              <Input value={cliente} onChange={(e) => setCliente(e.target.value)} />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
          </div>
          <Button className="w-full" onClick={crear}>
            Crear reserva
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------------- Caja ----------------------------------- */

function CajaPanel() {
  const reservas = useReservas();
  const [equipo, setEquipo] = useState<BarberoPerfil[]>([]);
  useEffect(() => setEquipo(getEquipo()), []);

  const completadasHoy = reservas.filter(
    (r) => r.fecha === hoyISO() && r.estado === "completada"
  );
  const totalHoy = completadasHoy.reduce((s, r) => s + r.precio, 0);
  const porMetodo = METODOS.map((m) => ({
    metodo: m,
    total: completadasHoy
      .filter((r) => metodoPago(r.id) === m)
      .reduce((s, r) => s + r.precio, 0),
  }));

  const completadas = reservas.filter((r) => r.estado === "completada");
  const ticketProm =
    completadas.length > 0
      ? Math.round(completadas.reduce((s, r) => s + r.precio, 0) / completadas.length)
      : 0;

  const topServicio = useMemo(() => {
    const map = new Map<string, number>();
    reservas
      .filter((r) => r.estado !== "cancelada")
      .forEach((r) => map.set(r.servicioNombre, (map.get(r.servicioNombre) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1])[0];
  }, [reservas]);

  const horasPico = useMemo(() => {
    const map = new Map<string, number>();
    reservas
      .filter((r) => r.estado !== "cancelada")
      .forEach((r) => map.set(r.hora, (map.get(r.hora) ?? 0) + 1));
    const max = Math.max(1, ...map.values());
    return FRANJAS_HORARIAS.map((h) => ({ hora: h, n: map.get(h) ?? 0, max }));
  }, [reservas]);

  const setComision = (id: string, v: string) =>
    setEquipo(updateBarbero(id, { comision: Math.max(0, Math.min(100, Number(v) || 0)) }));

  const ingresosBarbero = (nombre: string) =>
    completadas.filter((r) => r.barberoNombre === nombre).reduce((s, r) => s + r.precio, 0);

  return (
    <div className="space-y-6">
      {/* Caja del día */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg tracking-wide text-ink">
            Caja de hoy
          </h3>
          <span className="font-heading text-2xl text-ink">{formatCOP(totalHoy)}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {porMetodo.map((m) => (
            <div key={m.metodo} className="rounded-lg border border-ink/10 bg-cream-dark/40 p-3">
              <p className="text-[11px] uppercase tracking-wider text-ink/50">
                {m.metodo}
              </p>
              <p className="mt-1 font-heading text-lg text-ink">{formatCOP(m.total)}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink/40">
          {completadasHoy.length} servicios completados hoy · método de pago demo.
        </p>
      </Card>

      {/* Comisiones */}
      <Card className="p-4 sm:p-6">
        <h3 className="font-heading text-lg tracking-wide text-ink">
          Comisiones por barbero
        </h3>
        <div className="mt-3 divide-y divide-ink/10">
          {equipo.map((b) => {
            const ing = ingresosBarbero(b.nombre);
            const pago = Math.round((ing * b.comision) / 100);
            return (
              <div
                key={b.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3"
              >
                <span className="basis-full font-medium text-ink sm:basis-auto sm:flex-1">
                  {b.nombre}
                </span>
                <span className="text-sm text-ink/60">
                  Ingresos: {formatCOP(ing)}
                </span>
                <label className="flex items-center gap-1.5 text-xs text-ink/50">
                  %
                  <Input
                    type="number"
                    value={b.comision}
                    onChange={(e) => setComision(b.id, e.target.value)}
                    className="h-9 w-20"
                  />
                </label>
                <span className="ml-auto font-heading text-lg text-accent">
                  {formatCOP(pago)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Reportes */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-4 sm:p-6">
          <p className="text-xs uppercase tracking-wider text-ink/50">
            Ticket promedio
          </p>
          <p className="mt-1 font-heading text-3xl text-ink">{formatCOP(ticketProm)}</p>
          <p className="mt-3 text-xs uppercase tracking-wider text-ink/50">
            Servicio más vendido
          </p>
          <p className="mt-1 font-heading text-xl text-ink">
            {topServicio ? `${topServicio[0]} (${topServicio[1]})` : "—"}
          </p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-xs uppercase tracking-wider text-ink/50">
            Horas pico
          </p>
          <div className="mt-3 space-y-1.5">
            {horasPico.map((h) => (
              <div key={h.hora} className="flex items-center gap-2">
                <span className="w-10 text-xs text-ink/50">{h.hora}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream-dark">
                  <div
                    className="h-full rounded-full bg-navy"
                    style={{ width: `${(h.n / h.max) * 100}%` }}
                  />
                </div>
                <span className="w-5 text-right text-xs text-ink/60">{h.n}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function EmptyState({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/25 py-16 text-center">
      <h3 className="font-heading text-xl tracking-wide text-ink">{titulo}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink/60">{texto}</p>
    </div>
  );
}
