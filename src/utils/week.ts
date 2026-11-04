// Cierre de la agenda semanal: domingo 23:59:59 en Ecuador (UTC-5 fijo, sin horario de verano).
const GYE_OFFSET = 5 * 3600 * 1000

/** Timestamp (ms) del próximo domingo 23:59:59 hora de Ecuador (hoy mismo si ya es domingo). */
export function endOfWeekGye(now: number): number {
  const g = new Date(now - GYE_OFFSET) // reloj de Guayaquil leído con getUTC*
  const daysToSunday = (7 - g.getUTCDay()) % 7
  return Date.UTC(g.getUTCFullYear(), g.getUTCMonth(), g.getUTCDate() + daysToSunday, 23, 59, 59) + GYE_OFFSET
}
