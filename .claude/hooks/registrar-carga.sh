#!/usr/bin/env bash
# InstructionsLoaded — o registro de carga: uma linha por instrução que entra em contexto, o
# arquivo de contexto ou uma regra por caminho, com quando, por quê e qual, e a sessão. Não
# imprime nada.
#
# A linha, separada por tabulação: o instante em UTC, o motivo da carga (`load_reason`), o
# caminho relativo à raiz do projeto e o começo do ID da sessão. O arquivo de fora do projeto
# — o CLAUDE.md do usuário, por exemplo — vira <externo>/<nome>: o caminho absoluto levaria o
# nome de usuário do sistema para o registro.
#
# Como ler: a regra por caminho que carregou porque o agente tocou arquivo do caminho dela
# aparece como `path_glob_match`; a que aparece sempre como `session_start` teve o `paths:`
# ignorado — o frontmatter que não se lê faz a regra carregar em toda sessão. O limite: o
# registro mostra o que carregou, nunca o que deveria ter carregado e não carregou; essa falta
# só aparece nas transcrições das sessões.
#
# Grava em .claude/local/, que o projeto põe no .gitignore: o registro é da máquina de quem
# trabalha, e nenhuma guarda o lê — a medição fica fora do caminho.
#
# Falha ABERTO: só mede, e medir não justifica atrapalhar a sessão. Sem `set -e`, todo comando
# tolera falha, e o `exit 0` do fim é explícito. Sem `jq`, a leitura do evento é um recorte
# simples, que erra no caminho com vírgula ou chave: medir menos é melhor que não medir.

set -u

log="${CLAUDE_PROJECT_DIR:-.}/.claude/local/registro-de-carga.log"
max_lines=5000

# O `2>/dev/null` vem antes do redirecionamento do arquivo: a falha de abri-lo — a pasta sem
# permissão de escrita — também se cala, em vez de sair no stderr com o caminho absoluto.
record() {
  mkdir -p "$(dirname "$log")" 2>/dev/null || return 0

  # Acima do limite, fica a metade mais nova: o arquivo não cresce sem fim, e a série recente
  # continua inteira.
  if [ -f "$log" ]; then
    local total
    total=$(wc -l 2>/dev/null < "$log" || echo 0)
    if [ "$total" -gt "$max_lines" ]; then
      tail -n $((max_lines / 2)) "$log" 2>/dev/null > "$log.tmp" &&
        mv "$log.tmp" "$log" 2>/dev/null
    fi
  fi

  printf '%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$4" 2>/dev/null >> "$log"
}

# O valor de uma chave do topo do evento, numa linha só: a tabulação e a quebra de linha
# partiriam o registro.
field() {
  local value
  if command -v jq >/dev/null 2>&1; then
    value=$(printf '%s' "$payload" | jq -r --arg key "$1" '.[$key] // empty' 2>/dev/null)
  else
    value=$(printf '%s' "$payload" | grep -o "\"$1\"[^,}]*" | head -1 | cut -d'"' -f4)
  fi
  value=${value//$'\t'/ }
  printf '%s' "${value//$'\n'/ }"
}

payload=$(cat 2>/dev/null || printf '')
[ -n "$payload" ] || exit 0

reason=$(field load_reason)
file=$(field file_path)
session=$(field session_id)

# O `%/` cobre o CLAUDE_PROJECT_DIR com barra no fim, que sem ele deixaria todo caminho
# absoluto.
root="${CLAUDE_PROJECT_DIR:-}"
relative="$file"
[ -n "$root" ] && relative="${file#"${root%/}"/}"
case "$relative" in
  /*) file="<externo>/$(basename "$relative")" ;;
  *) file="$relative" ;;
esac

session="${session:-?}"
record "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "${reason:-?}" "${file:-?}" "${session:0:8}"

exit 0
