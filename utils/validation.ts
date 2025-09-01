// utils/validation.ts
import { z } from 'zod'


export const urlSchema = z.string().url('Invalid URL')


export const imageMime = [
'image/jpeg','image/png','image/webp','image/avif','image/heic','image/heif'
]
export const videoMime = ['video/mp4', 'video/webm']
export const docMime = ['application/pdf']


export const limits = {
imageMaxMB: 20,
videoMaxMB: 1024,
docMaxMB: 50,
minImageWidth: 1024,
minImageHeight: 768,
}


export const fileSchema = z.object({
name: z.string(),
size: z.number(),
type: z.string(),
})


export const tourUrlSchema = z.object({ url: urlSchema })
export const videoUrlSchema = z.object({ url: urlSchema })


export type TourUrl = z.infer<typeof tourUrlSchema>