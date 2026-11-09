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
// Todo sale del guion del VSL de Fernando Alvear. No agregar cifras ni testimonios inventados.
export const LANDING = {
  countdownLabel: 'La agenda de esta semana cierra en',
  kicker: 'Para agricultores de Guayas, Los Ríos, El Oro y Manabí',
  headline: 'Deja de esperar al fumigador.',
  headlineAccent: 'Fumiga tu finca el día que tú decides.',
  benefits: [
    'Sin pedirle favor a nadie',
    'Sabes qué producto y dosis aplicas',
    'Sin pisar tu plantación',
    'DJI Agras en stock',
  ],
  videoCaption: `${BRAND_NAME} · Drones de fumigación desde 2015`,
  scarcity: (n: number) => ({ pre: 'Quedan', n: `${n} ${n === 1 ? 'cupo' : 'cupos'}`, post: 'de reunión esta semana' }),
  cta: 'Ver el video y agendar',
  ctaNote: 'Sin costo · Reuniones sujetas a calificación',

  clock: {
    eyebrow: 'El problema',
    title: 'En el agro, el momento',
    titleAccent: 'lo es todo',
    sub: 'Cuando dependes de un servicio externo, tu cosecha queda en manos de otra persona: ella decide cuándo viene, cuánto te cobra y cómo aplica.',
    days: [
      { tag: 'Día 0', title: 'El cultivo está listo', text: 'Llamas al que te presta el servicio.' },
      { tag: 'Día 1', title: 'No contesta', text: 'O te cambia la fecha.' },
      { tag: 'Día 2–3', title: 'La plaga avanza', text: 'Dos o tres días de retraso le dan ventaja a plagas, hongos y malezas.', warn: true },
      { tag: 'Cosecha', title: 'Ahí se nota', text: 'No se nota el día que fumigas. Se nota en la cosecha.', warn: true },
    ],
    season: {
      title: 'En temporada es peor',
      text: 'Todos necesitan fumigar al mismo tiempo. Con El Niño vienen más lluvia y más presión de sigatoca, y los que prestan servicio no van a dar abasto.',
    },
  },

  mentor: {
    eyebrow: 'Quién te lo cuenta',
    name: 'Fernando Alvear',
    role: 'ALCO · Drones de fumigación',
    year: '2015',
    yearLabel: 'Trabajando con drones de fumigación desde',
    points: [
      'Fuimos de los pioneros en traer drones de fumigación al país.',
      'Trabajamos con agricultores de Guayas, Los Ríos, El Oro y Manabí.',
      'Desde que compras tu dron hasta cada temporada que viene, estamos contigo.',
    ],
  },

  closing: {
    title: 'Tu cosecha no puede seguir',
    titleAccent: 'esperando al fumigador',
    sub: 'Mira el video y agendemos una reunión para conocer tu caso: tu cultivo, tus hectáreas y cómo fumigas hoy.',
  },

  sticky: { title: 'Dron propio', sub: 'Video de Fernando Alvear', cta: 'Ver video' },
  disclaimer:
    'DJI y Agras son marcas de sus respectivos dueños. Los resultados dependen de cada finca y cultivo. Este sitio no está respaldado por Meta Platforms, Inc. ni forma parte de Facebook.',
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
