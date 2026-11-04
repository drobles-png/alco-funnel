// Textos de la página. Un cliente nuevo edita SOLO este archivo (y config/funnel.ts).
// Todo lo que está entre [corchetes] es un marcador: reemplazar con lo que dice el VSL del cliente.
// No inventar cifras, testimonios, garantías ni bonos.
import { BRAND_NAME, PERSON_NAME } from '@/config/funnel'

export const SEO = {
  landing: {
    title: `${BRAND_NAME} | Fumiga tu finca con tu propio dron, el día que tú decides`,
    description: 'Para agricultores de la Costa que dependen de un servicio externo para fumigar. Drones DJI Agras en stock, capacitación y respaldo de ALCO.',
  },
  video: { title: `Mira el video | ${BRAND_NAME}`, description: 'Fernando Alvear, de ALCO, explica por qué cada vez más agricultores compran su propio dron de fumigación.' },
  booking: { title: `Agenda tu reunión | ${BRAND_NAME}`, description: 'Elige el día y la hora.' },
  booked: { title: `Reunión confirmada | ${BRAND_NAME}`, description: 'Tu reunión está confirmada.' },
  noSpace: { title: `Todavía no es el momento | ${BRAND_NAME}`, description: 'Gracias por tu interés.' },
  pago: { title: `Confirma tu lugar | ${BRAND_NAME}`, description: 'Completa tu inscripción.' },
  confirmada: { title: `Inscripción confirmada | ${BRAND_NAME}`, description: 'Tu lugar está confirmado.' },
  privacy: { title: `Política de privacidad | ${BRAND_NAME}`, description: `Política de privacidad de ${BRAND_NAME}.` },
  legal: { title: `Aviso legal | ${BRAND_NAME}`, description: `Aviso legal de ${BRAND_NAME}.` },
}

// ── Landing (/) ───────────────────────────────────────────────────────────────
export const LANDING = {
  topbarTag: 'Drones de fumigación desde 2015',
  audience: ['Fincas de 30, 50 o 100 ha', 'Guayas, Los Ríos, El Oro y Manabí', 'Agricultores que hoy contratan el servicio'],
  headline: 'Deja de esperar al fumigador:',
  headlineAccent: 'fumiga tu finca el día que tú decides',
  sub: `El cultivo está listo, llamas al que te presta el servicio y no contesta, te cambia la fecha o llega tarde. ${PERSON_NAME} te cuenta cómo muchos agricultores de la Costa dejaron de pasar por eso.`,
  videoCaption: `${BRAND_NAME} · Video corto`,
  cta: 'Ver el video completo',
  ctaNote: 'Sin costo · Solo te pedimos tus datos para mostrártelo',

  pains: {
    eyebrow: 'El problema',
    title: 'Cuando dependes de un servicio externo, tu cosecha queda en manos de otro',
    items: [
      { icon: 'fa-calendar-xmark', title: 'Otro decide por ti', text: 'Decide cuándo viene, cuánto te cobra y cómo aplica. Y en el agro, el momento lo es todo.' },
      { icon: 'fa-bug', title: 'Dos o tres días cuestan caro', text: 'Un retraso le da ventaja a plagas, hongos y malezas. No se nota el día que fumigas: se nota en la cosecha.' },
      { icon: 'fa-cloud-showers-heavy', title: 'En temporada es peor', text: 'Todos fumigan al mismo tiempo. Con El Niño vienen más lluvia y más sigatoca, y el primero que queda esperando es el agricultor pequeño o mediano.' },
    ],
  },

  steps: {
    eyebrow: 'Con tu propio dron',
    title: 'Fumigas cuando tú decides, sin pedirle favor a nadie',
    items: [
      { title: 'Equipo en stock', text: 'DJI Agras T55, T70P y T100 listos para salir a tu finca. No esperas meses cuando ya estás en temporada.' },
      { title: 'Academia EAD', text: 'Si lo decides, te capacitamos: no solo a volar, también qué producto aplicar, a qué altura, a qué hora y en qué cultivo.' },
      { title: 'Respaldo cada temporada', text: 'Repuestos en stock, mantenimiento preventivo y equipo de respaldo, como generadores y cargadores, para que no pares.' },
    ],
    cta: 'Quiero ver el video',
  },

  fit: {
    eyebrow: 'Antes de seguir',
    title: '¿Es para ti?',
    items: [
      { yes: true, text: 'Tienes tu finca andando y ya sabes lo que es sacar una cosecha.' },
      { yes: true, text: 'Hoy dependes de que otro llegue a fumigar a tiempo y quieres dejar de hacerlo.' },
      { yes: false, text: 'No tienes finca o solo buscas contratar un servicio de fumigación.' },
    ],
  },

  closing: {
    eyebrow: 'Siguiente paso',
    title: 'Tu cosecha no puede seguir esperando al fumigador',
    sub: 'Mira el video y agendemos una reunión para conocer tu caso: tu cultivo, tus hectáreas y cómo fumigas hoy.',
    cta: 'Ver el video completo',
  },

  sticky: { title: 'Tu propio dron de fumigación', sub: `Video de ${PERSON_NAME}`, cta: 'Ver video' },
  disclaimer:
    'Los resultados dependen de cada caso. Este sitio no está respaldado por Meta Platforms, Inc. ni forma parte de Facebook.',
}

// ── Modal de registro ─────────────────────────────────────────────────────────
export const REGISTRO = {
  eyebrow: 'Tu propio dron de fumigación',
  title: 'Mira el video completo',
  sub: 'Déjanos tus datos y te mostramos el video. Al final puedes agendar una reunión con el equipo de ALCO.',
  submit: 'Ver el video completo',
  submitPago: 'Continuar',
  legal: 'Tus datos están seguros · No spam',
}

// ── /ver-video ────────────────────────────────────────────────────────────────
export const VIDEO = {
  step: 'Paso 1 de 2',
  eyebrow: `${PERSON_NAME} · ${BRAND_NAME}`,
  title: 'Cómo dejar de depender de otros para fumigar tu finca',
  sub: 'Mira el video completo. Al final puedes agendar una reunión.',
  lockText: 'El botón se habilita en',
  cta: 'Agendar mi reunión',
  trust: 'Reunión sin costo · Cupos sujetos a cualificación',
}

// ── Cualificación (las preguntas están en utils/qualification.ts) ─────────────
export const CUALIFICACION = {
  eyebrow: 'Último paso',
  title: 'Cuéntanos de tu caso',
  sub: 'Una pregunta a la vez. Te toma un minuto.',
  consent: `Acepto que ${BRAND_NAME} me contacte por WhatsApp y correo, y acepto su`,
  submit: 'Ver horarios disponibles',
}

// ── /agendar ──────────────────────────────────────────────────────────────────
export const BOOKING = {
  step: 'Paso 2 de 2',
  title: 'Elige tu horario',
  sub: 'Conversamos de tu cultivo, tus hectáreas y cómo fumigas hoy. Sin costo.',
  pending:
    'Estamos terminando de configurar el calendario. Te escribiremos por WhatsApp para coordinar tu reunión.',
}

// ── /cita-confirmada ──────────────────────────────────────────────────────────
export const BOOKED = {
  title: 'Tu reunión está confirmada',
  sub: 'Te enviamos los detalles a tu correo.',
  steps: [
    { icon: 'fa-solid fa-envelope', title: 'Revisa tu correo', text: 'Ahí tienes la fecha, la hora y el enlace.' },
    { icon: 'fa-brands fa-whatsapp', title: 'Te escribimos por WhatsApp', text: 'Para confirmar y resolver dudas antes.' },
    { icon: 'fa-solid fa-list-check', title: 'Ten a mano tus datos', text: 'Cultivo, hectáreas y cómo fumigas hoy: con eso vemos qué dron te conviene.' },
  ],
}

// ── /sin-espacio ──────────────────────────────────────────────────────────────
export const NO_SPACE = {
  title: 'Todavía no es el momento, y está bien',
  text: 'Esta reunión es para agricultores con finca en producción que están listos para tener su propio dron. Cuando estés listo, aquí estamos.',
  cooldown: 'Ya enviaste una solicitud. Podrás intentarlo de nuevo en',
  resourcesTitle: `Sigue aprendiendo con ${BRAND_NAME}`,
  resourcesText: 'En nuestras redes compartimos lo que vemos todos los días en el campo con los drones de fumigación.',
}

// ── Pago (opcional) ───────────────────────────────────────────────────────────
export const PAGO = {
  step: 'Paso 2 de 2 · Confirma tu lugar',
  title: 'falta un paso para confirmar tu lugar',
  sub: 'Tu lugar queda reservado cuando completas el pago.',
  bullets: ['[Formato: en vivo, en línea]', '[Qué se lleva el asistente]'],
  noLink: 'Recibimos tus datos. Te enviaremos el enlace de pago a tu WhatsApp y a tu correo.',
  whatsappMsg: (nombre: string) => `Hola, soy ${nombre}. Me registré y quiero completar mi pago.`,
}

export const CONFIRMADA = {
  title: 'Tu lugar está confirmado',
  steps: [
    { icon: 'fa-solid fa-envelope-open-text', text: 'Revisa tu correo: ahí te llega la confirmación y el acceso.' },
    { icon: 'fa-brands fa-whatsapp', text: 'Te escribiremos por WhatsApp antes de empezar.' },
    { icon: 'fa-solid fa-list-check', text: '[Qué preparar antes del evento]' },
  ],
  calendarTitle: '¿Prefieres que veamos tu caso? Agenda una reunión',
  calendarButton: 'Agendar una reunión',
}
