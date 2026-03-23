import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import type { CSSProperties, ReactNode } from 'react'

import { FloatingNav } from '@/components/site/floating-nav'
import { SiteFooter } from '@/components/site/site-footer'
import { getCustomPagesNav } from '@/lib/get-custom-pages'
import { getSiteContent } from '@/lib/get-site-content'

import '../globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const generateMetadata = async (): Promise<Metadata> => {
  const content = await getSiteContent()

  return {
    title: {
      default: content.branding.siteName || 'Rembo',
      template: `%s | ${content.branding.siteName || 'Rembo'}`,
    },
    description: content.branding.siteDescription,
  }
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [content, dynamicPages] = await Promise.all([getSiteContent(), getCustomPagesNav()])

  const navItems = [...content.navigation.items]
  for (const page of dynamicPages) {
    if (!navItems.some((item) => item.href === page.href)) {
      navItems.push(page)
    }
  }

  const cssVars = {
    '--accent': content.design.accentColor,
    '--bg-900': content.design.backgroundTo,
    '--bg-950': content.design.backgroundFrom,
    '--cards-desktop': String(content.cardSettings.columnsDesktop),
    '--cards-mobile': String(content.cardSettings.columnsMobile),
    '--cards-tablet': String(content.cardSettings.columnsTablet),
    '--glass-opacity': String((content.design.glassOpacity ?? 72) / 100),
    '--panel-radius': `${content.design.panelRadius ?? 18}px`,
  } as CSSProperties

  return (
    <html className={spaceGrotesk.variable} lang="ru">
      <body style={cssVars}>
        <div className="site-shell">
          <FloatingNav
            donateLabel={content.navigation.donateLabel}
            donateUrl={content.navigation.donateUrl}
            items={navItems}
            logoAlt={content.branding.logoAlt}
            logoText={content.branding.logoText}
            logoUrl={content.branding.logoUrl}
          />
          <main className="site-main">{children}</main>
          <SiteFooter
            copyright={content.footer.copyright}
            domainsText={content.footer.domainsText}
            vertexpointUrl={content.footer.vertexpointUrl}
          />
        </div>
      </body>
    </html>
  )
}
