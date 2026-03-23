import { LiveChat } from '@/components/site/live-chat'
import { getSiteContent } from '@/lib/get-site-content'

export const dynamic = 'force-dynamic'

export default async function LiveChatPage() {
  const content = await getSiteContent()

  if (!content.pages.liveChat.isVisible) {
    return (
      <section className="glass-panel">
        <h1>Страница скрыта</h1>
        <p className="lead">Live chat отключен в CMS (Настройки сайта → Страницы → Live chat).</p>
      </section>
    )
  }

  return <LiveChat title={content.pages.liveChat.title} />
}
