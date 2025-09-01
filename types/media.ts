// types/media.ts
export type MediaType =
| 'primaryPhoto' | 'virtualTour' | 'video' | 'dronePhoto' | 'droneVideo'
| 'floorPlan' | 'document' | 'additional';


export interface MediaItem {
id: string;
type: MediaType;
name: string;
size: number; // bytes
mime: string;
url?: string; // resolved CDN/public URL
blobUrl?: string; // local preview (object URL)
source: 'file' | 'url';
createdAt: string; // ISO string
width?: number;
height?: number;
durationSec?: number;
// management
primary?: boolean; // for primary photos
order?: number; // sortable index
tags?: string[];
// processing
thumbUrl?: string; // generated thumbnail (object URL)
meta?: Record<string, any>; // exif, etc.
error?: string | null;
progress?: number; // 0..100 (mocked or real)
watermark?: boolean; // watermark applied
}


export interface ListingDetails {
title: string;
description?: string;
city?: string;
price?: number;
status?: 'draft'|'published';
energyRating?: string;
accessibility?: string[];
petPolicy?: string;
rentalTerms?: string;
agent?: {
name?: string; phone?: string; email?: string; brokerage?: string;
};
showingInstructions?: string;
openHouse?: { date?: string; start?: string; end?: string }[];
leadContactPreference?: 'email'|'phone'|'form'|'none';
propertyHistory?: string;
}


export interface ListingDraft {
id: string;
details: ListingDetails;
media: {
primaryPhotos: MediaItem[];
virtualTours: MediaItem[]; // tour embeds/urls
videos: MediaItem[]; // mp4/youtube/vimeo
drone: MediaItem[]; // photos/videos
floorPlans: MediaItem[]; // pdf/jpg/png
documents: MediaItem[]; // pdf
additional: MediaItem[]; // brochures, guides, etc
};
updatedAt: string; // ISO
}