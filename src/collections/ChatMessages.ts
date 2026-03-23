import type { CollectionConfig } from 'payload'

const isAdmin = (user?: { id?: number | string } | null) => Boolean(user?.id)

export const ChatMessages: CollectionConfig = {
  slug: 'chat-messages',
  labels: {
    plural: 'Сообщения чата',
    singular: 'Сообщение',
  },
  admin: {
    defaultColumns: ['name', 'message', 'updatedAt', 'createdAt'],
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: () => true,
    update: ({ req }) => isAdmin(req.user),
    delete: ({ req }) => isAdmin(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 40,
      label: 'Ник',
      admin: {
        description: 'Имя отправителя в live-чате.',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 500,
      label: 'Текст сообщения',
      admin: {
        description: 'Содержимое сообщения. Можно редактировать в CMS.',
      },
    },
  ],
}
