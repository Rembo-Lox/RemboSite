'use client'

import { useEffect, useMemo, useState } from 'react'

type Presence = {
  discord_status?: 'dnd' | 'idle' | 'offline' | 'online'
  spotify?: {
    timestamps?: { end?: number | null; start?: number | null } | null
    track_id?: string | null
  } | null
}

const fetchPresence = async (discordUserId: string): Promise<Presence | null> => {
  const response = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`, {
    cache: 'no-store',
  })
  const payload = (await response.json()) as { data?: Presence; success?: boolean }

  if (!response.ok || !payload.success || !payload.data) {
    return null
  }

  return payload.data
}

export const MiniDiscordCardBadge = ({ discordUserId }: { discordUserId: string }) => {
  const [presence, setPresence] = useState<Presence | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    let alive = true

    const load = async () => {
      const data = await fetchPresence(discordUserId).catch(() => null)
      if (alive) {
        setPresence(data)
      }
    }

    load()
    const timer = setInterval(load, 20000)

    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [discordUserId])

  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const status = presence?.discord_status ?? 'offline'
  const spotifyProgress = useMemo(() => {
    const start = presence?.spotify?.timestamps?.start
    const end = presence?.spotify?.timestamps?.end
    if (!start || !end || end <= start) return null
    const value = ((nowMs - start) / (end - start)) * 100
    return Math.max(0, Math.min(100, value))
  }, [nowMs, presence?.spotify?.timestamps?.end, presence?.spotify?.timestamps?.start])

  return (
    <div className="mini-card-discord">
      <span className={`status-dot ${status}`} />
      <span className="mini-card-discord-label">{status}</span>
      {spotifyProgress !== null ? (
        <div className="mini-card-spotify-progress" role="presentation">
          <div className="mini-card-spotify-progress-fill" style={{ width: `${spotifyProgress}%` }} />
        </div>
      ) : null}
    </div>
  )
}
