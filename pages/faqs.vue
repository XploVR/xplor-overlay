<!-- pages/faqs.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })

import { computed, ref } from 'vue'
import { useHead } from '#imports'
// If you don't have lucide-vue-next installed, comment the next line and the <Search /> in template.
import { Search } from 'lucide-vue-next'

// OPTIONAL banner: if you created the component, keep this import; if not, remove both this line and the tag below.
import MatterportAdBanner from '@/components/MatterportAdBanner.vue'

interface FAQ { question: string; answer: string; category: string }

const faqs: FAQ[] = [
  // ===== General
  {
    category: 'General',
    question: 'What is Xplor?',
    answer:
      "Xplor is a universal platform to publish and discover immersive toursâ€”real estate, yachts, hotels, museums, automotive, aviation, and more. Upload 360Â°/3D tours, geotag on a live map, embed anywhere, and track engagement."
  },
  {
    category: 'General',
    question: 'Who can use Xplor?',
    answer:
      "Anyone can browse. Creators, photographers, owners, crew, brokers, and agencies can upload and manage listings. Enterprise teams can bulk-import, collaborate, and access advanced analytics."
  },
  {
    category: 'General',
    question: 'Which formats do you support?',
    answer:
      "Matterport, 3DVista, Kuula, and any embeddable 360Â°/3D/web tour via secure iframe. You can also add photo galleries and video."
  },

  // ===== Uploading & Content
  {
    category: 'Uploading',
    question: 'How do I upload a space?',
    answer:
      "Click â€œUploadâ€ (or go to /upload). Add a title, location, category, media (tour embed, photos, video), and optional booking/contact links. Save as draft or publish."
  },
  {
    category: 'Uploading',
    question: 'Do you support bulk imports?',
    answer:
      "Yes â€” CSV/Excel bulk upload for large portfolios, with templates per vertical (real estate, yachts, hotels, etc.). Enterprise ingestion (API/webhooks) available on request."
  },
  {
    category: 'Uploading',
    question: 'Can I edit or version a tour after publishing?',
    answer:
      "Yes. Update media, details, and privacy anytime. We store updated timestamps and support versioning."
  },

  // ===== Geospatial & Discovery
  {
    category: 'Geospatial & Discovery',
    question: 'How does geotagging work?',
    answer:
      "Set a precise map location during upload. Xplor uses Mapbox for visualization and H3 hex-grids for fast clustering and discovery at global scale."
  },
  {
    category: 'Geospatial & Discovery',
    question: 'What is H3 and why do you use it?',
    answer:
      "H3 is a hierarchical hex indexing system. It helps Xplor cluster nearby tours, power heatmaps, and enable fast geo-searchâ€”even across millions of spaces."
  },

  // ===== Privacy & Safety
  {
    category: 'Privacy & Safety',
    question: 'What privacy options are available?',
    answer:
      "Public, Private, or PIN-protected. Private listings are hidden; PIN listings require a code to view. Change privacy anytime."
  },
  {
    category: 'Privacy & Safety',
    question: 'How do moderation and reporting work?',
    answer:
      "We use automated checks + manual review. Users can report content; repeat or severe violations may result in removal or account action."
  },
  {
    category: 'Privacy & Safety',
    question: 'Is Xplor GDPR compliant?',
    answer:
      "Yes. We follow GDPR for EU users. You can export your data and request deletion in Settings. See our Privacy Policy for details."
  },

  // ===== FairShare & Crew (Yachting)
  {
    category: 'FairShare & Crew',
    question: 'What is FairShare?',
    answer:
      "FairShare is Xplorâ€™s yacht-charter model that shares 50% of net charter commission with active crew on eligible yachtsâ€”aligning incentives and improving guest experience."
  },
  {
    category: 'FairShare & Crew',
    question: 'What is CRI+ (Crew Rating Index)?',
    answer:
      "CRI+ is a transparent, data-driven score combining qualifications, sea time, longevity, guest feedback, safety, and contribution to Xplor content."
  },
  {
    category: 'FairShare & Crew',
    question: 'How are crew payouts calculated?',
    answer:
      "For eligible charters, 50% of net commission is distributed across verified crew according to FairShare rules (role, tenure, contribution) after funds clear and verification completes."
  },

  // ===== Pricing & Plans
  {
    category: 'Pricing & Plans',
    question: 'Is it free to list?',
    answer:
      "Yes â€” basic listings are free within fair-use limits (media and storage caps). Pro and Business plans unlock bulk uploads, analytics, custom branding, and more."
  },
  {
    category: 'Pricing & Plans',
    question: 'What counts toward storage and limits?',
    answer:
      "Hosted media and metadata on Xplor count toward plan limits. Third-party embedded tours count less, but thumbnails and metadata still do."
  },

  // ===== Embeds, API, Analytics
  {
    category: 'Embeds & API',
    question: 'Can I embed my Xplor listing on my website?',
    answer:
      "Yes. Every public listing has an iframe embed. You can control dimensions, theme, and privacy. PIN-protected content requires a valid code."
  },
  {
    category: 'Embeds & API',
    question: 'Do you offer an API?',
    answer:
      "Yes for approved partners. Access listings, analytics, and webhooks for ingestion/sync. Contact us to discuss scope and rate limits."
  },
  {
    category: 'Embeds & API',
    question: 'What analytics are available?',
    answer:
      "Views, unique visitors, geo distribution, time-on-tour, referrers, and conversion events (e.g., contact clicks). Pro/Business plans include export and dashboard widgets."
  },

  // ===== Verification & Trust
  {
    category: 'Verification & Trust',
    question: 'How do I get a verification badge?',
    answer:
      "Agencies, brokers, management companies, and verified owners can submit docs for verification. Verified accounts gain a badge and higher trust in search."
  },
  {
    category: 'Verification & Trust',
    question: 'How do I report an issue or request removal?',
    answer:
      "Use the Report button on a listing or contact support with URLs and details. We also handle takedowns for rights holders per our Terms."
  },

  // ===== Accounts & Data
  {
    category: 'Accounts & Data',
    question: 'Can I export my data?',
    answer:
      "Yes. Export listings, analytics, and media references from Settings (Pro/Business) or request a full archive via support."
  },
  {
    category: 'Accounts & Data',
    question: 'How do I delete my account?',
    answer:
      "Go to Settings â†’ Account â†’ Delete. Weâ€™ll remove personal data per policy; some aggregate/anonymized analytics may be retained."
  },

  // ===== Support
  {
    category: 'Support',
    question: 'How do I contact support or sales?',
    answer:
      "Use the in-app chat, the Contact page, or email our team. Enterprise onboarding and integrations are available by request."
  }
]

const query = ref('')

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return faqs
  return faqs.filter(f =>
    (f.question + ' ' + f.answer + ' ' + f.category).toLowerCase().includes(q)
  )
})

const grouped = computed(() => {
  const map: Record<string, FAQ[]> = {}
  for (const f of filtered.value) (map[f.category] ||= []).push(f)
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, items]) => ({ category, items }))
})

// SEO: JSON-LD for FAQ rich snippets
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer }
  }))
}
useHead({
  script: [
    {
      type: 'application/ld+json',
      // @ts-expect-error Nuxt accepts string children
      children: JSON.stringify(jsonLd)
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-background p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Search -->
      <div class="flex items-center gap-3">
        <!-- If lucide-vue-next isn't installed, remove the next line -->
        <Search class="h-5 w-5 text-muted-foreground" />
        <input
          v-model="query"
          placeholder="Search FAQs..."
          class="w-full bg-transparent rounded-lg border border-white/10 px-3 py-2 outline-none focus:border-white/20"
        />
      </div>

      <!-- Empty state -->
      <div
        v-if="grouped.length === 0"
        class="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-muted-foreground"
      >
        No results for â€œ{{ query }}â€. Try different keywords (e.g., â€œuploadâ€, â€œprivacyâ€, â€œFairShareâ€, â€œH3â€).
      </div>

      <!-- Groups -->
      <div v-for="group in grouped" :key="group.category">
        <h2 class="text-xl font-semibold mt-6 mb-2 flex items-center justify-between">
          <span>{{ group.category }}</span>
          <span class="text-xs font-normal text-muted-foreground">{{ group.items.length }}</span>
        </h2>

        <!-- Native details/summary: zero dependencies, always renders -->
        <div class="divide-y divide-white/10 rounded-xl border border-white/10">
          <details
            v-for="(faq, idx) in group.items"
            :key="`${group.category}-${idx}`"
            class="group"
          >
            <summary class="cursor-pointer select-none list-none p-4 font-medium outline-none hover:bg-white/[0.04]">
              <span class="align-middle">{{ faq.question }}</span>
              <span class="float-right opacity-70 group-open:rotate-180 transition-transform">âŒ„</span>
            </summary>
            <div class="px-4 pb-4 -mt-1 text-sm text-foreground/90 whitespace-pre-line">
              {{ faq.answer }}
            </div>
          </details>
        </div>
      </div>

      <!-- Optional banner: remove if you didn't create the component -->
      <MatterportAdBanner />
    </div>
  </div>
</template>

