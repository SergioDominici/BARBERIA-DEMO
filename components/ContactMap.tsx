import { HORARIOS } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { MapPin, Phone, ArrowRight } from "@/components/icons";

const DIRECCION = "Calle 85 #12-34, Chapinero, Bogotá";
const COORDS = "4.6709,-74.0630"; // Chapinero, Bogotá (demo)
const MAPA_EMBED = `https://www.google.com/maps?q=${COORDS}&z=15&output=embed`;
const COMO_LLEGAR = `https://www.google.com/maps/dir/?api=1&destination=${COORDS}`;

export default function ContactMap() {
  return (
    <section id="contacto" className="scroll-mt-20 bg-white py-10 sm:py-14 lg:py-20">
      <Reveal className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Contacto
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-ink sm:text-4xl">
            Cómo llegar
          </h2>
          <p className="mt-3 text-stone-600 sm:mt-4">
            Estamos en el corazón de Chapinero. Te esperamos.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-[1fr_1.3fr]">
          {/* Info + horarios */}
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-none text-accent" aria-hidden />
              <div>
                <p className="font-semibold text-ink">Dirección</p>
                <p className="text-sm text-stone-600">{DIRECCION}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 flex-none text-accent" aria-hidden />
              <div>
                <p className="font-semibold text-ink">Teléfono</p>
                <a
                  href="tel:+5713001234567"
                  className="text-sm text-stone-600 hover:text-ink"
                >
                  +57 300 123 4567
                </a>
              </div>
            </div>

            {/* Tabla de horarios */}
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Día</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {HORARIOS.map((h) => {
                    const cerrado = /cerrado/i.test(h.horas);
                    return (
                      <TableRow key={h.dia}>
                        <TableCell className="font-medium text-ink">
                          {h.dia}
                        </TableCell>
                        <TableCell>{h.horas}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                              cerrado ? "text-stone-400" : "text-emerald-600"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                cerrado ? "bg-stone-300" : "bg-emerald-500"
                              }`}
                            />
                            {cerrado ? "Cerrado" : "Abierto"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>

            <Button asChild className="w-full sm:w-auto">
              <a href={COMO_LLEGAR} target="_blank" rel="noopener noreferrer">
                Cómo llegar
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>

          {/* Mapa */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-card">
            <iframe
              src={MAPA_EMBED}
              title="Ubicación de Navaja & Co."
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full grayscale-[35%] sm:h-full sm:min-h-[360px]"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
