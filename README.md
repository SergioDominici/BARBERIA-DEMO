# Navaja & Co. — Barbería (Demo)

Sitio web demo de una barbería, construido con **Next.js 16 (App Router)**,
**React 19**, **TypeScript** y **Tailwind CSS**. Diseño oscuro y elegante,
enfocado en móvil, con iconos SVG propios (sin emojis ni librerías de iconos).

## Características

- **Landing completa**: hero, servicios, equipo de barberos, galería,
  testimonios y llamado a la acción.
- **Reserva en línea** (`/reservar`): elige servicio → barbero → fecha y hora →
  tus datos, con resumen en vivo y confirmación con código de reserva.
- **Panel de administración** (`/admin`): métricas, gestión de reservas
  (cambiar estado, eliminar, filtrar) y CRUD de servicios.
- **Mobile-first**: pensado para agendar desde el celular; el formulario de
  reserva tiene una **barra de acción fija** con el total y el botón de
  confirmar siempre visibles.
- **Iconografía propia**: set de iconos SVG line-art (tijeras, navaja, brocha,
  máquina, peine, poste de barbero…) en `components/icons.tsx`.
- **SEO y accesibilidad**: metadatos por página, HTML semántico, `lang="es-CO"`,
  labels y `aria-*` en los controles.

> Demo sin backend: las reservas y los servicios editados se guardan en el
> `localStorage` del navegador. No hay base de datos ni pagos reales.

## Estructura

```
BARBERIA/
├── app/
│   ├── layout.tsx        # layout raíz, fuentes, header/footer, metadata
│   ├── page.tsx          # home (compone las secciones)
│   ├── reservar/page.tsx # página de reserva
│   └── admin/page.tsx    # panel de administración
├── components/
│   ├── icons.tsx         # set de iconos SVG propios
│   ├── Header.tsx / Footer.tsx
│   ├── Hero / Services / Barbers / Gallery / Testimonials / CtaBooking
│   ├── BookingForm.tsx   # formulario de reserva (client)
│   └── AdminDashboard.tsx# panel admin (client)
└── lib/
    ├── data.ts           # servicios, barberos, horarios, formato COP
    └── bookings.ts       # almacenamiento de reservas (localStorage)
```

## Empezar

```bash
npm install
npm run dev      # http://localhost:3000
```

Otros comandos:

```bash
npm run build    # build de producción
npm run start    # servir el build
npm run lint     # linting
```

## Personalización rápida

- **Servicios / barberos / horarios**: edita `lib/data.ts`.
- **Colores y tipografías**: `tailwind.config.ts` (paleta `gold` / `ink`) y
  `app/globals.css`.
- **Iconos**: agrega o ajusta trazos en `components/icons.tsx`.

## Próximos pasos sugeridos

Base de datos real (Prisma + PostgreSQL), autenticación (NextAuth), pagos
(Stripe) y notificaciones por email/SMS — ver el informe de arquitectura del
proyecto para el detalle por fases.
