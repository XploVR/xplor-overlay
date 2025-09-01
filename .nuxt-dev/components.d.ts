
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'BrandXplor': typeof import("../components/BrandXplor.vue")['default']
    'FiltersBar': typeof import("../components/FiltersBar.vue")['default']
    'Modal': typeof import("../components/Modal.vue")['default']
    'NavAuth': typeof import("../components/NavAuth.vue")['default']
    'ProgressBar': typeof import("../components/ProgressBar.vue")['default']
    'StepIndicator': typeof import("../components/StepIndicator.vue")['default']
    'FormsBaseListingForm': typeof import("../components/forms/BaseListingForm.vue")['default']
    'FormsMediaManager': typeof import("../components/forms/MediaManager.vue")['default']
    'FormsUploadWithMedia': typeof import("../components/forms/UploadWithMedia.vue")['default']
    'ListingFiltersBar': typeof import("../components/listing/FiltersBar.vue")['default']
    'ListingCard': typeof import("../components/listing/ListingCard.vue")['default']
    'ListingGrid': typeof import("../components/listing/ListingGrid.vue")['default']
    'ListingMap': typeof import("../components/listing/ListingMap.vue")['default']
    'Listing[id]': typeof import("../components/listing/[id].vue")['default']
    'NavAppSidebar': typeof import("../components/nav/AppSidebar.vue")['default']
    'UiBadge': typeof import("../components/ui/Badge.vue")['default']
    'UiCard': typeof import("../components/ui/Card.vue")['default']
    'UiXButton': typeof import("../components/ui/XButton.vue")['default']
    'UploaderMediaCard': typeof import("../components/uploader/MediaCard.vue")['default']
    'UploaderMediaList': typeof import("../components/uploader/MediaList.vue")['default']
    'UploaderUploadZone': typeof import("../components/uploader/UploadZone.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyBrandXplor': LazyComponent<typeof import("../components/BrandXplor.vue")['default']>
    'LazyFiltersBar': LazyComponent<typeof import("../components/FiltersBar.vue")['default']>
    'LazyModal': LazyComponent<typeof import("../components/Modal.vue")['default']>
    'LazyNavAuth': LazyComponent<typeof import("../components/NavAuth.vue")['default']>
    'LazyProgressBar': LazyComponent<typeof import("../components/ProgressBar.vue")['default']>
    'LazyStepIndicator': LazyComponent<typeof import("../components/StepIndicator.vue")['default']>
    'LazyFormsBaseListingForm': LazyComponent<typeof import("../components/forms/BaseListingForm.vue")['default']>
    'LazyFormsMediaManager': LazyComponent<typeof import("../components/forms/MediaManager.vue")['default']>
    'LazyFormsUploadWithMedia': LazyComponent<typeof import("../components/forms/UploadWithMedia.vue")['default']>
    'LazyListingFiltersBar': LazyComponent<typeof import("../components/listing/FiltersBar.vue")['default']>
    'LazyListingCard': LazyComponent<typeof import("../components/listing/ListingCard.vue")['default']>
    'LazyListingGrid': LazyComponent<typeof import("../components/listing/ListingGrid.vue")['default']>
    'LazyListingMap': LazyComponent<typeof import("../components/listing/ListingMap.vue")['default']>
    'LazyListing[id]': LazyComponent<typeof import("../components/listing/[id].vue")['default']>
    'LazyNavAppSidebar': LazyComponent<typeof import("../components/nav/AppSidebar.vue")['default']>
    'LazyUiBadge': LazyComponent<typeof import("../components/ui/Badge.vue")['default']>
    'LazyUiCard': LazyComponent<typeof import("../components/ui/Card.vue")['default']>
    'LazyUiXButton': LazyComponent<typeof import("../components/ui/XButton.vue")['default']>
    'LazyUploaderMediaCard': LazyComponent<typeof import("../components/uploader/MediaCard.vue")['default']>
    'LazyUploaderMediaList': LazyComponent<typeof import("../components/uploader/MediaList.vue")['default']>
    'LazyUploaderUploadZone': LazyComponent<typeof import("../components/uploader/UploadZone.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const BrandXplor: typeof import("../components/BrandXplor.vue")['default']
export const FiltersBar: typeof import("../components/FiltersBar.vue")['default']
export const Modal: typeof import("../components/Modal.vue")['default']
export const NavAuth: typeof import("../components/NavAuth.vue")['default']
export const ProgressBar: typeof import("../components/ProgressBar.vue")['default']
export const StepIndicator: typeof import("../components/StepIndicator.vue")['default']
export const FormsBaseListingForm: typeof import("../components/forms/BaseListingForm.vue")['default']
export const FormsMediaManager: typeof import("../components/forms/MediaManager.vue")['default']
export const FormsUploadWithMedia: typeof import("../components/forms/UploadWithMedia.vue")['default']
export const ListingFiltersBar: typeof import("../components/listing/FiltersBar.vue")['default']
export const ListingCard: typeof import("../components/listing/ListingCard.vue")['default']
export const ListingGrid: typeof import("../components/listing/ListingGrid.vue")['default']
export const ListingMap: typeof import("../components/listing/ListingMap.vue")['default']
export const Listing[id]: typeof import("../components/listing/[id].vue")['default']
export const NavAppSidebar: typeof import("../components/nav/AppSidebar.vue")['default']
export const UiBadge: typeof import("../components/ui/Badge.vue")['default']
export const UiCard: typeof import("../components/ui/Card.vue")['default']
export const UiXButton: typeof import("../components/ui/XButton.vue")['default']
export const UploaderMediaCard: typeof import("../components/uploader/MediaCard.vue")['default']
export const UploaderMediaList: typeof import("../components/uploader/MediaList.vue")['default']
export const UploaderUploadZone: typeof import("../components/uploader/UploadZone.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyBrandXplor: LazyComponent<typeof import("../components/BrandXplor.vue")['default']>
export const LazyFiltersBar: LazyComponent<typeof import("../components/FiltersBar.vue")['default']>
export const LazyModal: LazyComponent<typeof import("../components/Modal.vue")['default']>
export const LazyNavAuth: LazyComponent<typeof import("../components/NavAuth.vue")['default']>
export const LazyProgressBar: LazyComponent<typeof import("../components/ProgressBar.vue")['default']>
export const LazyStepIndicator: LazyComponent<typeof import("../components/StepIndicator.vue")['default']>
export const LazyFormsBaseListingForm: LazyComponent<typeof import("../components/forms/BaseListingForm.vue")['default']>
export const LazyFormsMediaManager: LazyComponent<typeof import("../components/forms/MediaManager.vue")['default']>
export const LazyFormsUploadWithMedia: LazyComponent<typeof import("../components/forms/UploadWithMedia.vue")['default']>
export const LazyListingFiltersBar: LazyComponent<typeof import("../components/listing/FiltersBar.vue")['default']>
export const LazyListingCard: LazyComponent<typeof import("../components/listing/ListingCard.vue")['default']>
export const LazyListingGrid: LazyComponent<typeof import("../components/listing/ListingGrid.vue")['default']>
export const LazyListingMap: LazyComponent<typeof import("../components/listing/ListingMap.vue")['default']>
export const LazyListing[id]: LazyComponent<typeof import("../components/listing/[id].vue")['default']>
export const LazyNavAppSidebar: LazyComponent<typeof import("../components/nav/AppSidebar.vue")['default']>
export const LazyUiBadge: LazyComponent<typeof import("../components/ui/Badge.vue")['default']>
export const LazyUiCard: LazyComponent<typeof import("../components/ui/Card.vue")['default']>
export const LazyUiXButton: LazyComponent<typeof import("../components/ui/XButton.vue")['default']>
export const LazyUploaderMediaCard: LazyComponent<typeof import("../components/uploader/MediaCard.vue")['default']>
export const LazyUploaderMediaList: LazyComponent<typeof import("../components/uploader/MediaList.vue")['default']>
export const LazyUploaderUploadZone: LazyComponent<typeof import("../components/uploader/UploadZone.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
