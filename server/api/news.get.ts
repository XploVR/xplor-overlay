// server/api/news.get.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return [
    { id: 'n1', title: 'Mediterranean luxury demand up 8% YoY', source: 'Xplor Insights', time: '2h' },
    { id: 'n2', title: 'Prime coastal price index hits new high', source: 'GlobalProp Monitor', time: '1d' },
    { id: 'n3', title: 'New build approvals rise in Andalusia', source: 'Local Gov', time: '2d' }
  ]
})
