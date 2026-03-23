import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { ChatMessages } from './collections/ChatMessages'
import { Collaborators } from './collections/Collaborators'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Pages } from './collections/Pages'
import { Skills } from './collections/Skills'
import { Users } from './collections/Users'
import { SiteContent } from './globals/SiteContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Skills, Projects, Collaborators, ChatMessages],
  globals: [SiteContent],
  editor: lexicalEditor(),
  i18n: {
    fallbackLanguage: 'ru',
    supportedLanguages: {
      ru,
    },
  },
  secret: process.env.PAYLOAD_SECRET || 'rembo-site-dev-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./payload.db',
    },
  }),
  sharp,
})
