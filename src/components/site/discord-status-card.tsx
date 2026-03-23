'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import { DISCORD_USER_ID } from '@/lib/site-data'

type DiscordUser = {
  avatar?: string | null
  display_name?: string | null
  global_name?: string | null
  username?: string | null
}

type Activity = {
  details?: string | null
  name?: string | null
  state?: string | null
  type?: number
}

type Spotify = {
  artist?: string | null
  song?: string | null
  timestamps?: {
    end?: number | null
    start?: number | null
  } | null
  track_id?: string | null
}

type Presence = {
  activities?: Activity[]
  discord_status?: 'dnd' | 'idle' | 'offline' | 'online'
  discord_user?: DiscordUser
  spotify?: Spotify | null
}

type LanyardPacket = {
  d?: Presence | { heartbeat_interval: number; subscribe_to_id?: string }
  op?: number
  t?: string
}

const STATUS_LABELS: Record<string, string> = {
  dnd: 'dnd',
  idle: 'idle',
  offline: 'offline',
  online: 'online',
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

const avatarUrl = (discordUserId: string, user?: DiscordUser) => {
  if (!user?.avatar) {
    return 'https://cdn.discordapp.com/embed/avatars/0.png'
  }

  return `https://cdn.discordapp.com/avatars/${discordUserId}/${user.avatar}.png?size=256`
}

export const DiscordStatusCard = ({ discordUserId }: { discordUserId?: string }) => {
  const targetUserId = discordUserId || DISCORD_USER_ID
  const [presence, setPresence] = useState<Presence | null>(null)
  const [isSocketConnected, setSocketConnected] = useState(false)
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    let alive = true
    let heartbeat: ReturnType<typeof setInterval> | null = null
    const socket = new WebSocket('wss://api.lanyard.rest/socket')

    const stopHeartbeat = () => {
      if (heartbeat) {
        clearInterval(heartbeat)
        heartbeat = null
      }
    }

    const loadSnapshot = async () => {
      const nextPresence = await fetchPresence(targetUserId).catch(() => null)
      if (alive && nextPresence) {
        setPresence(nextPresence)
      }
    }

    loadSnapshot()

    socket.onopen = () => setSocketConnected(true)
    socket.onclose = () => {
      setSocketConnected(false)
      stopHeartbeat()
    }
    socket.onerror = () => setSocketConnected(false)
    socket.onmessage = (event) => {
      const packet = JSON.parse(event.data) as LanyardPacket

      if (packet.op === 1 && packet.d && 'heartbeat_interval' in packet.d) {
        socket.send(JSON.stringify({ d: { subscribe_to_id: targetUserId }, op: 2 }))
        stopHeartbeat()
        heartbeat = setInterval(() => {
          socket.send(JSON.stringify({ op: 3 }))
        }, packet.d.heartbeat_interval)
        return
      }

      if (packet.op === 0 && (packet.t === 'INIT_STATE' || packet.t === 'PRESENCE_UPDATE') && packet.d) {
        setPresence(packet.d as Presence)
      }
    }

    return () => {
      alive = false
      stopHeartbeat()
      socket.close()
    }
  }, [targetUserId])

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const customStatus = useMemo(
    () => presence?.activities?.find((activity) => activity.type === 4)?.state,
    [presence],
  )

  const spotifyTrack = presence?.spotify
  const spotifyUrl = spotifyTrack?.track_id
    ? `https://open.spotify.com/track/${spotifyTrack.track_id}`
    : null

  const spotifyProgress = useMemo(() => {
    const start = spotifyTrack?.timestamps?.start
    const end = spotifyTrack?.timestamps?.end

    if (!start || !end || end <= start) {
      return 0
    }

    const value = ((nowMs - start) / (end - start)) * 100
    return Math.max(0, Math.min(100, value))
  }, [nowMs, spotifyTrack?.timestamps?.end, spotifyTrack?.timestamps?.start])

  const activity = useMemo(() => {
    const item = presence?.activities?.find((entry) => {
      if (entry.type === 4) return false
      if (entry.name?.toLowerCase() === 'spotify') return false
      return true
    })

    if (!item) return null

    return [item.name, item.details, item.state].filter(Boolean).join(' | ')
  }, [presence])

  const user = presence?.discord_user
  const displayName = user?.display_name || user?.global_name || user?.username || 'Unknown user'
  const username = user?.username ? `@${user.username}` : '@unknown'
  const status = presence?.discord_status ?? 'offline'

  return (
    <section className="glass-panel discord-card">
      <div className="discord-header">
        <Image
          alt={displayName}
          className="discord-avatar"
          height={64}
          src={avatarUrl(targetUserId, user)}
          width={64}
        />
        <div>
          <p className="eyebrow">Discord статус</p>
          <h3>{displayName}</h3>
          <p className="username">{username}</p>
        </div>
      </div>

      <div className="status-row">
        <span className={`status-dot ${status}`} />
        <span>{STATUS_LABELS[status] ?? 'offline'}</span>
        <span className="status-divider" />
        <span>{isSocketConnected ? 'Live update: on' : 'Live update: reconnecting'}</span>
      </div>

      {spotifyTrack?.song && spotifyUrl && (
        <a className="spotify-card" href={spotifyUrl} rel="noreferrer" target="_blank">
          <p className="spotify-title">
            Spotify: {spotifyTrack.song} - {spotifyTrack.artist ?? 'Unknown artist'}
          </p>
          <div aria-hidden className="spotify-progress">
            <div className="spotify-progress-fill" style={{ width: `${spotifyProgress}%` }} />
          </div>
        </a>
      )}

      <div className="discord-meta">
        <p>
          <strong>Custom status:</strong> {customStatus || 'не установлен'}
        </p>
        <p>
          <strong>Активность:</strong> {activity || 'нет активной активности'}
        </p>
      </div>
    </section>
  )
}
