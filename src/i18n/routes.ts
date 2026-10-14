/**
 * Os segmentos de URL sao traduzidos: `/pt-br/notas/` e `/en/notes/`. O preco e
 * um arquivo fino por idioma em `src/pages/`; o ganho e URL legivel para quem
 * le, que e exatamente quem o site quer alcancar.
 */
import type { Locale } from './ui'

type Section = 'home' | 'notes' | 'projects' | 'about' | 'system'

const SEGMENTS: Record<Locale, Record<Section, string>> = {
  'pt-br': { home: '', notes: 'notas', projects: 'projetos', about: 'sobre', system: 'sistema' },
  en: { home: '', notes: 'notes', projects: 'projects', about: 'about', system: 'system' },
}

export function sectionUrl(locale: Locale, section: Section): string {
  const segment = SEGMENTS[locale][section]
  return segment === '' ? `/${locale}/` : `/${locale}/${segment}/`
}

export function entryUrl(locale: Locale, section: 'notes' | 'projects', slug: string): string {
  return `${sectionUrl(locale, section)}${slug}/`
}

/** O id que o loader monta inclui a pasta do idioma — `pt-br/minha-nota`. */
export function slugFromId(id: string): string {
  const parts = id.split('/')
  return parts[parts.length - 1]
}
