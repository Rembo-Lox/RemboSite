import { unstable_noStore as noStore } from 'next/cache'

import { getPayloadClient } from '@/lib/payload'
import type { PortfolioSection } from '@/lib/site-data'

type SkillDoc = {
  id: number | string
  description?: string | null
  isVisible?: boolean | null
  slug?: string | null
  title?: string | null
}

type ProjectLink = {
  label?: string | null
  url?: string | null
}

type PortfolioDoc = {
  description?: string | null
  details?: string | null
  gallery?: { image?: { alt?: string | null; url?: string | null } | number | null }[] | null
  image?: { alt?: string | null; url?: string | null } | number | null
  isVisible?: boolean | null
  links?: ProjectLink[] | null
  skill?: SkillDoc | number | string | null
  status?: 'done' | 'placeholder' | 'wip' | null
  title?: string | null
}

const isImageObject = (image: unknown): image is { alt?: string | null; url?: string | null } =>
  Boolean(image && typeof image === 'object')

export const getPortfolioSections = async (): Promise<PortfolioSection[]> => {
  noStore()

  try {
    const payload = await getPayloadClient()

    const [skillsResult, projectsResult] = await Promise.all([
      payload.find({
        collection: 'skills',
        depth: 0,
        limit: 200,
        sort: 'sort',
        where: {
          isVisible: {
            equals: true,
          },
        },
      }),
      payload.find({
        collection: 'projects',
        depth: 1,
        limit: 500,
        sort: 'sort',
        where: {
          isVisible: {
            equals: true,
          },
        },
      }),
    ])

    const skillDocs = (skillsResult.docs ?? []) as SkillDoc[]
    const projectDocs = (projectsResult.docs ?? []) as PortfolioDoc[]

    const sectionsById = new Map<string, PortfolioSection>()

    for (const skill of skillDocs) {
      if (!skill?.title || !skill?.slug) continue

      sectionsById.set(String(skill.id), {
        description: skill.description ? String(skill.description) : undefined,
        items: [],
        key: String(skill.slug),
        title: String(skill.title),
      })
    }

    for (const doc of projectDocs) {
      if (!doc?.title || !doc?.description || !doc.skill || typeof doc.skill !== 'object') {
        continue
      }

      const section = sectionsById.get(String(doc.skill.id))
      if (!section) continue

      const links =
        doc.links
          ?.filter((link) => Boolean(link?.label && link?.url))
          .map((link) => ({ href: String(link.url), label: String(link.label) })) ?? []

      section.items.push({
        description: String(doc.description),
        details: doc.details || undefined,
        gallery:
          doc.gallery
            ?.map((item) => item.image)
            .filter(
              (image): image is { alt?: string | null; url: string } =>
                isImageObject(image) && Boolean(image.url),
            )
            .map((image) => ({ alt: image.alt ? String(image.alt) : undefined, url: image.url })) ??
          [],
        imageAlt: typeof doc.image === 'object' && doc.image?.alt ? String(doc.image.alt) : undefined,
        imageUrl: typeof doc.image === 'object' && doc.image?.url ? String(doc.image.url) : undefined,
        links,
        status: doc.status ?? 'wip',
        title: String(doc.title),
      })
    }

    return Array.from(sectionsById.values())
  } catch {
    return []
  }
}
