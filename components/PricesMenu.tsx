import { SERVICIOS, formatCOP } from "@/lib/data";
import { ServiceIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import BookingDialog from "@/components/BookingDialog";

export default function PricesMenu() {
  return (
    <section id="servicios" className="scroll-mt-20 py-10 sm:py-14 lg:py-20">
      <Reveal className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">
            <span className="h-px w-8 bg-accent" />
            Carta de precios
            <span className="h-px w-8 bg-accent" />
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-ink sm:text-4xl">
            Nuestros servicios
          </h2>
          <p className="mt-3 text-stone-600 sm:mt-4">
            Precios claros, sin sorpresas. Reserva el que quieras en segundos.
          </p>
        </div>

        <Card className="mx-auto mt-8 max-w-3xl overflow-hidden sm:mt-10">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Servicio</TableHead>
                <TableHead className="hidden sm:table-cell">Duración</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Reservar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SERVICIOS.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="hidden h-9 w-9 flex-none items-center justify-center rounded-lg border border-stone-200 bg-stone-50 sm:inline-flex">
                        <ServiceIcon
                          name={s.icono}
                          className="h-5 w-5"
                          aria-hidden
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-heading text-base tracking-wide text-ink sm:text-lg">
                          {s.nombre}
                          {s.destacado && (
                            <Badge variant="accent">Popular</Badge>
                          )}
                        </p>
                        <p className="text-xs text-stone-400 sm:hidden">
                          {s.duracion} min
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-stone-600 sm:table-cell">
                    {s.duracion} min
                  </TableCell>
                  <TableCell className="text-right font-heading text-base text-ink sm:text-lg">
                    {formatCOP(s.precio)}
                  </TableCell>
                  <TableCell className="text-right">
                    <BookingDialog servicioId={s.id}>
                      <Button variant="outline" size="sm">
                        Reservar
                      </Button>
                    </BookingDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Reveal>
    </section>
  );
}
