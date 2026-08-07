"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Card } from "@/components/ui/card";

type Punto = { label: string; cortes: number; barbas: number };

const PERIODOS = [
  { id: 7, label: "7 días" },
  { id: 30, label: "30 días" },
  { id: 90, label: "3 meses" },
];

// Datos de demo deterministas (misma forma siempre, sin aleatoriedad brusca)
function generar(dias: number): Punto[] {
  const out: Punto[] = [];
  const hoy = new Date();
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - i);
    const x = dias - i;
    const cortes = Math.round(
      7 + 4 * Math.sin(x / 2.6) + 3 * Math.abs(Math.sin(x * 0.9)) + (x % 5)
    );
    const barbas = Math.round(
      3 + 2.4 * Math.sin(x / 3.1 + 1) + 2 * Math.abs(Math.sin(x * 1.3))
    );
    out.push({
      label: d.toLocaleDateString("es-CO", { day: "numeric", month: "short" }),
      cortes: Math.max(0, cortes),
      barbas: Math.max(0, barbas),
    });
  }
  return out;
}

export default function RevenueChart() {
  const [periodo, setPeriodo] = useState(30);
  const [data, setData] = useState<Punto[]>([]);

  useEffect(() => setData(generar(periodo)), [periodo]);

  const total = useMemo(
    () => data.reduce((s, d) => s + d.cortes + d.barbas, 0),
    [data]
  );

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg tracking-wide text-ink sm:text-xl">
            Reservas por día
          </h3>
          <p className="text-xs text-ink/60 sm:text-sm">
            {total} reservas en los últimos {periodo} días
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-ink/15 p-0.5">
          {PERIODOS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriodo(p.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                periodo === p.id
                  ? "bg-navy text-white"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-3 flex gap-4 text-xs text-ink/60">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-navy" /> Cortes
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-accent" /> Barba y afeitado
        </span>
      </div>

      <div className="mt-2 h-[220px] w-full sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="fillCortes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16273f" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#16273f" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="fillBarbas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b3202e" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#b3202e" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#dcc9a0" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
              tick={{ fontSize: 11, fill: "#8a7657" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #dcc9a0",
                fontSize: 12,
                boxShadow: "0 8px 24px -12px rgba(20,20,20,0.2)",
              }}
              labelStyle={{ color: "#16273f", fontWeight: 600 }}
            />
            <Area
              dataKey="barbas"
              name="Barba y afeitado"
              type="monotone"
              stackId="a"
              stroke="#b3202e"
              strokeWidth={2}
              fill="url(#fillBarbas)"
            />
            <Area
              dataKey="cortes"
              name="Cortes"
              type="monotone"
              stackId="a"
              stroke="#16273f"
              strokeWidth={2}
              fill="url(#fillCortes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
