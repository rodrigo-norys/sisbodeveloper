#!/usr/bin/env bash
# Reprova dado sensivel no que iria para um commit e nas imagens do site gerado
# (REQ-28). E o lado que o hook guard-dados-sensiveis.sh nao alcanca: ele so ve
# o agente, e o commit feito pelo terminal ou pela web passava.
#
# Adaptado do .github/scripts/verifica-dados-sensiveis.sh do CronosComex
# (repositorio publico, main 7c26a3e). A guarda do nome de usuario de la fica de
# fora: aqui ele e o perfil publico do dono no GitHub.
#
# Falha FECHADO: qualquer achado devolve 1. Um falso positivo custa uma
# conversa; uma passagem falsa publica o dado num repositorio publico.
#
# Roda da raiz do repositorio, depois do build. Exige bash 4 e GNU grep:
#   bash .github/scripts/verifica-dados-sensiveis.sh

set -uo pipefail

findings=0
dist_directory="${DIST_DIRECTORY-dist}"
user_path='/home/[a-z0-9][a-z0-9._-]*/|/Users/[A-Za-z0-9][A-Za-z0-9._-]*/|[A-Za-z]:[\\/]+Users[\\/]'
image_extension='\.(jpe?g|png|gif|bmp|webp|avif|heic|heif|tiff?|ico|svg)$'

report() {
  findings=$((findings + 1))
  printf '\n[FALHA] %s (REQ-28)\n' "$1"
  printf '%s\n' "$2" | sed '/^$/d; s/^/  /'
}

# A regressao carrega, por natureza, os padroes que este script reprova: e a
# unica forma de provar que ele os pega. A isencao vale so para o caminho
# absoluto; a imagem e o arquivo de ambiente seguem valendo nelas.
is_guard_regression() {
  case "$1" in
    .github/scripts/verifica-dados-sensiveis.sh | .github/scripts/test-verifica-dados-sensiveis.sh | .claude/hooks/test-guard.sh) return 0 ;;
  esac
  return 1
}

# O que iria para um commit: o rastreado mais o novo que o .gitignore nao
# exclui, o mesmo conjunto de tests/support.mjs. O portao roda antes do
# `git add`, e so o rastreado deixaria passar o `.env.local` recem-criado.
#
# FILES_TO_CHECK e a entrada da regressao; `${VAR+defined}` separa "nao
# definida" de "definida e vazia", porque a lista vazia e um caso. O `-z` nao e
# estilo: sem ele o git cita entre aspas o nome fora do ASCII, e a aspa no fim
# da linha derrota a ancora `$` dos padroes abaixo.
if [ -n "${FILES_TO_CHECK+defined}" ]; then
  candidates="$FILES_TO_CHECK"
else
  candidates="$(git ls-files -z --cached --others --exclude-standard | tr '\0' '\n')" || {
    printf 'git ls-files falhou: rode da raiz de um repositorio git (REQ-28).\n' >&2
    exit 1
  }
fi
candidates="$(printf '%s\n' "$candidates" | grep -v '^$' || true)"

matching() { printf '%s\n' "$candidates" | grep -iE "$1" || true; }

# 1. Arquivo de ambiente, pelo nome, em qualquer diretorio: o conjunto que o
#    Vite carrega e o .dev.vars do Wrangler. `.env.example` e o molde, a mesma
#    excecao do hook.
environment_files="$(matching '(^|/)(\.env|\.dev\.vars)(\..+)?$' | grep -vE '(^|/)\.env\.example$' || true)"
[ -n "$environment_files" ] && report 'Arquivo de ambiente versionado.' "$environment_files"

# 2. Artefato de build: o build o refaz, e ele carrega o que o build expos.
build_artifacts="$(matching '^(dist|\.astro)/|(^|/)node_modules/')"
[ -n "$build_artifacts" ] && report 'Artefato de build versionado.' "$build_artifacts"

# 3. Caminho absoluto de usuario em codigo e configuracao, que e tudo menos o
#    documento: em docs/ e nos .md da raiz, discutir caminho e o trabalho, com
#    `/home/fulano/` de exemplo. A barra final separa o diretorio de usuario de
#    um caminho qualquer sob /home.
absolute_paths=''
while IFS= read -r file; do
  [ -n "$file" ] || continue
  is_guard_regression "$file" && continue
  grep -Iq . "$file" 2>/dev/null || continue
  found="$(grep -nE "$user_path" "$file" 2>/dev/null || true)"
  [ -n "$found" ] && absolute_paths+="$file"$'\n'"$(printf '%s' "$found" | sed 's/^/    /')"$'\n'
done <<< "$(printf '%s\n' "$candidates" | grep -vE '^docs/|^[^/]+\.md$' || true)"
[ -n "$absolute_paths" ] && report 'Caminho absoluto de usuario em codigo ou configuracao.' "$absolute_paths"

# 4. Imagem fora de src/assets/ e public/.
tracked_images="$(matching "$image_extension")"
misplaced_images="$(printf '%s\n' "$tracked_images" | grep -vE '^(src/assets|public)/' | grep -v '^$' || true)"
[ -n "$misplaced_images" ] && report 'Imagem versionada fora de src/assets/ e public/.' "$misplaced_images"

# 5. Metadado dentro da imagem, versionada e do site gerado, por busca de bytes
#    e sem parser: acha o BLOCO pela assinatura — EXIF, XMP, IPTC, texto e EXIF
#    do PNG, EXIF e XMP do WebP, <metadata> do SVG — e reprova qualquer um, nao
#    so o que traz autor ou GPS, porque ler a tag exigiria parser. O padrao de
#    caminho de usuario corre tambem dentro do binario, e pega o comentario do
#    JPEG, que fica fora das assinaturas. Erra para o lado de reprovar: a
#    assinatura pode aparecer por acaso no dado comprimido.
metadata_in() {
  local file="$1" signature='Exif\x00\x00|<x:xmpmeta|http://ns\.adobe\.com/xap/1\.0/|Photoshop 3\.0\x00'
  case "${file,,}" in
    *.png) signature+='|tEXt|zTXt|iTXt|eXIf' ;;
    *.webp) signature+='|EXIF|XMP ' ;;
    *.svg) signature+='|<metadata' ;;
  esac
  LC_ALL=C grep -aqP "$signature" "$file" 2>/dev/null && printf '%s: bloco de metadado\n' "$file"
  LC_ALL=C grep -aqE "$user_path" "$file" 2>/dev/null && printf '%s: caminho de usuario\n' "$file"
  return 0
}

if [ -d "$dist_directory" ]; then
  dist_images="$(find "$dist_directory" -type f | grep -iE "$image_extension" | sort || true)"
else
  dist_images=''
  report 'Site gerado ausente: as imagens dele nao foram lidas; rode o build antes.' "$dist_directory"
fi

image_metadata=''
while IFS= read -r file; do
  [ -n "$file" ] && [ -f "$file" ] || continue
  image_metadata+="$(metadata_in "$file")"$'\n'
done <<< "$tracked_images"$'\n'"$dist_images"
image_metadata="$(printf '%s' "$image_metadata" | grep -v '^$' || true)"
[ -n "$image_metadata" ] && report 'Metadado dentro de imagem: tire-o antes de versionar (exiftool -all=).' "$image_metadata"

count() { printf '%s' "$1" | grep -c . || true; }

printf '\n'
if [ "$findings" -gt 0 ]; then
  printf 'Reprovado: %d verificacao(oes) achou(aram) dado sensivel.\n' "$findings"
  printf 'Tire o arquivo do controle de versao, ou o metadado da imagem, e confira o .gitignore.\n'
  printf 'Se o blob ja foi empurrado, remover na branch NAO basta: o historico guarda.\n'
  exit 1
fi

printf 'Aprovado: %d arquivos e %d imagens do site gerado, sem dado sensivel.\n' "$(count "$candidates")" "$(count "$dist_images")"
exit 0
