import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
  labels: {
    singular: 'Категория',
    plural: 'Категории',
  },
  admin: {
    defaultColumns: ['title', 'slug', 'isVisible', 'sort', 'updatedAt'],
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
      label: 'Название категории',
      admin: {
        description: 'Заголовок секции на странице портфолио.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Слаг',
      admin: {
        description: 'Служебный код категории (например: automation, blender).',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание категории',
      admin: {
        description: 'Опционально: текст под заголовком категории в портфолио.',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      label: 'Показывать категорию',
      admin: {
        description: 'Если выключено, категория и проекты из нее скрываются на сайте.',
      },
    },
    {
      name: 'sort',
      type: 'number',
      defaultValue: 100,
      index: true,
      label: 'Порядок сортировки',
      admin: {
        description: 'Чем меньше число, тем выше категория в списке.',
      },
    },
  ],
}
