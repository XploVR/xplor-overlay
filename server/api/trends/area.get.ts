// server/api/trends/area.get.ts
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler((event) => {
  const q = getQuery(event)
  const area = (q.area as string) || 'Marbella, ES'
  return {
    area,
    kpis: [
      { name: 'Median Price', value: '€1.25M', delta: '+3.1% MoM' },
      { name: 'Days on Market', value: '41',   delta: '-6 d MoM' },
      { name: 'Inventory', value: '2.8 mo',    delta: '+0.2 mo' },
      { name: 'Price / m²', value: '€6,950',   delta: '+1.4% MoM' },
    ]
  }
})
