import type { CollaboratorProfile } from '@/lib/site-data'
import { unstable_noStore as noStore } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

type CollaboratorDoc = {
  about?: string | null
  details?: string | null
  discordUserId?: string | null
  gallery?: { image?: { alt?: string | null; url?: string | null } | number | null }[] | null
  image?: { alt?: string | null; url?: string | null } | number | null
  isVisible?: boolean | null
  links?: { label?: string | null; url?: string | null }[] | null
  name?: string | null
  role?: string | null
}

const isImageObject = (image: unknown): image is { alt?: string | null; url?: string | null } =>
  Boolean(image && typeof image === 'object')

export const getCollaborators = async (): Promise<CollaboratorProfile[]> => {
  noStore()
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'collaborators',
      depth: 1,
      limit: 100,
      sort: 'sort',
      where: {
        isVisible: {
          equals: true,
        },
      },
    })

    const docs = (result.docs ?? []) as CollaboratorDoc[]
    return docs
      .filter((doc) => doc?.name && doc?.role && doc?.about)
      .map((doc) => ({
        about: String(doc.about),
        details: doc.details ? String(doc.details) : undefined,
        discordUserId: doc.discordUserId ? String(doc.discordUserId) : undefined,
        gallery:
          doc.gallery
            ?.map((item) => item.image)
            .filter(
              (image): image is { alt?: string | null; url: string } =>
                isImageObject(image) && Boolean(image.url),
            )
            .map((image) => ({ alt: image.alt ? String(image.alt) : undefined, url: image.url })) ??
          [],
        imageAlt:
          typeof doc.image === 'object' && doc.image?.alt ? String(doc.image.alt) : undefined,
        imageUrl:
          typeof doc.image === 'object' && doc.image?.url ? String(doc.image.url) : undefined,
        links:
          doc.links
            ?.filter((link) => Boolean(link?.label && link?.url))
            .map((link) => ({ href: String(link.url), label: String(link.label) })) ?? [],
        name: String(doc.name),
        role: String(doc.role),
      }))
  } catch {
    return []
  }
}
