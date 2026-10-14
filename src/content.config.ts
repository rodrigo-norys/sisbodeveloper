/**
 * O frontmatter e deliberadamente neutro: nenhum campo depende do Astro, e o
 * corpo de cada arquivo e MDX sem componente proprietario. Trocar a camada de
 * apresentacao por outro framework move `src/content/` intacto.
 *
 * `translationKey` liga as versoes de um mesmo texto nos dois idiomas. Um texto
 * sem par simplesmente nao oferece a troca de idioma, em vez de levar a 404.
 */
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z as zod } from 'astro/zod'

const LOCALES = ['pt-br', 'en'] as const

const shared = {
  title: zod.string(),
  description: zod.string(),
  lang: zod.enum(LOCALES),
  translationKey: zod.string(),
  publishedAt: zod.coerce.date(),
  updatedAt: zod.coerce.date().optional(),
  draft: zod.boolean().default(false),
  /** Sobe para a primeira tela: e o que sinaliza engenharia, nao so escrita. */
  metrics: zod
    .array(zod.object({ label: zod.string(), value: zod.string(), href: zod.string().optional() }))
    .default([]),
}

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: zod.object({
    ...shared,
    topics: zod.array(zod.string()).default([]),
    relatedProjects: zod.array(zod.string()).default([]),
  }),
})

const HIGHLIGHT_ICONS = ['dashboard', 'shield', 'layers', 'code', 'database', 'table', 'document'] as const

/**
 * A pagina de projeto segue a da origem: abertura em duas linhas (a segunda em
 * gradiente) e uma grade de funcionalidades, cada uma com imagem e o link que a
 * prova. Imagem sem texto alternativo reprova o build, nao passa em silencio.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    zod
      .object({
        ...shared,
        problem: zod.string(),
        constraint: zod.string(),
        proves: zod.string(),
        stack: zod.array(zod.string()).default([]),
        status: zod.enum(['in-progress', 'delivered', 'archived']),
        repositoryUrl: zod.url().optional(),
        liveUrl: zod.url().optional(),
        featured: zod.boolean().default(false),
        headline: zod.object({ lead: zod.string(), highlight: zod.string() }).optional(),
        cover: image().optional(),
        coverAlt: zod.string().optional(),
        highlights: zod
          .array(
            zod
              .object({
                title: zod.string(),
                description: zod.string(),
                icon: zod.enum(HIGHLIGHT_ICONS),
                size: zod.enum(['large', 'small', 'wide']).default('small'),
                link: zod.object({ href: zod.url(), label: zod.string() }).optional(),
                image: image().optional(),
                imageAlt: zod.string().optional(),
              })
              .refine((item) => !item.image || item.imageAlt, { message: 'Funcionalidade com imagem precisa de imageAlt.' }),
          )
          .default([]),
      })
      .refine((data) => !data.cover || data.coverAlt, { message: 'Projeto com cover precisa de coverAlt.' }),
})

/**
 * O perfil e colecao, e nao markup dentro de `sobre.astro`: editar passa a ser
 * tocar um `.mdx`, e o schema recusa a versao de um idioma que esqueceu campo
 * que a outra tem.
 *
 * Ele estende `shared` pelo mesmo motivo que notas e projetos — e com isso
 * herda `metrics`, que e o bloco que leva numero para a primeira tela. A Sobre
 * era a unica peca do site sem ele.
 *
 * Duas decisoes que parecem detalhe e nao sao:
 *
 * 1. `engagementModels`, `availability` e `languages` sao ENUM, nunca texto
 *    traduzido. "PJ" nao tem equivalente em ingles, e o rotulo de cada valor
 *    vive em `src/i18n/ui.ts` — um fato, duas apresentacoes.
 * 2. Periodo e derivado de `startDate`/`endDate`, nao digitado. A string
 *    "2024 — hoje" precisaria ser reescrita em cada idioma, e divergiria na
 *    primeira edicao distraida.
 */
const ENGAGEMENT_MODELS = ['contractor', 'pj', 'clt', 'eor'] as const
const AVAILABILITY_STATES = ['open', 'selective', 'closed'] as const

const PLACEHOLDER_PATTERN = /FICT[\u00cdI]CIO|PLACEHOLDER/i

const profile = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/profile' }),
  schema: zod
    .object({
      ...shared,
      updatedAt: zod.coerce.date(),

      fullName: zod.string(),
      role: zod.string(),
      headline: zod.string(),

      location: zod.object({ city: zod.string(), country: zod.string() }),
      timezone: zod.string(),
      utcOffset: zod.string(),
      overlapHours: zod.string().optional(),
      engagementModels: zod.array(zod.enum(ENGAGEMENT_MODELS)).min(1),
      availability: zod.enum(AVAILABILITY_STATES),
      languages: zod.array(zod.string()).min(1),

      links: zod
        .array(
          zod.object({
            rel: zod.enum(['email', 'github', 'linkedin', 'site']),
            label: zod.string(),
            href: zod.string(),
            handle: zod.string().optional(),
          }),
        )
        .min(1),

      focusAreas: zod.array(zod.object({ title: zod.string(), detail: zod.string() })).max(4).default([]),

      /** Referencia por `translationKey`, nunca por URL: a rota muda com o idioma. */
      selectedWork: zod
        .array(
          zod.object({
            collection: zod.enum(['projects', 'notes']),
            translationKey: zod.string(),
            why: zod.string(),
          }),
        )
        .max(3)
        .default([]),

      experience: zod
        .array(
          zod.object({
            org: zod.string(),
            orgUrl: zod.url().optional(),
            role: zod.string(),
            startDate: zod.coerce.date(),
            endDate: zod.coerce.date().optional(),
            summary: zod.string(),
            highlights: zod.array(zod.string()).default([]),
          }),
        )
        .default([]),

      education: zod
        .array(
          zod.object({
            institution: zod.string(),
            institutionUrl: zod.url().optional(),
            course: zod.string(),
            startDate: zod.coerce.date(),
            endDate: zod.coerce.date().optional(),
          }),
        )
        .default([]),

      /** Lista plana e curta: o que se usa, nao inventario com nivel de dominio. */
      toolbelt: zod.array(zod.string()).max(12).default([]),

      resume: zod.object({ href: zod.string(), updatedAt: zod.coerce.date() }).optional(),
    })
    /**
     * A guarda que impede o pior desfecho: texto de preenchimento chegando ao ar.
     * `getEntry` NAO passa pelo filtro de rascunho de `src/lib/content.ts`, entao
     * marcar o perfil como `draft` nao protegeria nada — a pagina e servida
     * igual. Isto reprova o BUILD, que e o unico ponto por onde tudo passa.
     *
     * Ela falha FECHADO, e o escape e nomeado: `ALLOW_PLACEHOLDER_TEXT=1 npm run build`
     * compila com o preenchimento para voce conferir a estrutura. Quem digita a
     * variavel sabe o que esta fazendo; quem esquece de escrever o conteudo, nao.
     */
    .refine(
      (data) =>
        !import.meta.env.PROD ||
        process.env.ALLOW_PLACEHOLDER_TEXT === '1' ||
        !PLACEHOLDER_PATTERN.test(JSON.stringify(data)),
      { message: 'O perfil ainda tem texto de preenchimento (FICTÍCIO/PLACEHOLDER). Escreva o conteúdo real antes de publicar.' },
    ),
})

export const collections = { notes, projects, profile }
