// Autochequeo de endOfWeekGye: `node e2e/week.check.ts` (Node 22.6+)
import assert from 'node:assert'
import { endOfWeekGye } from '../src/utils/week.ts'

const iso = (ms: number) => new Date(ms).toISOString()
// Miércoles 4 nov 2026 10:00 Ecuador (15:00 UTC) → domingo 8 nov 23:59:59 Ecuador (9 nov 04:59:59 UTC)
assert.equal(iso(endOfWeekGye(Date.UTC(2026, 10, 4, 15))), '2026-11-09T04:59:59.000Z')
// Domingo 8 nov 22:00 Ecuador (9 nov 03:00 UTC) → el mismo domingo, no el siguiente
assert.equal(iso(endOfWeekGye(Date.UTC(2026, 10, 9, 3))), '2026-11-09T04:59:59.000Z')
// Lunes 9 nov 00:30 Ecuador (05:30 UTC) → domingo 15
assert.equal(iso(endOfWeekGye(Date.UTC(2026, 10, 9, 5, 30))), '2026-11-16T04:59:59.000Z')
console.log('week.check OK')
