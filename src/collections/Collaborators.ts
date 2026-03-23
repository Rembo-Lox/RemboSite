import type { CollectionConfig } from 'payload'

export const Collaborators: CollectionConfig = {
  slug: 'collaborators',
  labels: {
    plural: 'Друзья и коллабы',
    singular: 'Карточка друга',
  },
  admin: {
    defaultColumns: ['name', 'role', 'isVisible', 'updatedAt'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 80,
      label: 'Имя',
      admin: {
        description: 'Название карточки.',
      },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      maxLength: 120,
      label: 'Роль / специализация',
    },
    {
      name: 'about',
      type: 'textarea',
      required: true,
      label: 'Краткая сводка',
      admin: {
        description: 'Текст в карточке по умолчанию (нижняя 1/3 часть).',
      },
    },
    {
      name: 'details',
      type: 'textarea',
      label: 'Дополнительное описание (опционально)',
      admin: {
        description: 'Показывается в модальном окне карточки.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Главное изображение',
      admin: {
        description: 'Фон карточки.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Дополнительные изображения',
      admin: {
        description: 'Опциональная галерея в модальном окне.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Изображение',
        },
      ],
    },
    {
      name: 'discordUserId',
      type: 'text',
      index: true,
      label: 'Discord User ID (опционально)',
      admin: {
        description:
          'Если заполнить, в карточке и модальном окне появится live Discord-профиль в стиле главной.',
      },
    },
    {
      name: 'links',
      type: 'array',
      label: 'Соцсети и ссылки',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Название',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      label: 'Показывать карточку',
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 100,
      index: true,
      label: 'Порядок сортировки',
    },
  ],
}
