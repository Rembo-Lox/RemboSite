import { getPayloadClient } from '@/lib/payload'

type ChatDoc = {
  createdAt?: string
  id?: string | number
  message?: string
  name?: string
}

const normalizeDoc = (doc: ChatDoc) => ({
  createdAt: doc.createdAt ?? new Date().toISOString(),
  id: String(doc.id ?? ''),
  message: doc.message ?? '',
  name: doc.name ?? 'Гость',
})

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'chat-messages',
      depth: 0,
      limit: 50,
      sort: '-createdAt',
    })

    const messages = (result.docs as ChatDoc[]).map(normalizeDoc).reverse()
    return Response.json({ messages })
  } catch {
    return Response.json({ messages: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: unknown; name?: unknown }
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 500) : ''
    const rawName = typeof body.name === 'string' ? body.name.trim().slice(0, 40) : ''
    const name = rawName || 'Гость'

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    const created = (await payload.create({
      collection: 'chat-messages',
      data: { message, name },
      depth: 0,
    })) as ChatDoc

    return Response.json({ message: normalizeDoc(created) }, { status: 201 })
  } catch {
    return Response.json({ error: 'Cannot create message' }, { status: 500 })
  }
}
