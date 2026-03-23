import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    plural: 'Медиа',
    singular: 'Файл',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt-текст',
      admin: {
        description:
          'Короткое описание изображения для доступности (скринридеры) и SEO. Это не подпись на странице.',
      },
    },
  ],
  upload: true,
}
