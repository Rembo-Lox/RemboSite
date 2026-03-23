import type { CollectionConfig } from 'payload'

const isSuperAdmin = (user?: { role?: string } | null) => user?.role === 'superadmin'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    plural: 'Пользователи',
    singular: 'Пользователь',
  },
  admin: {
    defaultColumns: ['email', 'role', 'updatedAt'],
    useAsTitle: 'email',
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: async ({ req }) => {
      const hasUsers = (await req.payload.count({ collection: 'users' })).totalDocs > 0
      if (!hasUsers) {
        return true
      }
      return isSuperAdmin(req.user)
    },
    delete: ({ req }) => isSuperAdmin(req.user),
    read: ({ req }) => {
      if (isSuperAdmin(req.user)) {
        return true
      }
      if (!req.user?.id) {
        return false
      }
      return {
        id: {
          equals: req.user.id,
        },
      }
    },
    update: ({ req }) => {
      if (isSuperAdmin(req.user)) {
        return true
      }
      if (!req.user?.id) {
        return false
      }
      return {
        id: {
          equals: req.user.id,
        },
      }
    },
  },
  auth: true,
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') {
          return data
        }

        const hasUsers = (await req.payload.count({ collection: 'users' })).totalDocs > 0
        if (!hasUsers) {
          return {
            ...data,
            role: 'superadmin',
          }
        }

        if (!isSuperAdmin(req.user)) {
          return {
            ...data,
            role: 'admin',
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      maxLength: 80,
      admin: {
        description: 'Имя, которое отображается в интерфейсе и профиле.',
      },
      label: 'Отображаемое имя',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'admin',
      label: 'Роль',
      options: [
        { label: 'Главный администратор', value: 'superadmin' },
        { label: 'Администратор', value: 'admin' },
      ],
      required: true,
      admin: {
        description:
          'Только главный администратор может создавать/удалять пользователей и назначать роли.',
      },
    },
  ],
}
