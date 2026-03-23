import { InteractiveCardGrid } from '@/components/site/interactive-card-grid'
import { getPortfolioSections } from '@/lib/get-portfolio-sections'
import { getSiteContent } from '@/lib/get-site-content'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PortfolioPage() {
  const [sections, content] = await Promise.all([getPortfolioSections(), getSiteContent()])

  if (!content.pages.portfolio.isVisible) {
    return (
      <section className="glass-panel">
        <h1>Страница скрыта</h1>
        <p className="lead">Портфолио отключено в CMS (Настройки сайта → Страницы → Портфолио).</p>
      </section>
    )
  }

  return (
    <div className="page-stack">
      <section className="glass-panel">
        <p className="eyebrow">{content.pages.portfolio.eyebrow}</p>
        <h1>{content.pages.portfolio.title}</h1>
        <p className="lead">{content.pages.portfolio.description}</p>
      </section>

      {sections.map((section) => (
        <section className="portfolio-section glass-panel" key={section.key}>
          <h2>{section.title}</h2>
          {section.description ? <p className="lead">{section.description}</p> : null}
          <InteractiveCardGrid
            cards={section.items.map((item) => ({
              description: item.description,
              details: item.details,
              gallery: item.gallery,
              imageAlt: item.imageAlt,
              imageUrl: item.imageUrl,
              links: item.links,
              status: item.status,
              title: item.title,
            }))}
            emptyDescription={content.pages.portfolio.emptyCategoryDescription}
            enableHoverExpand={content.cardSettings.enableHoverExpand}
            mode="projects"
            showStatusBadge={content.cardSettings.showStatusBadge}
          />
        </section>
      ))}
    </div>
  )
}
