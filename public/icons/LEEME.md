# Iconos de Flaticon (opcional)

No pude descargar los iconos de Flaticon automáticamente: su web bloquea el
acceso automatizado (Cloudflare 403) y la descarga de SVG requiere iniciar
sesión. Por eso el sitio usa un set de iconos SVG propios (en
`components/icons.tsx`).

Si prefieres los de Flaticon, hazlo así (2 minutos):

1. Entra a https://www.flaticon.es/iconos-gratis/barberia
2. Abre el icono que quieras → botón **Descargar** → formato **SVG**.
3. Guarda cada archivo en esta carpeta (`public/icons/`) con estos nombres
   exactos (los que ya usa el sitio):

   - `scissors.svg`   → Corte clásico
   - `clippers.svg`   → Corte + barba (máquina)
   - `razor.svg`      → Afeitado a navaja
   - `brush.svg`      → Arreglo de barba (brocha)
   - `child.svg`      → Corte infantil
   - `bolt.svg`       → Diseños y líneas
   - `barber-pole.svg`→ Logo / marca

4. Avísame ("ya puse los SVG en public/icons") y los cableo en el sitio, o
   úsalos directamente así en cualquier componente:

   ```tsx
   {/* eslint-disable-next-line @next/next/no-img-element */}
   <img src="/icons/scissors.svg" alt="" className="h-7 w-7" />
   ```

## Atribución (importante)

La licencia gratuita de Flaticon **exige dar crédito** al autor. Si usas sus
iconos, hay que incluir algo como esto (por ejemplo en el footer):

> Iconos diseñados por [Autor] de [www.flaticon.es](https://www.flaticon.es)

Dime qué iconos usaste y agrego el crédito correcto en el footer.
