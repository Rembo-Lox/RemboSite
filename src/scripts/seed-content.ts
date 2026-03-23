import { getPayloadClient } from '../lib/payload'
import { DEFAULT_SITE_CONTENT, DEFAULT_SKILLS } from '../lib/site-data'

const run = async () => {
  const payload = await getPayloadClient()

  const skillIdBySlug = new Map<string, number>()

  for (const skill of DEFAULT_SKILLS) {
    const existing = await payload.find({
      collection: 'skills',
      depth: 0,
      limit: 1,
      where: {
        slug: {
          equals: skill.slug,
        },
      },
    })

    if (existing.docs[0]?.id) {
      skillIdBySlug.set(skill.slug, Number(existing.docs[0].id))
      continue
    }

    const created = await payload.create({
      collection: 'skills',
      data: {
        isVisible: true,
        slug: skill.slug,
        sort: skill.sort,
        title: skill.title,
      },
      depth: 0,
    })

    skillIdBySlug.set(skill.slug, Number(created.id))
  }

  const projectDocs = [
    {
      description: 'Ведение лидов с обратной связью и статусами обработки в Telegram-каналах команды.',
      skillSlug: 'automation',
      sort: 100,
      status: 'done' as const,
      title: 'Воронка Bitrix -> Telegram',
    },
    {
      description:
        'Перенос новых лидов из Bitrix в CRM Kuper сразу после создания лидов в Bitrix. Проект в работе.',
      skillSlug: 'automation',
      sort: 110,
      status: 'wip' as const,
      title: 'Воронка Bitrix -> Kuper',
    },
    {
      description:
        'Учебник по toki pona: парсинг материалов с lipu-sona.pona.la/ru, простые квизы и карточки.',
      links: [{ label: 'Бот', url: 'https://t.me/RemboTrain_bot' }],
      skillSlug: 'automation',
      sort: 120,
      status: 'done' as const,
      title: '@RemboTrain_bot',
    },
  ]

  for (const doc of projectDocs) {
    const existing = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1,
      where: {
        title: {
          equals: doc.title,
        },
      },
    })

    if (existing.docs.length > 0) {
      continue
    }

    const skillId = skillIdBySlug.get(doc.skillSlug)
    if (!skillId) {
      continue
    }

    await payload.create({
      collection: 'projects',
      data: {
        description: doc.description,
        isVisible: true,
        links: doc.links,
        skill: skillId,
        sort: doc.sort,
        status: doc.status,
        title: doc.title,
      },
      depth: 0,
    })
  }

  const collabs = [
    {
      about: 'Короткий профиль коллаборатора. Можно редактировать в CMS.',
      discordUserId: '279672538735443978',
      isVisible: true,
      links: [{ label: 'Discord', url: 'https://discord.com/users/279672538735443978' }],
      name: 'Nivan',
      role: 'Automation / VR',
      sort: 100,
    },
  ]

  for (const doc of collabs) {
    const existing = await payload.find({
      collection: 'collaborators',
      depth: 0,
      limit: 1,
      where: {
        name: {
          equals: doc.name,
        },
      },
    })

    if (existing.docs.length > 0) {
      continue
    }

    await payload.create({
      collection: 'collaborators',
      data: doc,
      depth: 0,
    })
  }

  const globalDoc = await payload.findGlobal({
    depth: 0,
    slug: 'site-content',
  })

  const hasContent =
    Boolean(globalDoc?.branding?.siteName) ||
    Boolean(globalDoc?.navigation?.items?.length) ||
    Boolean(globalDoc?.pages?.home?.title)

  if (!hasContent) {
    await payload.updateGlobal({
      data: {
        branding: DEFAULT_SITE_CONTENT.branding,
        cardSettings: DEFAULT_SITE_CONTENT.cardSettings,
        design: DEFAULT_SITE_CONTENT.design,
        footer: DEFAULT_SITE_CONTENT.footer,
        navigation: DEFAULT_SITE_CONTENT.navigation,
        pages: {
          ...DEFAULT_SITE_CONTENT.pages,
          home: {
            ...DEFAULT_SITE_CONTENT.pages.home,
            socialLinks: DEFAULT_SITE_CONTENT.pages.home.socialLinks.map((link) => ({
              icon: link.icon,
              label: link.label,
              note: link.note,
              url: link.href,
            })),
          },
        },
      },
      slug: 'site-content',
    })
  }

  console.log('Seed completed')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
