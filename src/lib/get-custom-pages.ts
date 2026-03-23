import { unstable_noStore as noStore } from 'next/cache'

import { getPayloadClient } from '@/lib/payload'

type PageBlock =
  | {
      blockType: 'hero'
      description?: string | null
      eyebrow?: string | null
      image?: { alt?: string | null; url?: string | null } | number | null
      title?: string | null
    }
  | {
      blockType: 'links'
      items?: { label?: string | null; note?: string | null; url?: string | null }[] | null
      title?: string | null
    }
  | {
      blockType: 'text'
      content?: string | null
      title?: string | null
    }

type PageDoc = {
  blocks?: PageBlock[] | null
  isPublished?: boolean | null
  navigationLabel?: string | null
  showInNavigation?: boolean | null
  slug?: string | null
  title?: string | null
}

export const getCustomPagesNav = async (): Promise<{ href: string; label: string }[]> => {
  noStore()
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 200,
      sort: 'title',
      where: {
        and: [
          { isPublished: { equals: true } },
          { showInNavigation: { equals: true } },
        ],
      },
    })

    return ((result.docs ?? []) as PageDoc[])
      .filter((doc) => Boolean(doc.slug && doc.title))
      .map((doc) => ({
        href: `/${String(doc.slug)}`,
        label: String(doc.navigationLabel || doc.title),
      }))
  } catch {
    return []
  }
}

export const getPublishedPageBySlug = async (slug: string) => {
  noStore()
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    depth: 1,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, { isPublished: { equals: true } }],
    },
  })

  const page = (result.docs?.[0] as PageDoc | undefined) ?? null
  if (!page || !page.slug || !page.title) {
    return null
  }

  return {
    blocks: page.blocks ?? [],
    slug: String(page.slug),
    title: String(page.title),
  }
}
