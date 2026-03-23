'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { MiniDiscordPresence } from '@/components/site/mini-discord-presence'
import { MiniDiscordCardBadge } from '@/components/site/mini-discord-card-badge'
import type { LinkItem } from '@/lib/site-data'

type GalleryImage = {
  alt?: string
  url: string
}

type CardItem = {
  description: string
  details?: string
  discordUserId?: string
  gallery?: GalleryImage[]
  imageAlt?: string
  imageUrl?: string
  links?: LinkItem[]
  status?: string
  subtitle?: string
  title: string
}

const statusLabel: Record<string, string> = {
  done: 'Готово',
  placeholder: 'Заглушка',
  wip: 'WIP',
}

const Gallery = ({ images, title }: { images: GalleryImage[]; title: string }) => {
  const [index, setIndex] = useState(0)
  const image = images[index]

  if (!image) {
    return null
  }

  return (
    <div className="modal-gallery">
      <div className="modal-gallery-image-wrap">
        <Image
          alt={image.alt || title}
          className="modal-gallery-image"
          fill
          sizes="90vw"
          src={image.url}
        />
      </div>
      {images.length > 1 && (
        <div className="modal-gallery-controls">
          <button
            className="button-ghost"
            onClick={() => setIndex((value) => (value === 0 ? images.length - 1 : value - 1))}
            type="button"
          >
            Назад
          </button>
          <span>
            {index + 1} / {images.length}
          </span>
          <button
            className="button-ghost"
            onClick={() => setIndex((value) => (value + 1) % images.length)}
            type="button"
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  )
}

export const InteractiveCardGrid = ({
  cards,
  mode,
  emptyDescription,
  enableHoverExpand = true,
  showStatusBadge = true,
}: {
  cards: CardItem[]
  emptyDescription: string
  enableHoverExpand?: boolean
  mode: 'friends' | 'projects'
  showStatusBadge?: boolean
}) => {
  const [selected, setSelected] = useState<CardItem | null>(null)

  const normalizedCards = useMemo(
    () =>
      cards.map((card) => ({
        ...card,
        gallery: card.gallery && card.gallery.length > 0 ? card.gallery : [],
        links: card.links && card.links.length > 0 ? card.links : [],
      })),
    [cards],
  )

  return (
    <>
      <div className={mode === 'projects' ? 'portfolio-grid' : 'collab-grid'}>
        {normalizedCards.length === 0 && (
          <article className="portfolio-card portfolio-empty">
            <h3>Пока пусто</h3>
            <p>{emptyDescription}</p>
          </article>
        )}

        {normalizedCards.map((item, index) => (
          <button
            className={`interactive-card${enableHoverExpand ? '' : ' no-hover-expand'}`}
            key={`${item.title}-${index}`}
            onClick={() => setSelected(item)}
            type="button"
          >
            {item.imageUrl && (
              <div className="interactive-card-image-wrap">
                <Image
                  alt={item.imageAlt || item.title}
                  className="interactive-card-image"
                  fill
                  sizes="(max-width: 1000px) 100vw, 33vw"
                  src={item.imageUrl}
                />
              </div>
            )}
            <div className="interactive-card-overlay">
              <div className="interactive-card-summary">
                <div className="interactive-card-head">
                  <h3>{item.title}</h3>
                  {showStatusBadge && item.status && (
                    <span className={`status-pill ${item.status}`}>
                      {statusLabel[item.status] ?? item.status}
                    </span>
                  )}
                </div>
                {item.subtitle && <p className="interactive-card-subtitle">{item.subtitle}</p>}
                <p>{item.description}</p>
                {mode === 'friends' && item.discordUserId && (
                  <MiniDiscordCardBadge discordUserId={item.discordUserId} />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)} role="presentation">
          <article className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} type="button">
              Закрыть
            </button>
            <h2>{selected.title}</h2>
            {selected.subtitle && <p className="interactive-card-subtitle">{selected.subtitle}</p>}
            <p className="modal-summary">{selected.description}</p>
            {selected.details && <p className="modal-details">{selected.details}</p>}

            {mode === 'friends' && selected.discordUserId && (
              <MiniDiscordPresence discordUserId={selected.discordUserId} />
            )}

            {selected.gallery && selected.gallery.length > 0 && (
              <Gallery images={selected.gallery} title={selected.title} />
            )}

            {selected.links && selected.links.length > 0 && (
              <ul className="inline-links">
                {selected.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link href={link.href} rel="noreferrer" target="_blank">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      )}
    </>
  )
}
