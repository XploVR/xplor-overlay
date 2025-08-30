export type SpaceKind = 'real_estate'|'yacht'|'gallery'|'hotel'|'restaurant'|'museum'|'vehicle'
export interface BaseListing {
  id?: string; kind: SpaceKind; title: string; description: string;
  address_line1: string; city: string; country: string;
  lat: number; lng: number; status: 'draft'|'active'|'archived'
}
