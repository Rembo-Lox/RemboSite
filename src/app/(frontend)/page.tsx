import Link from 'next/link'

import { DiscordStatusCard } from '@/components/site/discord-status-card'
import { getSiteContent } from '@/lib/get-site-content'

export default async function HomePage() {
  const content = await getSiteContent()

  if (!content.pages.home.isVisible) {
    return (
      <section className="glass-panel">
        <h1>Страница скрыта</h1>
        <p className="lead">Главная страница отключена в CMS (Настройки сайта → Страницы → Главная).</p>
      </section>
    )
  }

  return (
    <div className="page-grid">
      <section className="glass-panel hero-panel">
        <p className="eyebrow">{content.pages.home.eyebrow}</p>
        <h1>{content.pages.home.title}</h1>
        <p className="lead">{content.pages.home.description}</p>

        <ul className="social-cards">
          {content.pages.home.socialLinks.length === 0 && (
            <li className="social-empty muted">Добавь ссылки в CMS: Настройки сайта → Страницы → Главная.</li>
          )}
          {content.pages.home.socialLinks.map((item) => (
            <li key={item.href}>
              <Link className="social-card-link" href={item.href} rel="noreferrer" target="_blank">
                <span className="social-icon">{item.icon}</span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.note}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <DiscordStatusCard discordUserId={content.pages.home.discordUserId} />
    </div>
  )
}
