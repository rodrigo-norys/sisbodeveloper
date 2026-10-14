#!/usr/bin/env bash
# PreToolUse/Bash — bloqueia, antes da execucao, comandos que podem publicar
# segredo, sobrescrever caminho protegido ou destruir trabalho.
#
# Fecha o que regra de permissao nao alcanca: staging forcado, redirecionamento
# de saida, 'git diff --output=' e remocao recursiva.
#
# Falha FECHADO: sem jq ou com entrada ilegivel, bloqueia em vez de liberar.
# Um bloqueio falso custa redigitar um comando; uma passagem falsa publica
# segredo no repositorio de um site publico.

set -uo pipefail

block() {
  echo "BLOQUEADO por guard-dados-sensiveis: $1" >&2
  echo "Se a acao for mesmo necessaria, execute-a voce mesmo no terminal." >&2
  exit 2
}

command -v jq >/dev/null 2>&1 || block "jq ausente — o guard nao pode inspecionar o comando."

payload=$(cat)
full_command=$(printf '%s' "$payload" | jq -r '.tool_input.command // empty' 2>/dev/null) \
  || block "entrada do hook ilegivel."

[ -n "$full_command" ] || exit 0

# Os testes rodam por subcomando, nao sobre a string inteira. Sem isso um
# `grep "git add" arquivo` casaria como se fosse staging real. Os separadores
# sao os mesmos que o Claude Code reconhece ao avaliar regras de permissao.
split_subcommands() {
  printf '%s\n' "$1" | sed -E 's/(\&\&|\|\||;|\|)/\n/g'
}

# O conjunto que o Vite carrega: `.env`, `.env.local`, `.env.[mode]` e
# `.env.[mode].local`. O .gitignore cobre so `.env` e `.env.production`, entao
# os demais passariam por ele. O teste e pelo NOME do arquivo, em qualquer
# diretorio. `.env.example` e a excecao: e o molde versionavel, sem valor real.
is_env_file() {
  case "${1##*/}" in
    .env.example) return 1 ;;
    .env|.env.*) return 0 ;;
  esac
  return 1
}

# O `.claude/` protegido e o DESTE projeto. Casar a substring em qualquer caminho
# bloqueava tambem ~/.claude/, onde vivem arquivos de trabalho fora do
# repositorio. Relativo se testa por segmento; absoluto, so dentro da raiz.
# `~`, `$HOME` e `$CLAUDE_PROJECT_DIR` se expandem antes, para nao virarem
# atalho em volta do teste, e travessia anula a confianca no prefixo: cai no
# teste por segmento, que falha fechado.
is_project_claude_path() {
  local path="$1" root="${CLAUDE_PROJECT_DIR:-}" home="${HOME:-}"
  root="${root%/}"

  case "$path" in
    '~/'*|'$HOME/'*|'${HOME}/'*)
      [ -n "$home" ] && path="${home%/}/${path#*/}" ;;
    '$CLAUDE_PROJECT_DIR/'*|'${CLAUDE_PROJECT_DIR}/'*)
      path="${path#*/}" ;;
  esac

  if [ -n "$root" ]; then
    case "$path" in
      *..*) ;;
      "$root"/*) path="${path#"$root"/}" ;;
      /*) return 1 ;;
    esac
  fi

  case "/$path/" in
    */.claude/*) return 0 ;;
  esac
  return 1
}

check_git_add() {
  local subcommand="$1"
  case "$subcommand" in
    "git add"*) ;;
    *) return 0 ;;
  esac

  case " $subcommand " in
    *" -f "*|*" --force"*)
      block "'git add' com --force anula o .gitignore e leva segredo ou artefato local ao historico." ;;
    *" -A "*|*" --all "*|*" . "*)
      block "'git add' em massa. Adicione caminho a caminho, para que a lista seja revisavel." ;;
  esac

  # Testa CAMINHO A CAMINHO, e nao a linha inteira: a excecao do exemplo precisa
  # valer para o caminho que a satisfaz sem liberar os outros argumentos do mesmo
  # comando. Caminho com espaco quebra em varios tokens e cai no bloqueio — falha
  # fechado, que e a direcao certa.
  local argument path
  for argument in ${subcommand#git add}; do
    path=$(printf '%s' "$argument" | tr -d "\"'")

    is_env_file "$path" &&
      block "'git add' apontando para arquivo de ambiente: $argument"

    case "$path" in
      *".claude/logs"*)
        block "'git add' apontando para log local dos hooks: $argument" ;;
    esac
  done
}

check_redirect() {
  local subcommand="$1"

  # Testa o ALVO do redirecionamento, nao a linha inteira: um `2>/dev/null` em
  # comando que apenas mencione .claude/ nao e escrita em caminho protegido.
  local targets
  targets=$(printf '%s' "$subcommand" \
    | grep -oE '[0-9]*>>?[[:space:]]*[^[:space:];|&<>]+' \
    | sed -E 's/^[0-9]*>>?[[:space:]]*//')
  [ -n "$targets" ] || return 0

  local target
  while IFS= read -r target; do
    [ -n "$target" ] || continue
    target=$(printf '%s' "$target" | tr -d "\"'")

    is_env_file "$target" &&
      block "redirecionamento de saida para arquivo de ambiente: $target"

    is_project_claude_path "$target" &&
      block "redirecionamento de saida para caminho protegido: $target"
  done <<EOF
$targets
EOF
}

check_git_diff_output() {
  case "$1" in
    "git diff"*"--output"*)
      block "'git diff --output=' escreve arquivo sob um comando de aparencia somente-leitura." ;;
  esac
}

check_recursive_remove() {
  local subcommand="$1"
  case "$subcommand" in
    "rm "*) ;;
    *) return 0 ;;
  esac

  case " $subcommand " in
    *" -rf "*|*" -fr "*|*" -r "*|*" -R "*|*" --recursive "*) ;;
    *) return 0 ;;
  esac

  # Testa ARGUMENTO A ARGUMENTO e SEGMENTO A SEGMENTO, como check_git_add ja
  # faz. Glob sobre a linha inteira deixa passar o caso mais destrutivo de
  # todos — o diretorio nu, `rm -rf src`, quando o glob exige a barra.
  # Comparar segmento tambem evita o falso positivo que o sufixo criaria —
  # `mydocs` e `websrc` nao sao `docs` nem `src`.
  #
  # A lista e dos diretorios versionaveis DESTE projeto; `dist`, `.astro` e
  # `node_modules` ficam fora de proposito, porque sao regeneraveis. Diretorio
  # versionado criado depois do guard nao entra sozinho: acrescente-o aqui.
  local argument path segment
  for argument in ${subcommand#rm}; do
    case "$argument" in
      -*) continue ;;
    esac

    path=$(printf '%s' "$argument" | tr -d "\"'")

    case "$path" in
      .|..|./|../) block "remocao recursiva do diretorio corrente: $argument" ;;
    esac

    while [ -n "$path" ]; do
      segment="${path##*/}"
      case "$segment" in
        src|public|docs|.vscode|.claude|.git)
          block "remocao recursiva em diretorio versionavel do projeto: $argument" ;;
      esac
      case "$path" in
        */*) path="${path%/*}" ;;
        *) path="" ;;
      esac
    done
  done
}

while IFS= read -r raw_subcommand; do
  subcommand=$(printf '%s' "$raw_subcommand" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//; s/[[:space:]]+/ /g')
  [ -n "$subcommand" ] || continue

  check_git_add "$subcommand"
  check_redirect "$subcommand"
  check_git_diff_output "$subcommand"
  check_recursive_remove "$subcommand"
done < <(split_subcommands "$full_command")

exit 0
