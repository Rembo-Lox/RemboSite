import { InteractiveCardGrid } from '@/components/site/interactive-card-grid'
import { getCollaborators } from '@/lib/get-collaborators'
import { getSiteContent } from '@/lib/get-site-content'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function FriendsPage() {
  const [collaborators, content] = await Promise.all([getCollaborators(), getSiteContent()])

  if (!content.pages.friends.isVisible) {
    return (
      <section className="glass-panel">
        <h1>Страница скрыта</h1>
        <p className="lead">Страница друзей отключена в CMS (Настройки сайта → Страницы → Друзья).</p>
      </section>
    )
  }

  return (
    <div className="page-stack">
      <section className="glass-panel">
        <p className="eyebrow">{content.pages.friends.eyebrow}</p>
        <h1>{content.pages.friends.title}</h1>
        <p className="lead">{content.pages.friends.description}</p>
      </section>

      <section className="portfolio-section glass-panel">
        <InteractiveCardGrid
          cards={collaborators.map((profile) => ({
            description: profile.about,
            details: profile.details,
            discordUserId: profile.discordUserId,
            gallery: profile.gallery,
            imageAlt: profile.imageAlt,
            imageUrl: profile.imageUrl,
            links: profile.links,
            subtitle: profile.role,
            title: profile.name,
          }))}
          emptyDescription={content.pages.friends.emptyDescription}
          enableHoverExpand={content.cardSettings.enableHoverExpand}
          mode="friends"
          showStatusBadge={false}
        />
      </section>
    </div>
  )
}
