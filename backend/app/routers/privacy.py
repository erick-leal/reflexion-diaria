from fastapi import APIRouter
from fastapi.responses import HTMLResponse

router = APIRouter()

# Politica de privacidad publica (la pide Google Play). Si la app empieza a
# guardar o enviar algo nuevo (analitica, reportes de fallos, cuentas),
# actualizar este texto Y el formulario de seguridad de los datos en Play.
_PRIVACY_HTML = """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Política de privacidad · Un paso a la vez</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; max-width: 680px; margin: 0 auto;
         padding: 32px 20px 80px; line-height: 1.6; color: #14201B; background: #F6F8F6; }
  h1 { font-size: 26px; line-height: 1.25; }
  h2 { font-size: 18px; margin-top: 32px; }
  p, li { color: #3E4C46; }
  a { color: #1F6B52; }
  @media (prefers-color-scheme: dark) {
    body { color: #E8EFEB; background: #0F1513; }
    p, li { color: #B9C6C0; }
    a { color: #5CC49A; }
  }
</style>
</head>
<body>
<h1>Política de privacidad de Un paso a la vez</h1>
<p>Última actualización: 24 de noviembre de 2026</p>

<p>Un paso a la vez es una app gratuita que cada día te propone una frase, una
reflexión breve y una acción pequeña para hoy. Esta política explica qué
información maneja la app, para qué y cómo puedes borrarla.</p>

<h2>Sin cuentas ni datos personales</h2>
<p>La app no te pide nombre, correo, teléfono ni ninguna cuenta. No usa tu
ubicación, tus contactos, tu cámara ni tus fotos.</p>

<h2>Qué se guarda en nuestro servidor</h2>
<ul>
  <li><strong>Un identificador anónimo.</strong> La primera vez que abres la
  app se genera un código aleatorio que se guarda en tu teléfono. No está
  ligado a tu identidad: solo sirve para recordar tus favoritos y tu diario.</li>
  <li><strong>Tus favoritos</strong>: qué días marcaste con el corazón.</li>
  <li><strong>Tu diario</strong>: si marcaste «Lo hice» en la acción de un día
  y las notas que decidas escribir.</li>
  <li><strong>Fechas de uso</strong>: cuándo se creó el identificador y cuándo
  se usó por última vez, para mantener el servicio.</li>
</ul>
<p>Esta información se usa solo para mostrarte tu propio historial dentro de la
app. No se vende, no se comparte con terceros, no se usa para publicidad y no
se usa para entrenar modelos de inteligencia artificial.</p>

<h2>Qué se queda solo en tu teléfono</h2>
<ul>
  <li>Tus ajustes: apariencia (claro u oscuro) y la hora de los recordatorios.</li>
  <li>Los recordatorios: son notificaciones locales que programa tu propio
  teléfono; no pasan por nuestro servidor.</li>
  <li>Las imágenes que creas para compartir: se generan en el teléfono y solo
  salen de él si tú decides compartirlas.</li>
</ul>

<h2>Dónde se guarda y cómo se protege</h2>
<p>El servidor y la base de datos están alojados en Railway. La comunicación
entre la app y el servidor viaja cifrada (HTTPS).</p>

<h2>Cómo borrar tus datos</h2>
<p>En la app, ve a <strong>Ajustes → Borrar mis datos</strong>. Se eliminan de
inmediato de nuestro servidor tu identificador anónimo, tus favoritos y tu
diario, y la app empieza de cero con un identificador nuevo.</p>
<p>Si desinstalas la app sin hacer esto, el identificador se pierde y ya no hay
forma de asociar esos datos a ti. Si quieres que los borremos de todas formas,
escríbenos al correo de contacto.</p>

<h2>Menores de edad</h2>
<p>La app no está dirigida a menores de 13 años y no recoge a sabiendas datos
de niños.</p>

<h2>Cambios en esta política</h2>
<p>Si cambia lo que la app guarda, actualizaremos esta página y la fecha de
arriba.</p>

<h2>Contacto</h2>
<p><a href="mailto:eleal.escobar@gmail.com">eleal.escobar@gmail.com</a></p>
</body>
</html>
"""


@router.get("/privacy", response_class=HTMLResponse, include_in_schema=False)
def privacy_policy() -> str:
    return _PRIVACY_HTML
