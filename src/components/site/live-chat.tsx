'use client'

import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

type ChatMessage = {
  createdAt: string
  id: string
  message: string
  name: string
}

export const LiveChat = ({ title }: { title?: string }) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMessages = useCallback(async () => {
    const response = await fetch('/api/live-chat', { cache: 'no-store' })
    const payload = (await response.json()) as { messages?: ChatMessage[] }

    setMessages(payload.messages ?? [])
  }, [])

  useEffect(() => {
    loadMessages().catch(() => setError('Не удалось загрузить сообщения.'))
    const timer = setInterval(() => {
      loadMessages().catch(() => null)
    }, 4000)

    return () => clearInterval(timer)
  }, [loadMessages])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSending(true)

    try {
      const response = await fetch('/api/live-chat', {
        body: JSON.stringify({ message: text, name }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('send-error')
      }

      setText('')
      await loadMessages()
    } catch {
      setError('Сообщение не отправлено. Попробуй снова.')
    } finally {
      setSending(false)
    }
  }

  const handleMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <section className="chat-page">
      <div className="chat-topbar glass-panel">
        <h2>{title || 'Live общий чат'}</h2>
      </div>

      <div className="chat-layout">
        <article className="glass-panel chat-stream">
          {messages.length === 0 && <p className="muted">Пока пусто. Напиши первое сообщение.</p>}

          {messages.map((item) => (
            <div className="chat-message" key={item.id}>
              <div className="chat-message-head">
                <strong>{item.name}</strong>
                <time dateTime={item.createdAt}>
                  {new Date(item.createdAt).toLocaleString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </time>
              </div>
              <p>{item.message}</p>
            </div>
          ))}
        </article>

        <aside className="glass-panel chat-form-panel">
          <h3>Отправить сообщение</h3>
          <form className="chat-form" onSubmit={handleSubmit} ref={formRef}>
            <label>
              Ник (опционально)
              <input
                maxLength={40}
                onChange={(event) => setName(event.target.value)}
                placeholder="Гость"
                value={name}
              />
            </label>

            <label>
              Сообщение
              <textarea
                maxLength={500}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={handleMessageKeyDown}
                placeholder="Напиши что-нибудь в чат..."
                required
                rows={5}
                value={text}
              />
            </label>

            {error && <p className="error-text">{error}</p>}
            <button className="button-primary" disabled={sending} type="submit">
              {sending ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        </aside>
      </div>
    </section>
  )
}
