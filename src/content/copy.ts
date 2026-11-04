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
  topbarTag: 'DJI Agras · en stock',
  kicker: 'Para agricultores de la Costa',
  headline: 'Deja de esperar',
  headlineMid: 'al fumigador.',
  headlineAccent: 'Fumiga el día que tú decides.',
  sub: 'El cultivo está listo, llamas al que te presta el servicio y no contesta, te cambia la fecha o llega cuando ya es tarde. Fernando Alvear te cuenta cómo muchos agricultores de la Costa dejaron de pasar por eso.',
  videoCaption: `${BRAND_NAME} · Desde 2015`,
  cta: 'Ver el video completo',
  ctaNote: 'Sin costo · Solo te pedimos tus datos para mostrártelo',
  provinces: ['Guayas', 'Los Ríos', 'El Oro', 'Manabí'],
  provincesLabel: 'Trabajamos con agricultores de',

  // El problema contado como una línea de tiempo (VSL, bloque 3)
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
      text: 'Todos necesitan fumigar al mismo tiempo. Con El Niño vienen más lluvia y más presión de sigatoca, y los que prestan servicio no van a dar abasto. El primero que queda esperando es el agricultor pequeño o mediano.',
    },
  },

  // Servicio externo vs. dron propio (VSL, bloque 4)
  compare: {
    eyebrow: 'Por eso',
    title: 'Cada vez más fincas de 30, 50 o 100 ha',
    titleAccent: 'compran su propio dron',
    them: 'Dependiendo de otros',
    us: 'Con tu propio dron',
    rows: [
      { them: 'Fumigas cuando el otro puede venir', us: 'Fumigas el día que tú decides, sin pedirle favor a nadie' },
      { them: 'Confías en el producto y la dosis que el otro decida', us: 'Sabes exactamente qué producto y qué dosis se aplicaron' },
      { them: 'Esperas tu turno cuando todos necesitan fumigar', us: 'Cubres tus hectáreas en mucho menos tiempo' },
      { them: 'Equipos y cuadrillas que entran al cultivo', us: 'Sin pisar la plantación y sin exponer a tu gente a los insumos' },
      { them: 'Cada fumigada es un pago que se va', us: 'Lo que pagabas por el servicio se queda en tu finca' },
    ],
  },

  // Lo que pone ALCO (VSL, bloque 5)
  offer: {
    eyebrow: 'Con ALCO',
    title: 'El equipo, el criterio',
    titleAccent: 'y el respaldo',
    models: ['T55', 'T70P', 'T100'],
    modelsTitle: 'DJI Agras en stock',
    modelsText: 'Listos para salir a tu finca. No vas a tener que esperar meses cuando ya estás en temporada.',
    academy: {
      tag: 'Academia EAD · si tú lo decides',
      title: 'No solo aprendes a volar el dron',
      text: 'Aprendes manejo agronómico: qué producto aplicar, a qué altura, a qué hora y en qué cultivo.',
      quote: 'El dron es la herramienta, pero lo que cuida tu plantación es el criterio.',
    },
    support: {
      title: 'Respaldo para que no pares en plena temporada',
      items: [
        { icon: 'fa-gears', text: 'Repuestos en stock' },
        { icon: 'fa-screwdriver-wrench', text: 'Planes de mantenimiento preventivo' },
        { icon: 'fa-car-battery', text: 'Equipo de respaldo: generadores y cargadores' },
      ],
    },
    cta: 'Quiero ver el video',
  },

  // Autoridad (VSL, bloque 2 + atención)
  authority: {
    year: '2015',
    yearLabel: 'Trabajamos con drones de fumigación desde',
    text: 'Fuimos de los pioneros en traerlos al país. Lo que Fernando te cuenta en el video es lo que vemos todos los días en el campo.',
    promise: 'Desde que compras tu dron hasta cada temporada que viene, estamos contigo.',
    quote: 'Ustedes sí me han ayudado con soluciones',
    quoteBy: 'Lo que más nos dicen nuestros clientes',
  },

  fit: {
    eyebrow: 'Antes de seguir',
    title: '¿Es para ti?',
    yes: [
      'Tienes tu finca andando y ya sabes lo que es sacar una cosecha.',
      'Hoy dependes de que otro llegue a fumigar a tiempo.',
      'Quieres que tu finca produzca más y dependa menos de otros.',
    ],
    no: 'No tienes finca o solo buscas contratar un servicio de fumigación.',
  },

  closing: {
    eyebrow: 'Siguiente paso',
    title: 'Tu cosecha no puede seguir',
    titleAccent: 'esperando al fumigador',
    sub: 'Mira el video y agendemos una reunión para conocer tu caso.',
    agenda: [
      { icon: 'fa-seedling', text: 'Tu cultivo' },
      { icon: 'fa-ruler-combined', text: 'Tus hectáreas' },
      { icon: 'fa-spray-can-sparkles', text: 'Cómo fumigas hoy' },
    ],
    cta: 'Ver el video completo',
  },

  sticky: { title: 'Tu propio dron de fumigación', sub: 'Video de Fernando Alvear', cta: 'Ver video' },
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
