import { unstable_noStore as noStore } from 'next/cache'

import { getPayloadClient } from '@/lib/payload'
import { DEFAULT_SITE_CONTENT, type SocialLink } from '@/lib/site-data'

type SiteContentDoc = {
  branding?: {
    logo?: { alt?: string | null; url?: string | null } | number | null
    logoText?: string | null
    siteDescription?: string | null
    siteName?: string | null
  } | null
  cardSettings?: {
    columnsDesktop?: number | null
    columnsMobile?: number | null
    columnsTablet?: number | null
    enableHoverExpand?: boolean | null
    showStatusBadge?: boolean | null
  } | null
  design?: {
    accentColor?: string | null
    backgroundFrom?: string | null
    backgroundTo?: string | null
    glassOpacity?: number | null
    panelRadius?: number | null
  } | null
  footer?: {
    copyright?: string | null
    domainsText?: string | null
    vertexpointUrl?: string | null
  } | null
  navigation?: {
    donateLabel?: string | null
    donateUrl?: string | null
    items?:
      | {
          href?: string | null
          isVisible?: boolean | null
          label?: string | null
        }[]
      | null
  } | null
  pages?: {
    friends?: {
      description?: string | null
      emptyDescription?: string | null
      eyebrow?: string | null
      isVisible?: boolean | null
      title?: string | null
    } | null
    home?: {
      description?: string | null
      discordUserId?: string | null
      eyebrow?: string | null
      isVisible?: boolean | null
      socialLinks?:
        | {
            icon?: string | null
            label?: string | null
            note?: string | null
            url?: string | null
          }[]
        | null
      title?: string | null
    } | null
    liveChat?: {
      isVisible?: boolean | null
      title?: string | null
    } | null
    portfolio?: {
      description?: string | null
      emptyCategoryDescription?: string | null
      eyebrow?: string | null
      isVisible?: boolean | null
      title?: string | null
    } | null
  } | null
  // Legacy structure fallback (before pages/branding/design split)
  friends?: {
    description?: string | null
    emptyDescription?: string | null
    eyebrow?: string | null
    title?: string | null
  } | null
  home?: {
    description?: string | null
    discordUserId?: string | null
    eyebrow?: string | null
    socialLinks?:
      | {
          icon?: string | null
          label?: string | null
          note?: string | null
          url?: string | null
        }[]
      | null
    title?: string | null
  } | null
  liveChat?: {
    title?: string | null
  } | null
  portfolio?: {
    description?: string | null
    emptyCategoryDescription?: string | null
    eyebrow?: string | null
    title?: string | null
  } | null
}

const getSafeColor = (value: string | null | undefined, fallback: string) => {
  if (!value) return fallback
  const trimmed = value.trim()
  if (!trimmed.startsWith('#')) return fallback
  return trimmed
}

export const getSiteContent = async () => {
  noStore()

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      depth: 1,
      slug: 'site-content',
    })) as SiteContentDoc

    const home = doc.pages?.home ?? doc.home
    const friends = doc.pages?.friends ?? doc.friends
    const portfolio = doc.pages?.portfolio ?? doc.portfolio
    const liveChat = doc.pages?.liveChat ?? doc.liveChat

    const socialLinks: SocialLink[] =
      home?.socialLinks
        ?.filter((link) => Boolean(link?.icon && link?.label && link?.note && link?.url))
        .map((link) => ({
          href: String(link.url),
          icon: String(link.icon),
          label: String(link.label),
          note: String(link.note),
        })) ?? []

    const navItems =
      doc.navigation?.items
        ?.filter((item) => item?.isVisible !== false && item?.label && item?.href)
        .map((item) => ({ href: String(item.href), label: String(item.label) })) ??
      DEFAULT_SITE_CONTENT.navigation.items

    return {
      branding: {
        logoAlt:
          typeof doc.branding?.logo === 'object' && doc.branding?.logo?.alt
            ? String(doc.branding.logo.alt)
            : 'Логотип',
        logoText: doc.branding?.logoText || DEFAULT_SITE_CONTENT.branding.logoText,
        logoUrl:
          typeof doc.branding?.logo === 'object' && doc.branding?.logo?.url
            ? String(doc.branding.logo.url)
            : undefined,
        siteDescription:
          doc.branding?.siteDescription || DEFAULT_SITE_CONTENT.branding.siteDescription,
        siteName: doc.branding?.siteName || DEFAULT_SITE_CONTENT.branding.siteName,
      },
      cardSettings: {
        columnsDesktop:
          doc.cardSettings?.columnsDesktop || DEFAULT_SITE_CONTENT.cardSettings.columnsDesktop,
        columnsMobile:
          doc.cardSettings?.columnsMobile || DEFAULT_SITE_CONTENT.cardSettings.columnsMobile,
        columnsTablet:
          doc.cardSettings?.columnsTablet || DEFAULT_SITE_CONTENT.cardSettings.columnsTablet,
        enableHoverExpand:
          doc.cardSettings?.enableHoverExpand ?? DEFAULT_SITE_CONTENT.cardSettings.enableHoverExpand,
        showStatusBadge:
          doc.cardSettings?.showStatusBadge ?? DEFAULT_SITE_CONTENT.cardSettings.showStatusBadge,
      },
      design: {
        accentColor: getSafeColor(doc.design?.accentColor, DEFAULT_SITE_CONTENT.design.accentColor),
        backgroundFrom: getSafeColor(
          doc.design?.backgroundFrom,
          DEFAULT_SITE_CONTENT.design.backgroundFrom,
        ),
        backgroundTo: getSafeColor(doc.design?.backgroundTo, DEFAULT_SITE_CONTENT.design.backgroundTo),
        glassOpacity: doc.design?.glassOpacity || DEFAULT_SITE_CONTENT.design.glassOpacity,
        panelRadius: doc.design?.panelRadius || DEFAULT_SITE_CONTENT.design.panelRadius,
      },
      footer: {
        copyright: doc.footer?.copyright || DEFAULT_SITE_CONTENT.footer.copyright,
        domainsText: doc.footer?.domainsText || DEFAULT_SITE_CONTENT.footer.domainsText,
        vertexpointUrl: doc.footer?.vertexpointUrl || DEFAULT_SITE_CONTENT.footer.vertexpointUrl,
      },
      navigation: {
        donateLabel: doc.navigation?.donateLabel || DEFAULT_SITE_CONTENT.navigation.donateLabel,
        donateUrl: doc.navigation?.donateUrl || DEFAULT_SITE_CONTENT.navigation.donateUrl,
        items: navItems,
      },
      pages: {
        friends: {
          description: friends?.description || DEFAULT_SITE_CONTENT.pages.friends.description,
          emptyDescription: friends?.emptyDescription || DEFAULT_SITE_CONTENT.pages.friends.emptyDescription,
          eyebrow: friends?.eyebrow || DEFAULT_SITE_CONTENT.pages.friends.eyebrow,
          isVisible:
            doc.pages?.friends?.isVisible ?? DEFAULT_SITE_CONTENT.pages.friends.isVisible,
          title: friends?.title || DEFAULT_SITE_CONTENT.pages.friends.title,
        },
        home: {
          description: home?.description || DEFAULT_SITE_CONTENT.pages.home.description,
          discordUserId: home?.discordUserId || DEFAULT_SITE_CONTENT.pages.home.discordUserId,
          eyebrow: home?.eyebrow || DEFAULT_SITE_CONTENT.pages.home.eyebrow,
          isVisible: doc.pages?.home?.isVisible ?? DEFAULT_SITE_CONTENT.pages.home.isVisible,
          socialLinks,
          title: home?.title || DEFAULT_SITE_CONTENT.pages.home.title,
        },
        liveChat: {
          isVisible:
            doc.pages?.liveChat?.isVisible ?? DEFAULT_SITE_CONTENT.pages.liveChat.isVisible,
          title: liveChat?.title || DEFAULT_SITE_CONTENT.pages.liveChat.title,
        },
        portfolio: {
          description: portfolio?.description || DEFAULT_SITE_CONTENT.pages.portfolio.description,
          emptyCategoryDescription:
            portfolio?.emptyCategoryDescription ||
            DEFAULT_SITE_CONTENT.pages.portfolio.emptyCategoryDescription,
          eyebrow: portfolio?.eyebrow || DEFAULT_SITE_CONTENT.pages.portfolio.eyebrow,
          isVisible:
            doc.pages?.portfolio?.isVisible ?? DEFAULT_SITE_CONTENT.pages.portfolio.isVisible,
          title: portfolio?.title || DEFAULT_SITE_CONTENT.pages.portfolio.title,
        },
      },
    }
  } catch (error) {
    console.error('getSiteContent failed, using defaults:', error)
    return {
      ...DEFAULT_SITE_CONTENT,
      branding: {
        ...DEFAULT_SITE_CONTENT.branding,
        logoAlt: 'Логотип',
        logoUrl: undefined,
      },
    }
  }
}
