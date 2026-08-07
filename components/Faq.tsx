import { Reveal } from "@/components/Reveal";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const PREGUNTAS = [
  {
    q: "¿Necesito reservar o puedo llegar sin cita?",
    a: "Puedes llegar sin cita, pero reservar en línea te garantiza tu horario y tu barbero preferido sin esperas. Toma menos de un minuto.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos efectivo, tarjetas débito/crédito, Nequi y Bancolombia. El pago se realiza en el establecimiento al terminar tu servicio.",
  },
  {
    q: "¿Puedo cancelar o reprogramar mi cita?",
    a: "Claro. Puedes cancelar o reprogramar sin costo hasta 2 horas antes de tu cita escribiéndonos por WhatsApp.",
  },
  {
    q: "¿Cuánto dura un corte?",
    a: "Depende del servicio: un corte clásico toma unos 30 minutos y el combo corte + barba alrededor de 45. Cada servicio muestra su duración en la carta de precios.",
  },
  {
    q: "¿Atienden niños?",
    a: "Sí, tenemos corte infantil en un ambiente tranquilo y con mucha paciencia para los más pequeños.",
  },
  {
    q: "¿Dónde están ubicados?",
    a: "Estamos en la Calle 85 #12-34, Chapinero, Bogotá. Abajo encuentras el mapa y el botón para llegar.",
  },
];

export default function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PREGUNTAS.map((p) => ({
      "@type": "Question",
      name: p.q,
      acceptedAnswer: { "@type": "Answer", text: p.a },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-20 bg-stone-50 py-10 sm:py-14 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Reveal className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">
            <span className="h-px w-8 bg-accent" />
            Preguntas frecuentes
            <span className="h-px w-8 bg-accent" />
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-ink sm:text-4xl">
            Resolvemos tus dudas
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
          <Accordion type="single" collapsible className="w-full">
            {PREGUNTAS.map((p, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{p.q}</AccordionTrigger>
                <AccordionContent>{p.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Reveal>
    </section>
  );
}
