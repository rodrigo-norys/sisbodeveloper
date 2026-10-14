/**
 * A consulta as colecoes num lugar so: filtro por idioma, ordem por data e a
 * busca da traducao. Rascunho aparece no `dev` e some no build — ver `PROD`.
 */
import { getCollection, type CollectionEntry } from 'astro:content'
import type { Locale } from '../i18n/ui'

type ContentCollection = 'notes' | 'projects'

const includeDrafts = !import.meta.env.PROD

export async function listEntries<Collection extends ContentCollection>(
  collection: Collection,
  locale: Locale,
): Promise<CollectionEntry<Collection>[]> {
  const entries = await getCollection(collection, ({ data }) => {
    return data.lang === locale && (includeDrafts || !data.draft)
  })

  return entries.sort((first, second) => second.data.publishedAt.valueOf() - first.data.publishedAt.valueOf())
}

export async function findTranslation<Collection extends ContentCollection>(
  collection: Collection,
  translationKey: string,
  targetLocale: Locale,
): Promise<CollectionEntry<Collection> | undefined> {
  const entries = await getCollection(collection, ({ data }) => {
    return data.lang === targetLocale && data.translationKey === translationKey && (includeDrafts || !data.draft)
  })

  return entries[0]
}
