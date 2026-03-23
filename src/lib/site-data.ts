export const DISCORD_USER_ID = '279672538735443978'

export type LinkItem = {
  href: string
  label: string
}

export type SocialLink = LinkItem & {
  icon: string
  note: string
}

export type ProjectStatus = 'done' | 'wip' | 'placeholder'

export type PortfolioProject = {
  description: string
  details?: string
  gallery?: { alt?: string; url: string }[]
  imageAlt?: string
  imageUrl?: string
  links?: LinkItem[]
  status: ProjectStatus
  title: string
}

export type PortfolioSection = {
  description?: string
  key: string
  title: string
  items: PortfolioProject[]
}

export type CollaboratorProfile = {
  about: string
  details?: string
  discordUserId?: string
  gallery?: { alt?: string; url: string }[]
  imageAlt?: string
  imageUrl?: string
  links: LinkItem[]
  name: string
  role: string
}

export const DEFAULT_SITE_CONTENT = {
  branding: {
    siteName: 'Rembo',
    siteDescription: 'Личный сайт и портфолио Rembo на Next.js + Payload CMS',
    logoText: 'Rembo',
  },
  cardSettings: {
    columnsDesktop: 3,
    columnsMobile: 1,
    columnsTablet: 2,
    enableHoverExpand: true,
    showStatusBadge: true,
  },
  design: {
    accentColor: '#63b3ed',
    backgroundFrom: '#080b12',
    backgroundTo: '#0f1624',
    glassOpacity: 72,
    panelRadius: 18,
  },
  footer: {
    copyright: '(c) Rembo',
    domainsText: 'foxlol.ru | faxlol.ru',
    vertexpointUrl: 'https://vertexpoint.ru',
  },
  navigation: {
    donateLabel: 'Донат',
    donateUrl: '#',
    items: [
      { href: '/', isVisible: true, label: 'Главная' },
      { href: '/portfolio', isVisible: true, label: 'Портфолио' },
      { href: '/friends', isVisible: true, label: 'Друзья' },
      { href: '/live-chat', isVisible: true, label: 'Live Chat' },
    ],
  },
  pages: {
    friends: {
      description: 'Мини-профили друзей и коллабораций настраиваются в CMS.',
      emptyDescription: 'Пока нет карточек друзей. Добавь их в коллекции "Друзья и коллабы".',
      eyebrow: 'Друзья',
      isVisible: true,
      title: 'Коллаборации',
    },
    home: {
      description:
        'Разрабатываю автоматизации под Telegram/Bitrix/Kuper, делаю 3D-контент для VRChat и веду личные pet-проекты.',
      discordUserId: DISCORD_USER_ID,
      eyebrow: 'Личная страница',
      isVisible: true,
      socialLinks: [
        {
          href: 'https://t.me/Rembovrc',
          icon: 'TG',
          label: 'Telegram @Rembovrc',
          note: 'Основной контакт',
        },
        {
          href: 'https://github.com/Rembo-Lox',
          icon: 'GH',
          label: 'GitHub Rembo-Lox',
          note: 'Код и open-source',
        },
        {
          href: 'https://discord.com/users/279672538735443978',
          icon: 'DC',
          label: 'Discord @nivan_',
          note: 'Профиль и активность',
        },
      ],
      title: 'Rembo',
    },
    liveChat: {
      isVisible: true,
      title: 'Live общий чат',
    },
    portfolio: {
      description: 'Проекты и категории полностью настраиваются из CMS.',
      emptyCategoryDescription: 'Добавь карточки в этой категории через CMS.',
      eyebrow: 'Портфолио',
      isVisible: true,
      title: 'Проекты по навыкам',
    },
  },
}

export const DEFAULT_SKILLS = [
  {
    title: 'Автоматизация / воронки / лиды (Telegram, Bitrix, Kuper)',
    slug: 'automation',
    sort: 100,
  },
  {
    title: '3D Blender / VRChat ассеты',
    slug: 'blender',
    sort: 200,
  },
  {
    title: '2D рисунки',
    slug: 'drawings',
    sort: 300,
  },
  {
    title: 'Логотипы и вектор',
    slug: 'logos',
    sort: 400,
  },
]
