'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

type NavItem = {
  href: string
  label: string
}

type FloatingNavProps = {
  donateLabel?: string
  donateUrl?: string
  items: NavItem[]
  logoAlt?: string
  logoText?: string
  logoUrl?: string
}

export const FloatingNav = ({
  donateLabel,
  donateUrl,
  items,
  logoAlt,
  logoText,
  logoUrl,
}: FloatingNavProps) => {
  const pathname = usePathname()
  const linksWrapRef = useRef<HTMLDivElement | null>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [indicator, setIndicator] = useState({ opacity: 0, width: 0, x: 0 })
  const [isHidden, setHidden] = useState(false)

  const preparedItems = useMemo(() => items.filter((item) => item.href && item.label), [items])

  useEffect(() => {
    let frame = 0
    const active = preparedItems.find((item) =>
      item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`),
    )

    const activeEl = active ? linkRefs.current[active.href] : null
    const wrapEl = linksWrapRef.current

    if (!activeEl || !wrapEl) {
      frame = requestAnimationFrame(() => {
        setIndicator((prev) => ({ ...prev, opacity: 0 }))
      })
      return
    }

    const wrapRect = wrapEl.getBoundingClientRect()
    const rect = activeEl.getBoundingClientRect()

    frame = requestAnimationFrame(() => {
      setIndicator({
        opacity: 1,
        width: rect.width,
        x: rect.left - wrapRect.left,
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, preparedItems])

  useEffect(() => {
    let ticking = false
    let prevY = window.scrollY

    const update = () => {
      const y = window.scrollY
      const atTop = y <= 8
      const scrollingDown = y > prevY + 4
      const scrollingUp = y < prevY - 4

      if (atTop || scrollingUp) {
        setHidden(false)
      } else if (scrollingDown) {
        setHidden(true)
      }

      prevY = y
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`floating-nav-wrap${isHidden ? ' is-hidden' : ''}`}>
      <nav className="floating-nav">
        <Link className="nav-brand" href="/">
          {logoUrl ? <Image alt={logoAlt || 'Логотип'} height={24} src={logoUrl} width={24} /> : null}
          <span>{logoText || 'Rembo'}</span>
        </Link>

        <div className="nav-links-wrap" ref={linksWrapRef}>
          <span
            aria-hidden
            className="nav-active-indicator"
            style={{ opacity: indicator.opacity, transform: `translateX(${indicator.x}px)`, width: indicator.width }}
          />
          {preparedItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                className={`nav-link${isActive ? ' active' : ''}`}
                href={item.href}
                key={item.href}
                ref={(node) => {
                  linkRefs.current[item.href] = node
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <a
          className="nav-donate"
          href={donateUrl || '#'}
          onClick={(event) => {
            if (!donateUrl || donateUrl === '#') {
              event.preventDefault()
            }
          }}
          rel="noreferrer"
          target={donateUrl && donateUrl !== '#' ? '_blank' : undefined}
        >
          {donateLabel || 'Донат'}
        </a>
      </nav>
    </header>
  )
}
