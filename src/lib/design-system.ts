/**
 * A pagina do sistema NAO repete numero digitado: ela le o estado real no build.
 *
 * Os tokens saem de `src/styles/global.css`, que e o mesmo arquivo que o
 * navegador consome — se alguem mudar uma cor, a pagina muda junto e a conta de
 * contraste e refeita. Os bytes saem dos woff2 versionados. O que NAO e
 * computavel aqui e a metrica interna da fonte, porque o woff2 e comprimido:
 * ela vem de `src/design/font-metrics.json`, com a origem e a data da medicao
 * declaradas no proprio arquivo.
 *
 * A conversao oklch -> sRGB percorre o caminho inteiro (OKLab, LMS, RGB linear,
 * gama, recorte ao gamut, e de volta a linear) porque cor fora do gamut nao
 * exibe o que o valor nominal sugere — e e exatamente ai que um contraste
 * afirmado deixa de bater com o exibido.
 */
import { statSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * O CSS entra pelo bundler com `?raw`, e nao por `fs`: no build o modulo e
 * movido para `dist/.prerender/`, entao qualquer caminho relativo a
 * `import.meta.url` resolve para o lugar errado. Com `?raw` quem resolve e o
 * Vite, em tempo de compilacao, e o conteudo vem embutido.
 */
import globalCss from '../styles/global.css?raw'

export interface Rgb {
  red: number
  green: number
  blue: number
}

function parseOklch(value: string) {
  const match = value.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)/i)
  if (!match) throw new Error(`não reconheci a cor: ${value}`)
  const rawLightness = Number(match[1])
  return {
    lightness: rawLightness > 1 ? rawLightness / 100 : rawLightness,
    chroma: Number(match[2]),
    hue: Number(match[3]),
  }
}

function oklchToLinearRgb(value: string): [number, number, number] {
  const { lightness, chroma, hue } = parseOklch(value)
  const hueRadians = (hue * Math.PI) / 180
  const greenRed = chroma * Math.cos(hueRadians)
  const blueYellow = chroma * Math.sin(hueRadians)

  const longCone = (lightness + 0.3963377774 * greenRed + 0.2158037573 * blueYellow) ** 3
  const mediumCone = (lightness - 0.1055613458 * greenRed - 0.0638541728 * blueYellow) ** 3
  const shortCone = (lightness - 0.0894841775 * greenRed - 1.291485548 * blueYellow) ** 3

  return [
    4.0767416621 * longCone - 3.3077115913 * mediumCone + 0.2309699292 * shortCone,
    -1.2684380046 * longCone + 2.6097574011 * mediumCone - 0.3413193965 * shortCone,
    -0.0041960863 * longCone - 0.7034186147 * mediumCone + 1.707614701 * shortCone,
  ]
}

const applyGamma = (channel: number) =>
  channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055
const removeGamma = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4

export function toSrgb(value: string): { rgb: Rgb; outOfGamut: boolean } {
  const linearRgb = oklchToLinearRgb(value)
  const channels = linearRgb.map((channel) => Math.min(255, Math.max(0, Math.round(applyGamma(channel) * 255))))
  return {
    rgb: { red: channels[0], green: channels[1], blue: channels[2] },
    outOfGamut: linearRgb.some((channel) => channel < -0.001 || channel > 1.001),
  }
}

function relativeLuminance(value: string): number {
  const { rgb } = toSrgb(value)
  const [red, green, blue] = [rgb.red, rgb.green, rgb.blue].map((channel) => removeGamma(channel / 255))
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(foreground)
  const backgroundLuminance = relativeLuminance(background)
  const [lighter, darker] =
    foregroundLuminance > backgroundLuminance
      ? [foregroundLuminance, backgroundLuminance]
      : [backgroundLuminance, foregroundLuminance]
  return (lighter + 0.05) / (darker + 0.05)
}

export interface Token {
  name: string
  value: string
  rgb: Rgb
  outOfGamut: boolean
}

/**
 * Extrai os tokens do CSS que o navegador consome — nao de uma segunda copia.
 * O esquema e unico: o bloco `:root` inteiro e a paleta.
 */
export function readTokens(): Token[] {
  const css = globalCss
  const rootStart = css.indexOf(':root {')
  const rootBlock = css.slice(rootStart, css.indexOf('}', rootStart))

  return [...rootBlock.matchAll(/--([a-z-]+):\s*(oklch\([^)]+\));/g)].map(([, name, value]) => {
    const srgb = toSrgb(value)
    return { name, value, rgb: srgb.rgb, outOfGamut: srgb.outOfGamut }
  })
}

export interface ContrastPair {
  foreground: string
  background: string
  role: string
  minimum: number
  ratio: number
  passes: boolean
}

const CONTRAST_PAIRS: { foreground: string; background: string; role: string; minimum: number }[] = [
  { foreground: 'ink', background: 'paper', role: 'Texto do corpo', minimum: 7 },
  { foreground: 'ink', background: 'surface', role: 'Texto sobre superfície', minimum: 7 },
  { foreground: 'muted', background: 'paper', role: 'Texto secundário', minimum: 4.5 },
  { foreground: 'muted', background: 'surface', role: 'Secundário sobre superfície', minimum: 4.5 },
  { foreground: 'accent', background: 'paper', role: 'Link', minimum: 4.5 },
  { foreground: 'accent', background: 'surface', role: 'Link sobre superfície', minimum: 4.5 },
  { foreground: 'on-accent', background: 'accent-strong', role: 'Texto do botão principal', minimum: 4.5 },
  { foreground: 'rule-strong', background: 'paper', role: 'Linha estrutural (SC 1.4.11)', minimum: 3 },
  { foreground: 'rule-strong', background: 'surface', role: 'Linha sobre superfície (SC 1.4.11)', minimum: 3 },
]

export function measureContrasts(tokens: Token[]): ContrastPair[] {
  const tokensByName = new Map(tokens.map((token) => [token.name, token]))

  return CONTRAST_PAIRS.map((pair) => {
    const foreground = tokensByName.get(pair.foreground)
    const background = tokensByName.get(pair.background)
    if (!foreground || !background) throw new Error(`par de contraste aponta para token inexistente: ${pair.foreground}/${pair.background}`)

    const ratio = contrastRatio(foreground.value, background.value)
    return { ...pair, ratio, passes: ratio >= pair.minimum }
  })
}

export interface FontFile {
  fileName: string
  bytes: number
}

/** Bytes vem do disco: o tamanho do arquivo nao e importavel como modulo. */
export function readFontFiles(): FontFile[] {
  const fontsDirectory = join(process.cwd(), 'src/assets/fonts')
  return readdirSync(fontsDirectory)
    .filter((fileName) => fileName.endsWith('.woff2'))
    .map((fileName) => ({ fileName, bytes: statSync(join(fontsDirectory, fileName)).size }))
    .sort((first, second) => second.bytes - first.bytes)
}
