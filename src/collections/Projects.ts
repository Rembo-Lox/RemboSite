import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    plural: 'Проекты',
    singular: 'Проект',
  },
  admin: {
    defaultColumns: ['title', 'skill', 'status', 'updatedAt'],
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 120,
      label: 'Название',
      admin: {
        description: 'Короткий заголовок карточки.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Краткая сводка',
      admin: {
        description: 'Показывается в нижней части карточки.',
      },
    },
    {
      name: 'details',
      type: 'textarea',
      label: 'Подробное описание',
      admin: {
        description: 'Показывается в модальном окне карточки (опционально).',
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
        description: 'Листаемая галерея в модальном окне (опционально).',
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
      name: 'skill',
      type: 'relationship',
      relationTo: 'skills',
      required: true,
      label: 'Категория',
      admin: {
        description: 'Категория из коллекции "Категории".',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'wip',
      label: 'Статус',
      options: [
        { label: 'Готово', value: 'done' },
        { label: 'В работе', value: 'wip' },
        { label: 'Заглушка', value: 'placeholder' },
      ],
      admin: {
        description: 'Бейдж на карточке проекта.',
      },
    },
    {
      name: 'links',
      type: 'array',
      label: 'Ссылки',
      admin: {
        description: 'Кнопки/ссылки проекта: GitHub, Telegram, сайт и т.д.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Название ссылки',
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
      admin: {
        description: 'Быстро скрыть карточку с сайта без удаления.',
      },
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 100,
      index: true,
      label: 'Порядок сортировки',
      admin: {
        description: 'Чем меньше число, тем выше карточка в категории.',
      },
    },
  ],
}
