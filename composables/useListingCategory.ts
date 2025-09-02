// composables/useListingCategory.ts
export const CATEGORY_LABELS = {
  real_estate: 'Real Estate',
  developments: 'Developments',
  hospitality: 'Hospitality',
  galleries: 'Galleries',
  yachts: 'Yachts',
  automotive: 'Automotive',
  aviation: 'Aviation',
  sports: 'Sports Facilities',
  retail: 'Retail',
} as const

export type CategoryKey = keyof typeof CATEGORY_LABELS

export function useListingCategory(raw?: string | null) {
  const key = (raw ?? '').toLowerCase() as CategoryKey
  const label = CATEGORY_LABELS[key]
  return {
    key: label ? key : null,
    label: label ?? null
  }
}
