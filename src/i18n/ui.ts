/**
 * Os textos da casca, nos dois idiomas. Conteudo editorial NAO passa por aqui:
 * nota e projeto vivem em `src/content/`, um arquivo por idioma.
 */
export const LOCALES = ['pt-br', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'pt-br'

export const LOCALE_LABELS: Record<Locale, string> = {
  'pt-br': 'Português',
  en: 'English',
}

export const ui = {
  'pt-br': {
    'nav.notes': 'Notas',
    'nav.projects': 'Projetos',
    'nav.about': 'Sobre',
    'nav.skipToContent': 'Pular para o conteúdo',
    'nav.label': 'Navegação principal',
    'home.cta.projects': 'Ver projetos',
    'home.cta.about': 'Sobre mim',
    'home.featuredProjects': 'Projetos em destaque',
    'home.recentNotes': 'Notas recentes',
    'home.seeAll': 'Ver todos',
    'notes.title': 'Notas',
    'notes.lead': 'Conclusões sobre engenharia de IA e de contexto — o método, antes do projeto.',
    'notes.empty': 'Nenhuma nota publicada ainda.',
    'projects.title': 'Projetos',
    'projects.lead': 'Cada projeto declara o problema, a restrição que dominou o desenho e o que a solução prova.',
    'projects.empty': 'Nenhum projeto publicado ainda.',
    'project.problem': 'Problema',
    'project.constraint': 'Restrição dominante',
    'project.proves': 'O que prova',
    'project.stack': 'Stack',
    'project.repository': 'Repositório',
    'project.live': 'No ar',
    'project.highlights': 'Funcionalidades em destaque',
    'project.decision': 'A decisão',
    'project.status.in-progress': 'Em andamento',
    'project.status.delivered': 'Entregue',
    'project.status.archived': 'Arquivado',
    'entry.published': 'Publicado em',
    'entry.updated': 'Atualizado em',
    'entry.relatedProjects': 'Exercido em',
    'entry.readInOtherLanguage': 'Read in English',
    'nav.system': 'Sistema',
    'system.title': 'O sistema deste site',
    'system.lead': 'Todo número desta página é computado quando o site é construído — lendo o CSS que o navegador consome e os arquivos que ele baixa. Nada aqui é digitado à mão.',
    'system.typography': 'Tipografia',
    'system.typographyLead': 'Três famílias, três papéis. Todas sob licença livre e servidas do próprio domínio.',
    'system.color': 'Cor',
    'system.colorLead': 'Os tokens saem de um arquivo só. A paleta slate/indigo e o brilho do fundo foram convertidos para oklch e conferidos de volta ao mesmo sRGB.',
    'system.contrast': 'Contraste conferido',
    'system.contrastLead': 'A conversão percorre oklch → OKLab → RGB linear → gama → recorte ao gamut, porque cor fora do gamut não exibe o que o valor nominal sugere.',
    'system.budget': 'Orçamento de tipografia',
    'system.rejected': 'O que foi descartado, e por qual número',
    'system.rejectedLead': 'Altura-x sobre o em, lida na tabela OS/2 do arquivo oficial. Para texto de tela, altura-x maior é mais legível no mesmo corpo.',
    'system.xheight': 'altura-x',
    'system.capheight': 'altura de maiúscula',
    'system.role': 'papel',
    'system.license': 'licença',
    'system.pair': 'par',
    'system.ratio': 'razão',
    'system.minimum': 'mínimo',
    'system.preloaded': 'pré-carregado',
    'system.total': 'total',
    'system.measuredAt': 'Métricas de fonte medidas em',
    'system.source': 'Origem',
    'about.contact': 'Contato',
    'about.focus': 'Foco',
    'about.experience': 'Experiência',
    'about.education': 'Formação',
    'about.toolbelt': 'Ferramentas',
    'about.selectedWork': 'Trabalho selecionado',
    'about.resume': 'Currículo',
    'about.present': 'hoje',
    'about.languages': 'Idiomas',
    'engagement.contractor': 'contractor',
    'engagement.pj': 'PJ',
    'engagement.clt': 'CLT',
    'engagement.eor': 'via EOR',
    'availability.open': 'Aberto a propostas',
    'availability.selective': 'Ouvindo propostas seletivamente',
    'availability.closed': 'Sem disponibilidade no momento',
    'about.updated': 'Atualizado em',
    'footer.credit': 'Desenvolvido por Rodrigo Norys',
  },
  en: {
    'nav.notes': 'Notes',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.skipToContent': 'Skip to content',
    'nav.label': 'Main navigation',
    'home.cta.projects': 'See projects',
    'home.cta.about': 'About me',
    'home.featuredProjects': 'Featured projects',
    'home.recentNotes': 'Recent notes',
    'home.seeAll': 'See all',
    'notes.title': 'Notes',
    'notes.lead': 'Conclusions on AI and context engineering — the method, before the project.',
    'notes.empty': 'No notes published yet.',
    'projects.title': 'Projects',
    'projects.lead': 'Each project states the problem, the constraint that drove the design, and what the solution proves.',
    'projects.empty': 'No projects published yet.',
    'project.problem': 'Problem',
    'project.constraint': 'Driving constraint',
    'project.proves': 'What it proves',
    'project.stack': 'Stack',
    'project.repository': 'Repository',
    'project.live': 'Live',
    'project.highlights': 'Featured capabilities',
    'project.decision': 'The decision',
    'project.status.in-progress': 'In progress',
    'project.status.delivered': 'Delivered',
    'project.status.archived': 'Archived',
    'entry.published': 'Published on',
    'entry.updated': 'Updated on',
    'entry.relatedProjects': 'Exercised in',
    'entry.readInOtherLanguage': 'Ler em português',
    'nav.system': 'System',
    'system.title': 'This site&rsquo;s system',
    'system.lead': 'Every number on this page is computed at build time — read from the CSS the browser consumes and the files it downloads. Nothing here is typed by hand.',
    'system.typography': 'Typography',
    'system.typographyLead': 'Three families, three roles. All under a free licence and served from this domain.',
    'system.color': 'Colour',
    'system.colorLead': 'Tokens come from a single file. The slate/indigo palette and the background glow were converted to oklch and checked back to the same sRGB.',
    'system.contrast': 'Contrast, checked',
    'system.contrastLead': 'The conversion goes oklch → OKLab → linear RGB → gamma → gamut clipping, because a colour outside the gamut does not display what its nominal value suggests.',
    'system.budget': 'Typography budget',
    'system.rejected': 'What was rejected, and by which number',
    'system.rejectedLead': 'x-height over the em, read from the OS/2 table of the official file. For screen text, a taller x-height reads better at the same size.',
    'system.xheight': 'x-height',
    'system.capheight': 'cap height',
    'system.role': 'role',
    'system.license': 'licence',
    'system.pair': 'pair',
    'system.ratio': 'ratio',
    'system.minimum': 'minimum',
    'system.preloaded': 'preloaded',
    'system.total': 'total',
    'system.measuredAt': 'Font metrics measured on',
    'system.source': 'Source',
    'about.contact': 'Contact',
    'about.focus': 'Focus',
    'about.experience': 'Experience',
    'about.education': 'Education',
    'about.toolbelt': 'Tools',
    'about.selectedWork': 'Selected work',
    'about.resume': 'Résumé',
    'about.present': 'present',
    'about.languages': 'Languages',
    'engagement.contractor': 'contractor',
    'engagement.pj': 'Brazilian PJ contract',
    'engagement.clt': 'Brazilian CLT employment',
    'engagement.eor': 'through an EOR',
    'availability.open': 'Open to opportunities',
    'availability.selective': 'Selectively open',
    'availability.closed': 'Not available right now',
    'about.updated': 'Updated on',
    'footer.credit': 'Built by Rodrigo Norys',
  },
} as const

export type UIKey = keyof (typeof ui)['pt-br']

export function useTranslations(locale: Locale) {
  return function translate(key: UIKey): string {
    return ui[locale][key]
  }
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'pt-br' ? 'en' : 'pt-br'
}

/** O periodo e derivado das datas, e nao digitado: uma string por idioma diverge. */
export function formatPeriod(start: Date, end: Date | undefined, locale: Locale): string {
  const startYear = start.getUTCFullYear()
  const endYear = end ? end.getUTCFullYear() : ui[locale]['about.present']
  return `${startYear} — ${endYear}`
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'pt-br' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
