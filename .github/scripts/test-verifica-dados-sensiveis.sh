#!/usr/bin/env bash
# Regressao do verifica-dados-sensiveis.sh.
#
# Sem ela uma regex quebrada falha em SILENCIO: o script segue saindo 0 e
# dizendo "aprovado". Os casos de `accepts` nao sao enfeite: cada um e um falso
# positivo que a estrutura do script torna provavel.
#
# Convencao: `rejects` espera exit 1, `accepts` espera exit 0. O terceiro
# argumento e a lista de arquivos, um por linha, que entra por FILES_TO_CHECK;
# o quarto, o site gerado, que por padrao e um diretorio vazio.
#
# As imagens sao montadas byte a byte, so com o cabecalho e o bloco que o caso
# exercita: o script procura a assinatura do bloco, e nao decodifica a imagem.
# O nome de usuario e ficticio, e este arquivo nao carrega o do sistema.
#
# Exige bash 4, GNU grep e git, os mesmos do script.

set -uo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
target="$script_dir/verifica-dados-sensiveis.sh"
[ -f "$target" ] || { echo "script nao encontrado: $target" >&2; exit 1; }

sandbox=$(mktemp -d) || exit 1
trap 'rm -rf -- "$sandbox"' EXIT
mkdir -p "$sandbox/dist"

passed=0
failed=0

record() {
  local expected="$1" actual="$2" label="$3"
  if [ "$actual" -eq "$expected" ]; then
    passed=$((passed + 1))
  else
    failed=$((failed + 1))
    printf 'FALHOU  esperava %s, obteve %s  <-  %s\n' "$expected" "$actual" "$label" >&2
  fi
}

run_case() {
  local expected="$1" label="$2" files="$3" dist="${4:-dist}"
  (cd "$sandbox" && FILES_TO_CHECK="$files" DIST_DIRECTORY="$dist" bash "$target") >/dev/null 2>&1
  record "$expected" "$?" "$label"
}

rejects() { run_case 1 "$@"; }
accepts() { run_case 0 "$@"; }

# O conteudo passa pelo printf como formato: `\xNN` vira o byte.
create_file() {
  mkdir -p "$sandbox/$(dirname -- "$1")"
  printf "$2" > "$sandbox/$1"
}

jpeg_start='\xff\xd8'
jpeg_end='\xff\xd9'
jfif='\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00'
png_start='\x89PNG\r\n\x1a\n\x00\x00\x00\x0dIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde'
png_end='\x00\x00\x00\x00IEND\xaeB`\x82'
webp_start='RIFF\x1a\x00\x00\x00WEBPVP8L\x0a\x00\x00\x00\x2f\x00\x00\x00\x10\x07\x10\x11\x11\x88'

# --- arquivo de ambiente -------------------------------------------------
rejects '.env na raiz' '.env'
rejects '.env.production.local em subdiretorio' 'src/.env.production.local'
rejects '.dev.vars do Wrangler' '.dev.vars'
rejects '.env.example com sufixo' '.env.example.bak'
accepts '.env.example, o molde' '.env.example'
accepts 'nome que lembra ambiente' $'src/env.d.ts\nsrc/lib/environment.ts\n.environment'

# --- artefato de build -----------------------------------------------------
rejects 'dist/ versionado' 'dist/index.html'
rejects '.astro/ versionado' '.astro/types.d.ts'
rejects 'node_modules/ aninhado' 'tools/node_modules/pacote/index.js'
accepts 'nome parecido com build' $'src/lib/distance.ts\ndocs/dist.md'

# --- caminho absoluto de usuario ------------------------------------------
create_file src/lib/leak.ts 'const root = "/home/fulano/Desktop/site"\n'
create_file astro.config.mjs 'export default { root: "/Users/fulano/site/" }\n'
create_file tests/windows.mjs 'const root = "C:\\\\Users\\\\fulano\\\\site"\n'
create_file src/content/notes/pt-br/nota.mdx 'veja /home/fulano/notas/\n'
create_file src/lib/profile.ts 'export const github = "https://github.com/rodrigo-norys"\n'
create_file src/lib/system.ts 'const base = "/home/" // a pasta, sem usuario\n'
create_file docs/marcador.md 'o exemplo e /home/fulano/projeto\n'
create_file CLAUDE.md 'nunca grave em /home/fulano/\n'
create_file .claude/hooks/test-guard.sh 'fixed_env=(CLAUDE_PROJECT_DIR=/home/dev/site HOME=/home/dev)\n'
rejects '/home/fulano/ em src/' 'src/lib/leak.ts'
rejects 'caminho do macOS em configuracao' 'astro.config.mjs'
rejects 'caminho do Windows em teste' 'tests/windows.mjs'
rejects 'caminho de usuario no conteudo' 'src/content/notes/pt-br/nota.mdx'
accepts 'endereco do perfil publico no GitHub' 'src/lib/profile.ts'
accepts '/home sem usuario' 'src/lib/system.ts'
accepts 'caminho de exemplo em docs/' 'docs/marcador.md'
accepts 'caminho de exemplo num .md da raiz' 'CLAUDE.md'
accepts 'payload da regressao do hook' '.claude/hooks/test-guard.sh'

# A isencao da regressao vale so para o caminho: imagem nela segue reprovando.
rejects 'regressao nao isenta imagem fora do lugar' $'.claude/hooks/test-guard.sh\n.claude/hooks/print.png'

# --- imagem fora de src/assets/ e public/ ---------------------------------
rejects 'imagem na raiz' 'foto.png'
rejects 'imagem em docs/' 'docs/print.jpg'
rejects 'svg em componente' 'src/components/icone.svg'

# --- metadado dentro da imagem --------------------------------------------
create_file src/assets/limpa.jpg "$jpeg_start$jfif$jpeg_end"
create_file src/assets/icc.jpg "$jpeg_start\xff\xe2\x00\x10ICC_PROFILE\x00\x01\x01$jpeg_end"
create_file src/assets/gps.jpg "$jpeg_start\xff\xe1\x00\x26Exif\x00\x00MM\x00\x2a\x00\x00\x00\x08\x00\x01\x88\x25\x00\x04\x00\x00\x00\x01\x00\x00\x00\x1a\x00\x00\x00\x00$jpeg_end"
create_file src/assets/xmp.jpg "$jpeg_start\xff\xe1\x00\x5ahttp://ns.adobe.com/xap/1.0/\x00<x:xmpmeta><dc:creator>Fulano</dc:creator></x:xmpmeta>$jpeg_end"
create_file src/assets/iptc.jpg "$jpeg_start\xff\xed\x00\x14Photoshop 3.0\x008BIM$jpeg_end"
create_file src/assets/comentario.jpg "$jpeg_start\xff\xfe\x00\x1e/home/fulano/fotos/original.jpg$jpeg_end"
create_file public/limpa.png "$png_start$png_end"
create_file public/autor.png "$png_start\x00\x00\x00\x0dtEXtAuthor\x00Fulano\x00\x00\x00\x00$png_end"
create_file public/limpa.svg '<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>\n'
create_file public/metadata.svg '<svg xmlns="http://www.w3.org/2000/svg"><metadata><dc:creator>Fulano</dc:creator></metadata></svg>\n'
rejects 'JPEG com GPS em src/assets/' 'src/assets/gps.jpg'
rejects 'JPEG com XMP de autor' 'src/assets/xmp.jpg'
rejects 'JPEG com IPTC' 'src/assets/iptc.jpg'
rejects 'caminho de usuario no comentario do JPEG' 'src/assets/comentario.jpg'
rejects 'PNG com texto de autor' 'public/autor.png'
rejects 'SVG com <metadata>' 'public/metadata.svg'
accepts 'imagens sem metadado' $'src/assets/limpa.jpg\nsrc/assets/icc.jpg\npublic/limpa.png\npublic/limpa.svg'

# --- o site gerado ---------------------------------------------------------
create_file dist-clean/_astro/foto.webp "$webp_start"
create_file dist-exif/_astro/foto.webp "${webp_start}EXIF\x08\x00\x00\x00II\x2a\x00\x08\x00\x00\x00"
create_file dist-xmp/_astro/foto.webp "${webp_start}XMP \x10\x00\x00\x00<x:xmpmeta/>    "
accepts 'site gerado sem metadado' '' dist-clean
rejects 'WebP do site gerado com EXIF' '' dist-exif
rejects 'WebP do site gerado com XMP' '' dist-xmp
rejects 'site gerado ausente' '' dist-inexistente

# --- lista vazia ------------------------------------------------------------
accepts 'lista de arquivos vazia' ''

# --- sem FILES_TO_CHECK: a lista sai do git --------------------------------
# O que importa e o rastreado e o novo que o .gitignore nao exclui. Montado num
# repositorio descartavel; o indice e o desta copia, e nao o do projeto.
repository="$sandbox/repositorio"
mkdir -p "$repository/dist" "$repository/src"
git -C "$repository" init -q
printf 'export const ok = 1\n' > "$repository/src/ok.ts"
printf '.env.ignorado\n' > "$repository/.gitignore"
git -C "$repository" add src/ok.ts .gitignore
run_git_case() {
  local expected="$1" label="$2"
  (cd "$repository" && bash "$target") >/dev/null 2>&1
  record "$expected" "$?" "$label"
}
run_git_case 0 'repositorio limpo'
printf 'VITE_KEY=valor\n' > "$repository/.env.local"
git -C "$repository" add .env.local
run_git_case 1 '.env.local rastreado'
git -C "$repository" rm -q --cached .env.local
run_git_case 1 '.env.local novo, fora do .gitignore'
rm -f "$repository/.env.local"
printf 'VITE_KEY=valor\n' > "$repository/.env.ignorado"
run_git_case 0 'arquivo de ambiente que o .gitignore exclui'
rm -f "$repository/.env.ignorado"
# Sem `-z`, o git cita o nome acentuado entre aspas, o arquivo nao abre, e o
# caminho dentro dele passa calado.
mkdir -p "$repository/configuração"
printf 'const root = "/home/fulano/site"\n' > "$repository/configuração/raiz.ts"
run_git_case 1 'caminho de usuario em pasta acentuada, pelo git'

total=$((passed + failed))
if [ "$failed" -eq 0 ]; then
  printf 'verifica-dados-sensiveis: %s casos, todos passaram\n' "$total"
  exit 0
fi

printf 'verifica-dados-sensiveis: %s casos, %s FALHARAM\n' "$total" "$failed" >&2
exit 1
