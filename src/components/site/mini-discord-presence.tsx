'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

type DiscordUser = {
  avatar?: string | null
  display_name?: string | null
  global_name?: string | null
  username?: string | null
}

type Presence = {
  activities?:
    | {
        details?: string | null
        name?: string | null
        state?: string | null
        type?: number
      }[]
    | null
  discord_status?: 'dnd' | 'idle' | 'offline' | 'online'
  discord_user?: DiscordUser
  spotify?: {
    artist?: string | null
    song?: string | null
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

const avatarUrl = (discordUserId: string, user?: DiscordUser) => {
  if (!user?.avatar) {
    return 'https://cdn.discordapp.com/embed/avatars/0.png'
  }

  return `https://cdn.discordapp.com/avatars/${discordUserId}/${user.avatar}.png?size=128`
}

export const MiniDiscordPresence = ({ discordUserId }: { discordUserId: string }) => {
  const [presence, setPresence] = useState<Presence | null>(null)

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

  const user = presence?.discord_user
  const displayName = user?.display_name || user?.global_name || user?.username || 'Unknown'
  const status = presence?.discord_status ?? 'offline'
  const spotify = presence?.spotify
  const spotifyUrl = spotify?.track_id ? `https://open.spotify.com/track/${spotify.track_id}` : null
  const customStatus = presence?.activities?.find((activity) => activity.type === 4)?.state
  const activity =
    presence?.activities
      ?.find((activity) => activity.type !== 4 && activity.name?.toLowerCase() !== 'spotify')
      ?.name || ''

  const statusLabel = useMemo(() => status, [status])

  return (
    <div className="mini-discord">
      <Image
        alt={displayName}
        className="mini-discord-avatar"
        height={36}
        src={avatarUrl(discordUserId, user)}
        width={36}
      />
      <div className="mini-discord-meta">
        <p className="mini-discord-name">{displayName}</p>
        <p className="mini-discord-status">{statusLabel}</p>
        {customStatus && <p className="mini-discord-extra">{customStatus}</p>}
        {activity && <p className="mini-discord-extra">{activity}</p>}
      </div>
      {spotify?.song && spotifyUrl && (
        <a className="mini-discord-spotify" href={spotifyUrl} rel="noreferrer" target="_blank">
          {spotify.song}
        </a>
      )}
    </div>
  )
}
