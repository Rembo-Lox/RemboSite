import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Страница',
    plural: 'Страницы',
  },
  admin: {
    defaultColumns: ['title', 'slug', 'isPublished', 'showInNavigation', 'updatedAt'],
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
      label: 'Название страницы',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'URL-слаг',
      admin: {
        description: 'Например: services -> страница откроется по /services',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      label: 'Опубликовано',
    },
    {
      name: 'showInNavigation',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      label: 'Показывать в навигации',
    },
    {
      name: 'navigationLabel',
      type: 'text',
      label: 'Текст в навигации',
      admin: {
        description: 'Если пусто, используется "Название страницы".',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Конструктор страницы',
      labels: {
        singular: 'Блок',
        plural: 'Блоки',
      },
      blocks: [
        {
          slug: 'hero',
          labels: { singular: 'Hero-блок', plural: 'Hero-блоки' },
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Надзаголовок' },
            { name: 'title', type: 'text', required: true, label: 'Заголовок' },
            { name: 'description', type: 'textarea', label: 'Описание' },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Изображение (опционально)' },
          ],
        },
        {
          slug: 'text',
          labels: { singular: 'Текстовый блок', plural: 'Текстовые блоки' },
          fields: [
            { name: 'title', type: 'text', label: 'Заголовок' },
            { name: 'content', type: 'textarea', required: true, label: 'Текст' },
          ],
        },
        {
          slug: 'links',
          labels: { singular: 'Блок ссылок', plural: 'Блоки ссылок' },
          fields: [
            { name: 'title', type: 'text', label: 'Заголовок блока' },
            {
              name: 'items',
              type: 'array',
              label: 'Ссылки',
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Название' },
                { name: 'url', type: 'text', required: true, label: 'URL' },
                { name: 'note', type: 'text', label: 'Аннотация' },
              ],
            },
          ],
        },
      ],
      admin: {
        description:
          'Графический редактор структуры страницы: добавляй/удаляй/перетаскивай блоки, чтобы собрать новую страницу.',
      },
    },
  ],
}
