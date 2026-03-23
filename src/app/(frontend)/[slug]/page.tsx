import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPublishedPageBySlug } from '@/lib/get-custom-pages'

type PageProps = {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export default async function CustomPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPublishedPageBySlug(slug)

  if (!page || ['friends', 'live-chat', 'portfolio'].includes(slug)) {
    notFound()
  }

  return (
    <div className="page-stack">
      {page.blocks.map((block, index) => {
        if (block.blockType === 'hero') {
          return (
            <section className="glass-panel custom-hero-block" key={`hero-${index}`}>
              {block.image && typeof block.image === 'object' && block.image.url ? (
                <div className="custom-hero-image-wrap">
                  <Image
                    alt={block.image.alt || block.title || page.title}
                    className="custom-hero-image"
                    fill
                    sizes="(max-width: 1000px) 100vw, 70vw"
                    src={block.image.url}
                  />
                </div>
              ) : null}
              {block.eyebrow ? <p className="eyebrow">{block.eyebrow}</p> : null}
              {block.title ? <h1>{block.title}</h1> : null}
              {block.description ? <p className="lead">{block.description}</p> : null}
            </section>
          )
        }

        if (block.blockType === 'text') {
          return (
            <section className="glass-panel custom-text-block" key={`text-${index}`}>
              {block.title ? <h2>{block.title}</h2> : null}
              {block.content ? <p className="lead">{block.content}</p> : null}
            </section>
          )
        }

        if (block.blockType === 'links') {
          return (
            <section className="glass-panel custom-links-block" key={`links-${index}`}>
              {block.title ? <h2>{block.title}</h2> : null}
              <ul className="social-cards">
                {(block.items ?? [])
                  .filter((item) => item?.label && item?.url)
                  .map((item, itemIndex) => (
                    <li key={`${String(item.url)}-${itemIndex}`}>
                      <Link className="social-card-link" href={String(item.url)} rel="noreferrer" target="_blank">
                        <span>
                          <strong>{String(item.label)}</strong>
                          {item.note ? <small>{String(item.note)}</small> : null}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          )
        }

        return null
      })}
    </div>
  )
}
