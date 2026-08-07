"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getReservas,
  updateEstado,
  deleteReserva,
  type Reserva,
  type EstadoReserva,
} from "@/lib/bookings";
import {
  getGaleriaExtra,
  addGaleriaExtra,
  deleteGaleriaExtra,
  getHorarios,
  saveHorarios,
  type GaleriaExtra,
  type HorarioItem,
} from "@/lib/store";
import {
  SERVICIOS,
  BARBEROS,
  HORARIOS,
  formatCOP,
  type Service,
} from "@/lib/data";
import { ServiceIcon } from "@/components/icons";
import RevenueChart from "@/components/RevenueChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const SERVICIOS_KEY = "barberia:servicios";

const TABS = [
  { id: "reservas", label: "Reservas" },
  { id: "servicios", label: "Servicios" },
  { id: "galeria", label: "Galería" },
  { id: "horarios", label: "Horarios" },
] as const;
type TabId = (typeof TABS)[number]["id"];

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
  const [tab, setTab] = useState<TabId>("reservas");
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
        .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`)),
    [reservas, filtro]
  );

  const stats = useMemo(() => {
    return {
      total: reservas.length,
      pendientes: reservas.filter((r) => r.estado === "pendiente").length,
      confirmadas: reservas.filter((r) => r.estado === "confirmada").length,
      ingresos: reservas
        .filter((r) => r.estado === "completada")
        .reduce((s, r) => s + r.precio, 0),
    };
  }, [reservas]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Estadísticas / ingresos */}
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

      {/* Gráfico de reservas */}
      <RevenueChart />

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-stone-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "border-ink text-ink"
                : "border-transparent text-stone-500 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "reservas" && (
        <ReservasPanel
          reservas={visibles}
          filtro={filtro}
          setFiltro={setFiltro}
          hayReservas={reservas.length > 0}
        />
      )}
      {tab === "servicios" && <ServiciosPanel />}
      {tab === "galeria" && <GaleriaPanel />}
      {tab === "horarios" && <HorariosPanel />}
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
    <Card className={`p-4 sm:p-5 ${destacado ? "bg-ink text-white" : ""}`}>
      <p
        className={`text-[10px] uppercase leading-tight tracking-wider sm:text-xs ${
          destacado ? "text-white/60" : "text-stone-400"
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
          texto="Cuando un cliente reserve desde la web aparecerá aquí."
        />
      ) : reservas.length === 0 ? (
        <EmptyState titulo="Sin resultados" texto="No hay reservas con este estado." />
      ) : (
        <>
          {/* Móvil: tarjetas cómodas */}
          <div className="space-y-3 md:hidden">
            {reservas.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">
                      {r.cliente}
                    </p>
                    <p className="text-xs text-stone-400">{r.telefono}</p>
                  </div>
                  <EstadoSelect id={r.id} estado={r.estado} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <Dato etiqueta="Servicio" valor={r.servicioNombre} />
                  <Dato etiqueta="Barbero" valor={r.barberoNombre} />
                  <Dato etiqueta="Fecha" valor={`${r.fecha} · ${r.hora}`} />
                  <Dato etiqueta="Precio" valor={formatCOP(r.precio)} />
                </div>
                <div className="mt-3 flex justify-end border-t border-stone-100 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-stone-500 hover:text-accent"
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

          {/* Escritorio: tabla */}
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
                {reservas.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-medium text-ink">{r.cliente}</p>
                      <p className="text-xs text-stone-400">{r.telefono}</p>
                    </TableCell>
                    <TableCell>
                      {r.servicioNombre}
                      <p className="text-xs text-stone-400">
                        {formatCOP(r.precio)}
                      </p>
                    </TableCell>
                    <TableCell>{r.barberoNombre}</TableCell>
                    <TableCell>
                      {r.fecha}
                      <p className="text-xs text-stone-400">{r.hora}</p>
                    </TableCell>
                    <TableCell>
                      <EstadoSelect id={r.id} estado={r.estado} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-stone-500 hover:text-accent"
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
    <Select
      value={estado}
      onValueChange={(v) => updateEstado(id, v as EstadoReserva)}
    >
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
      <p className="text-[11px] uppercase tracking-wider text-stone-400">
        {etiqueta}
      </p>
      <p className="truncate text-ink">{valor}</p>
    </div>
  );
}

/* ---------------------------------- Servicios ---------------------------------- */

function loadServicios(): Service[] {
  if (typeof window === "undefined") return SERVICIOS;
  try {
    const raw = localStorage.getItem(SERVICIOS_KEY);
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
    localStorage.setItem(SERVICIOS_KEY, JSON.stringify(lista));
  };

  const editar = (id: string, campo: "precio" | "duracion", valor: string) => {
    persistir(
      servicios.map((s) =>
        s.id === id ? { ...s, [campo]: Number(valor) || 0 } : s
      )
    );
  };

  const agregar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !precio || !duracion) return;
    persistir([
      ...servicios,
      {
        id: "srv_" + Math.random().toString(36).slice(2, 8),
        nombre: nombre.trim(),
        descripcion: "Servicio agregado desde el panel.",
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
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <Card className="overflow-hidden">
        <Table className="min-w-[520px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Servicio</TableHead>
              <TableHead>Precio (COP)</TableHead>
              <TableHead>Duración (min)</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicios.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <span className="inline-flex items-center gap-2.5">
                    <ServiceIcon name={s.icono} className="h-4 w-4" aria-hidden />
                    <span className="font-medium text-ink">{s.nombre}</span>
                  </span>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={s.precio}
                    onChange={(e) => editar(s.id, "precio", e.target.value)}
                    className="h-9 w-28"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={s.duracion}
                    onChange={(e) => editar(s.id, "duracion", e.target.value)}
                    className="h-9 w-20"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-stone-500 hover:text-accent"
                    onClick={() =>
                      persistir(servicios.filter((x) => x.id !== s.id))
                    }
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                <Label htmlFor="s-precio">Precio</Label>
                <Input
                  id="s-precio"
                  type="number"
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
            localStorage.removeItem(SERVICIOS_KEY);
            setServicios(SERVICIOS);
          }}
        >
          Restaurar servicios originales
        </Button>
      </div>
    </div>
  );
}

/* ---------------------------------- Galería ---------------------------------- */

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

function GaleriaPanel() {
  const [items, setItems] = useState<GaleriaExtra[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [barbero, setBarbero] = useState(BARBEROS[0].id);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setItems(getGaleriaExtra()), []);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(await redimensionar(file));
  };

  const guardar = () => {
    if (!preview) return;
    addGaleriaExtra({
      src: preview,
      titulo: titulo.trim() || "Nuevo trabajo",
      barbero,
    });
    setItems(getGaleriaExtra());
    setPreview(null);
    setTitulo("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const eliminar = (id: string) => {
    deleteGaleriaExtra(id);
    setItems(getGaleriaExtra());
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <Card className="h-fit space-y-4 p-6">
        <h3 className="font-heading text-xl tracking-wide text-ink">
          Agregar foto
        </h3>
        <div>
          <Label htmlFor="g-file">Imagen</Label>
          <input
            id="g-file"
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-stone-800"
          />
        </div>
        {preview && (
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-stone-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Vista previa"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div>
          <Label htmlFor="g-titulo">Título</Label>
          <Input
            id="g-titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Degradado moderno"
          />
        </div>
        <div>
          <Label>Barbero</Label>
          <Select value={barbero} onValueChange={setBarbero}>
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
        <Button className="w-full" disabled={!preview} onClick={guardar}>
          Agregar a la galería
        </Button>
        <p className="text-xs text-stone-400">
          Aparecerá en la galería pública (/galeria) filtrada por barbero.
        </p>
      </Card>

      <div>
        {items.length === 0 ? (
          <EmptyState
            titulo="Sin fotos agregadas"
            texto="Sube una imagen desde el panel de la izquierda para verla aquí y en la galería pública."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((g) => (
              <div
                key={g.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-stone-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={g.titulo}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-2">
                  <p className="truncate text-xs font-semibold text-white">
                    {g.titulo}
                  </p>
                  <p className="text-[10px] text-white/70">
                    {BARBEROS.find((b) => b.id === g.barbero)?.nombre.split(" ")[0]}
                  </p>
                </div>
                <button
                  onClick={() => eliminar(g.id)}
                  className="absolute right-1.5 top-1.5 rounded-md bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-red-600 opacity-0 transition-opacity group-hover:opacity-100"
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

/* ---------------------------------- Horarios ---------------------------------- */

function HorariosPanel() {
  const [horarios, setHorarios] = useState<HorarioItem[]>([]);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => setHorarios(getHorarios(HORARIOS)), []);

  const editar = (i: number, horas: string) =>
    setHorarios((prev) => prev.map((h, idx) => (idx === i ? { ...h, horas } : h)));

  const guardar = () => {
    saveHorarios(horarios);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Día</TableHead>
              <TableHead>Horario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {horarios.map((h, i) => (
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
        <Button onClick={guardar}>Guardar horarios</Button>
        {guardado && (
          <Badge variant="emerald">Guardado ✓</Badge>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setHorarios(HORARIOS)}
        >
          Restaurar
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 py-16 text-center">
      <h3 className="font-heading text-xl tracking-wide text-ink">{titulo}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">{texto}</p>
    </div>
  );
}
