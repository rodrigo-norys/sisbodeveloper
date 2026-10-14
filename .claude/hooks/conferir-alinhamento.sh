#!/usr/bin/env bash
# PostToolUse e ConfigChange — o aviso de alinhamento: aponta a peça de .claude/ — regra por
# caminho, skill, subagente, hook — que o arquivo de contexto não cita. Não bloqueia: o aviso
# sai como `systemMessage`, e o hook sai 0.
#
# Citar é ter o nome no arquivo de contexto sem letra, dígito, `_` ou `-` colado antes ou
# depois: a skill como se invoca, `/nome`; o subagente pelo nome, sem extensão; o hook e a regra
# pelo nome do arquivo. A guarda contexto-cita-pecas.test.mjs confere o mesmo no portão de
# qualidade, e é ela que garante: este aviso só chega antes.
#
# No PostToolUse, confere só quando a ferramenta escreveu em .claude/ ou no arquivo de
# contexto: a peça nova, ou a citação apagada. O ConfigChange cobre o que muda fora das
# ferramentas do agente, mas só nas configurações e nas skills: a regra, o subagente e o hook
# criados no editor passam calados até a guarda. Lê o disco, e não o git: o aviso é para antes
# do `git add`.
#
# Falha ABERTO, sempre com 0: só avisa, e no ConfigChange a saída 2 desfaria a mudança de
# configuração — aviso atrasado não justifica travar o trabalho.

set -uo pipefail

context_file="CLAUDE.md"

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
root=$(pwd)

payload=$(cat 2>/dev/null || printf '')

# O valor de um campo do evento: o caminho no `jq`, ou o nome da chave no recorte simples.
field() {
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$payload" | jq -r "$1 // empty" 2>/dev/null
  else
    printf '%s' "$payload" | grep -o "\"$2\"[^,}]*" | head -1 | cut -d'"' -f4
  fi
}

if [ "$(field .hook_event_name hook_event_name)" = "PostToolUse" ]; then
  written=$(field .tool_input.file_path file_path)
  case "${written#"$root"/}" in
    .claude/* | "$context_file") ;;
    *) exit 0 ;;
  esac
fi

[ -f "$context_file" ] || exit 0

# Citado: o nome no arquivo de contexto, sem caractere de nome colado antes ou depois.
cited() {
  local escaped
  escaped=$(printf '%s' "$1" | sed 's/[][\.*^$+?(){}|/]/\\&/g')
  grep -qE -- "(^|[^A-Za-z0-9_-])${escaped}([^A-Za-z0-9_-]|\$)" "$context_file"
}

missing=""
check() {
  cited "$1" || missing="$missing $1"
}

# Os arquivos de uma pasta de .claude/, sem o oculto e sem a cópia de segurança do editor.
pieces() {
  find "$@" -type f ! -name '.*' ! -name '*~' 2>/dev/null | sort
}

while IFS= read -r path; do check "$(basename "$path")"; done < <(pieces .claude/rules -name '*.md')
while IFS= read -r path; do
  check "/$(basename "$(dirname "$path")")"
done < <(pieces .claude/skills -mindepth 2 -maxdepth 2 -name SKILL.md)
while IFS= read -r path; do check "$(basename "$path" .md)"; done < <(pieces .claude/agents -name '*.md')
while IFS= read -r path; do check "$(basename "$path")"; done < <(pieces .claude/hooks)

[ -n "$missing" ] || exit 0

message="$context_file não cita:$missing — cite cada peça de .claude/ no arquivo de contexto: a skill como /nome, o subagente pelo nome, o hook e a regra pelo nome do arquivo."
message=$(printf '%s' "$message" | sed 's/\\/\\\\/g; s/"/\\"/g')
printf '{"systemMessage":"%s"}\n' "$message"
exit 0
