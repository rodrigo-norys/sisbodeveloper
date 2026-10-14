#!/usr/bin/env bash
# Teste de regressao do guard-dados-sensiveis.sh.
#
# Sem este teste uma regex quebrada falha em SILENCIO — o hook segue saindo 0,
# e a protecao some sem que nada avise.
#
# Convencao: `blocks` espera exit 2, `allows` espera exit 0. Pares VAR=valor
# depois do comando mudam o ambiente daquele caso (`VAR=` deixa vazio).
# Os casos de `allows` nao sao enfeite: cada um e um falso positivo que a
# estrutura do guard torna provavel, e a maioria e comando que a sessao de
# planejamento ou a execucao vao de fato rodar.
#
# O ambiente e FICTICIO e fixo: o guard so compara texto, entao a raiz e o HOME
# nao precisam existir, e este arquivo nao carrega o nome de usuario do SO. O
# guard roda num diretorio vazio porque expande glob sem aspas no proprio cwd:
# sem isso `rm -rf src/*` mudaria de veredito conforme a arvore de quem roda.
#
# Exige `bash` e `jq`.

set -uo pipefail

hook_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
guard="$hook_dir/guard-dados-sensiveis.sh"

[ -f "$guard" ] || { echo "guard nao encontrado: $guard" >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "jq ausente — o guard depende dele" >&2; exit 1; }

bash_bin=$(command -v bash)
fixed_env=(CLAUDE_PROJECT_DIR=/home/dev/site HOME=/home/dev)

sandbox=$(mktemp -d) || exit 1
trap 'rm -rf -- "$sandbox"' EXIT

passed=0
failed=0

record() {
  local expected="$1" actual="$2" label="$3"
  if [ "$actual" -eq "$expected" ]; then
    passed=$((passed + 1))
  else
    failed=$((failed + 1))
    printf 'FALHOU  esperava %s, obteve %s  <-  %s\n' "$expected" "$actual" "${label//$'\n'/\\n}" >&2
  fi
}

run_case() {
  local expected="$1" command="$2"
  shift 2
  jq -nc --arg c "$command" '{tool_input:{command:$c}}' \
    | (cd "$sandbox" && env "${fixed_env[@]}" "$@" "$bash_bin" "$guard") >/dev/null 2>&1
  record "$expected" "$?" "$command${*:+  [$*]}"
}

run_payload() {
  local expected="$1" payload="$2"
  printf '%s' "$payload" \
    | (cd "$sandbox" && env "${fixed_env[@]}" "$bash_bin" "$guard") >/dev/null 2>&1
  record "$expected" "$?" "payload: $payload"
}

blocks() { run_case 2 "$@"; }
allows() { run_case 0 "$@"; }
payload_blocks() { run_payload 2 "$1"; }
payload_allows() { run_payload 0 "$1"; }

# --- staging forcado ou em massa -------------------------------------------
blocks 'git add -f dist/index.html'
blocks 'git add --force dist'
blocks 'git add dist -f'
blocks 'git add -f .env.local'
blocks 'git add -A'
blocks 'git add --all'
blocks 'git add .'
blocks 'git add -- .'
blocks 'git add -A src/pages'
blocks 'git  add -A'

# --- arquivo de ambiente no staging ----------------------------------------
# O conjunto que o Vite carrega, testado pelo NOME, em qualquer diretorio. O
# .gitignore cobre so `.env` e `.env.production`: os outros so o guard segura.
blocks 'git add .env'
blocks "git add '.env.local'"
blocks 'git add ".env.production"'
blocks 'git add ./.env.local'
blocks 'git add -- .env.local'
blocks 'git add src/.env.development'
blocks 'git add /home/dev/site/.env.local'
blocks 'git add .env.production.local'
blocks 'git add .env.sample'

# `.env.example` e a unica excecao, e so pelo nome exato.
allows 'git add .env.example'
allows 'git add docs/.env.example'
blocks 'git add .env.example.bak'
blocks 'git add .env.example.local'

# A excecao vale para o molde, nunca para o vizinho no mesmo comando.
blocks 'git add .env.example .env.local'
blocks 'git add src/x.astro .env.production.local'
allows 'git add .env.example .gitignore'

# Nome que lembra ambiente sem ser arquivo de ambiente.
allows 'git add src/env.d.ts'
allows 'git add src/lib/environment.ts'
allows 'git add docs/env.md'
allows 'git add .environment'

# --- log local dos hooks ---------------------------------------------------
blocks 'git add .claude/logs'
blocks 'git add .claude/logs/instrucoes-carregadas.log'
blocks 'git add "./.claude/logs/registro.log"'
blocks 'git add /home/dev/site/.claude/logs/instrucoes.log'

# O resto de .claude/ e versionavel.
allows 'git add .claude/settings.json .claude/hooks/guard-dados-sensiveis.sh'
allows 'git add .claude/hooks/*.sh'
allows 'git add .claude/'
allows 'git add --chmod=+x .claude/hooks/guard-dados-sensiveis.sh'

# --- redirecionamento para arquivo de ambiente -----------------------------
blocks 'echo "VITE_API_URL=https://api.exemplo.com" > .env'
blocks 'echo "VITE_KEY=abc" >> .env.local'
blocks 'cat .env.example > .env'
blocks "printf 'VITE_X=1\n' > src/.env.production.local"
blocks 'echo X=1 > /home/dev/site/.env.development'
blocks 'echo X=1 > "$CLAUDE_PROJECT_DIR/.env"'
blocks "echo X=1 > '.env.staging'"
blocks 'echo X=1 1>.env'
blocks 'npm run build &> .env'
blocks 'npm run build &>> .env.local'
blocks 'npm run build 2>.env.local'
blocks '>.env echo X=1'
blocks $'cat <<EOF > .env\nVITE_A=1\nEOF'
blocks $'cat > .env.local <<\'EOF\'\nVITE_A=1\nEOF'
blocks '{ echo X=1; echo Y=2; } > .env'
blocks '(echo X=1) > .env'
allows 'echo "VITE_API_URL=" >> .env.example'

# Leitura e mencao nao sao escrita.
allows 'cat < .env'
allows 'cat .env.local 2>&1 | head -n 3'
allows 'test -f .env && echo existe || echo ausente'
allows "echo '.env.*.local' >> .gitignore"
allows 'git show HEAD:.env.example > /tmp/env-example.txt'

# --- redirecionamento para o .claude/ do projeto ---------------------------
# Toda grafia que um agente usaria para chegar a raiz: relativa, absoluta, por
# variavel e por `~`. Escrever aqui desliga o proprio guard.
blocks "echo '{}' > .claude/settings.local.json"
blocks 'echo x >> ./.claude/logs/instrucoes.log'
blocks 'echo x > src/../.claude/settings.json'
blocks 'echo x > /home/dev/site/.claude/settings.json'
blocks 'echo x > $CLAUDE_PROJECT_DIR/.claude/settings.json'
blocks 'echo x > ${CLAUDE_PROJECT_DIR}/.claude/settings.json'
blocks 'echo x > "$CLAUDE_PROJECT_DIR"/.claude/hooks/guard-dados-sensiveis.sh'
blocks 'echo x > "${CLAUDE_PROJECT_DIR:?}/.claude/settings.json"'
blocks 'echo x > ~/site/.claude/settings.json'
blocks 'echo x > $HOME/site/.claude/settings.json'
blocks 'echo x > ${HOME}/site/.claude/settings.json'
blocks 'echo x > $PWD/.claude/settings.json'
blocks 'echo x > "/home/dev/site/.claude/meu arquivo.md"'
blocks 'npm run build > .claude/logs/build.log 2>&1'
blocks 'npm run build &>.claude/logs/build.log'
blocks $'cat <<\'EOF\' > .claude/hooks/novo.sh\n#!/usr/bin/env bash\nexit 0\nEOF'

# Travessia anula a confianca no prefixo, mesmo partindo do ~/.claude liberado.
blocks 'echo x > ~/.claude/../site/.claude/settings.json'
blocks 'echo x > ~/.claude/planejamento-sisbodeveloper/../x.json'

# Segmento `.claude`, nao sufixo nem prefixo; e o .claude/ de OUTRO projeto.
allows 'echo x > foo.claude/x.txt'
allows 'echo x > .claude-backup/settings.json'
allows 'echo x > .claudeignore'
allows 'echo x > /home/dev/site2/.claude/settings.json'

# Mencionar .claude/ sem escrever nele.
allows '/usr/bin/grep -rn hooks .claude/settings.json 2>/dev/null'
allows 'wc -l < .claude/logs/instrucoes.log'
allows 'ls .claude/logs 2>/dev/null || echo sem-logs'
allows 'tail -n 40 .claude/logs/instrucoes-carregadas.log > /tmp/instrucoes.txt'
allows '(cd .claude/hooks && bash test-guard.sh > /tmp/test-guard.txt)'

# --- o ~/.claude do usuario, onde mora o diretorio de trabalho --------------
# Casar `.claude/` em qualquer caminho bloqueava todos estes, e a sessao de
# planejamento grava as extracoes exatamente ali.
allows 'python3 extrai.py > ~/.claude/planejamento-sisbodeveloper/rotas.json'
allows 'node extrai.mjs > "$HOME/.claude/planejamento-sisbodeveloper/rotas.json"'
allows 'node extrai.mjs >> ${HOME}/.claude/planejamento-sisbodeveloper/log.txt'
allows 'python3 extrai.py > "$HOME"/.claude/planejamento-sisbodeveloper/rotas.json'
allows 'git rev-parse HEAD > /home/dev/.claude/planejamento-sisbodeveloper/head.txt'
allows 'jq . x.json > ~/.claude/planejamento-sisbodeveloper/y.json'
allows 'git log --oneline -10 | tee ~/.claude/planejamento-sisbodeveloper/log.txt'
allows '{ git status --porcelain; git log --oneline -5; } > ~/.claude/planejamento-sisbodeveloper/estado.txt'
allows 'PLAN=~/.claude/planejamento-sisbodeveloper; node extrai.mjs > "$PLAN/rotas.json"'
allows $'cat <<\'EOF\' > ~/.claude/planejamento-sisbodeveloper/plano.md\n# Plano\nEOF'
allows $'mkdir -p ~/.claude/planejamento-sisbodeveloper && python3 - <<\'PY\' > ~/.claude/planejamento-sisbodeveloper/constantes.json\nimport json, pathlib\nhtml = pathlib.Path("dist/pt-br/index.html").read_text(encoding="utf-8")\nprint(json.dumps(len(html)))\nPY'

# --- variacoes de ambiente -------------------------------------------------
# Sem raiz, o guard nao separa o ~/.claude do .claude do projeto: falha fechado.
blocks 'echo x > .claude/settings.json' CLAUDE_PROJECT_DIR=
blocks 'echo x > /home/dev/.claude/planejamento-sisbodeveloper/x.json' CLAUDE_PROJECT_DIR=
blocks 'echo x > $CLAUDE_PROJECT_DIR/.claude/settings.json' CLAUDE_PROJECT_DIR=
allows 'echo x > /tmp/saida.txt' CLAUDE_PROJECT_DIR=
allows 'ALLOW_PLACEHOLDER_TEXT=1 npm run build 2>&1 | tail -20' CLAUDE_PROJECT_DIR=

# Barra final na raiz e no HOME.
blocks 'echo x > /home/dev/site/.claude/settings.json' CLAUDE_PROJECT_DIR=/home/dev/site/
allows 'echo x > /home/dev/.claude/planejamento-sisbodeveloper/x.json' CLAUDE_PROJECT_DIR=/home/dev/site/
allows 'echo x > ~/.claude/planejamento-sisbodeveloper/x.json' HOME=/home/dev/
blocks 'echo x > ~/site/.claude/settings.json' HOME=/home/dev/

# Sem HOME, `~` e `$HOME` nao se expandem e caem no teste por segmento.
blocks 'echo x > ~/.claude/planejamento-sisbodeveloper/x.json' HOME=
blocks 'echo x > ~/site/.claude/settings.json' HOME=
blocks 'echo x > $HOME/site/.claude/settings.json' HOME=
allows 'node extrai.mjs > /home/dev/.claude/planejamento-sisbodeveloper/rotas.json' HOME=

# HOME igual a raiz: ali o ~/.claude E o .claude do projeto.
blocks "echo '{}' > ~/.claude/settings.local.json" HOME=/home/dev/site

# Raiz com espaco.
blocks 'echo x > "$CLAUDE_PROJECT_DIR/.claude/settings.local.json"' 'CLAUDE_PROJECT_DIR=/home/dev/meu site'
allows 'python3 extrai.py > ~/.claude/planejamento-sisbodeveloper/rotas.json' 'CLAUDE_PROJECT_DIR=/home/dev/meu site'

# O que nao depende de caminho nao depende do ambiente.
blocks 'git add .env.development' CLAUDE_PROJECT_DIR= HOME=
blocks 'git add .claude/logs/instrucoes.log' CLAUDE_PROJECT_DIR= HOME=
blocks 'echo VITE_API_KEY=x > .env.local' CLAUDE_PROJECT_DIR= HOME=
blocks 'rm -rf $CLAUDE_PROJECT_DIR/public' CLAUDE_PROJECT_DIR= HOME=

# --- escrita disfarcada de leitura -----------------------------------------
blocks 'git diff --output=/tmp/x.diff'
blocks 'git diff --output /tmp/x.diff'
blocks 'git diff --stat --cached --output=/home/dev/site/.claude/x HEAD'
blocks 'git diff HEAD~1 --output=out.patch -- src/'
blocks 'git diff main...HEAD --output=/tmp/x.patch'
blocks 'git diff-tree -p --output=/tmp/t.diff HEAD'
blocks 'git status && git diff --output=/tmp/a.diff'
allows 'git diff -- docs/output.md'
allows 'git diff --stat -- src/output/'
allows 'git diff HEAD~1 > /tmp/changes.diff'
allows 'git diff main...HEAD --stat'
allows 'git commit -m "docs: explica git diff --output"'
allows "git diff HEAD -- .claude/hooks/guard-dados-sensiveis.sh | /usr/bin/grep -n -- '--output'"

# --- remocao recursiva em diretorio versionavel ----------------------------
# Cada grafia da flag que o guard reconhece.
blocks 'rm -rf src'
blocks 'rm -fr src'
blocks 'rm -r src'
blocks 'rm -R src'
blocks 'rm -r -f src'
blocks 'rm -f -r src'
blocks 'rm --recursive src'
blocks 'rm --recursive --force src'
blocks 'rm src -rf'

# Todo diretorio da lista NU, que e o caso mais destrutivo: sem barra final.
blocks 'rm -rf public'
blocks 'rm -rf docs'
blocks 'rm -rf tests'
blocks 'rm -rf tools'
blocks 'rm -rf .github'
blocks 'rm -rf .vscode'
blocks 'rm -rf .claude'
blocks 'rm -rf .git'
blocks 'rm -r tests/lint'

# Grafias do caminho: barra, ./, aspas, subdiretorio, absoluto, variavel.
blocks 'rm -rf src/'
blocks 'rm -rf ./src'
blocks 'rm -rf ./public/'
blocks 'rm -rf "src"'
blocks "rm -rf 'docs'"
blocks 'rm -rf src/components'
blocks 'rm -r docs/adr'
blocks 'rm -rf /home/dev/site/src'
blocks 'rm -rf /home/dev/site/.git/'
blocks 'rm -rf $CLAUDE_PROJECT_DIR/public'
blocks 'rm -rf "${CLAUDE_PROJECT_DIR}/.claude"'
blocks 'rm -rf "${CLAUDE_PROJECT_DIR:?}/src"'
blocks 'rm -rf src/*'
blocks 'rm -rf -- src'
blocks 'rm -rf dist/../src'
blocks 'rm -rf .claude/logs'

# O alvo liberado nao libera o vizinho.
blocks 'rm -rf dist src'

# O diretorio corrente e o pai.
blocks 'rm -rf .'
blocks 'rm -rf ..'
blocks 'rm -rf ./'
blocks 'rm -rf ../'

# Regeneraveis: dist, .astro e node_modules.
allows 'rm -rf dist'
allows 'rm -rf .astro'
allows 'rm -rf node_modules'
allows 'rm -r dist'
allows 'rm -rf dist .astro node_modules'
allows 'rm -rf node_modules package-lock.json'
allows 'rm -rf node_modules/.vite dist/_astro'
allows 'rm -rf dist/*'
allows 'rm -rf /home/dev/site/dist'
allows 'rm -rf "${CLAUDE_PROJECT_DIR:?}/dist"'
allows 'rm -rf /tmp/sisbo-build'
allows 'rm -rf dist 2>/dev/null'

# Segmento, nao sufixo nem prefixo: `mydocs` e `websrc` nao sao `docs` nem `src`.
allows 'rm -rf mydocs'
allows 'rm -rf websrc'
allows 'rm -rf src-old'
allows 'rm -rf public_html'
allows 'rm -rf tests-old'
allows 'rm -rf .github-backup'
allows 'rm -rf /tmp/mydocs'

# Sem recursao. `rm CLAUDE.md` e o passo do plano que desfaz o link simbolico.
allows 'rm CLAUDE.md'
allows 'rm src'
allows 'rm -d docs'
allows 'rm -i x'
allows 'rm -f src/pages/en/about.astro'
allows 'rm -f .git/index.lock'
allows 'rm -f .claude/logs/instrucoes-carregadas.log'
allows 'rmdir src'
allows "find dist -name '*.map' -delete"
allows "find dist -name '*.map' -print0 | xargs -0 rm -f"

# --- comando composto: o guard testa por subcomando ------------------------
blocks 'npm run build && git add -A'
blocks 'npm run build&&git add -A'
blocks 'git status || git add --all'
blocks 'cd /home/dev/site; git add .'
blocks 'git status;git add .'
blocks 'yes | rm -r src'
blocks 'rm -rf .astro dist && git add -A'
blocks 'npm run build; rm -rf .vscode'
blocks 'echo ok; echo x > .claude/settings.json'
blocks $'git status\ngit add -A'
blocks $'echo ok\nrm -rf docs'

# Espaco, tab e CRLF nao viram atalho em volta do padrao ancorado.
blocks $'cd /home/dev/site\n\tgit add -A'
blocks '   git   add    --all'
blocks $'git\tadd\t-A'
blocks $'git\tadd\t.env.local'
blocks $'rm\t-rf\tsrc'
blocks $'\tgit  diff\t--output=/tmp/a.diff'
blocks $'git status\r\ngit add .env.local\r\n'
allows $'npm run build\r\n'

# Separador dentro de aspas nao pode virar bloqueio.
allows "echo 'a; git add .'"
allows "git commit -m 'feat: x && git add -A'"
allows "python3 -c 'import os; print(1)'"
allows "awk -F'|' '{print \$2}' dist/report.txt | sort | uniq -c"
allows "find dist -name '*.html' -exec wc -c {} \\;"
allows $'# depois: git add -A\nnpm run build'

# Mencionar o comando nao e executa-lo.
allows 'grep -n "git add" AGENTS.md'
allows '/usr/bin/grep -rn "git add -A" .claude/hooks'
allows "/usr/bin/grep -rn 'rm -rf src' AGENTS.md"
allows "git commit -m 'git add .'"
allows 'git commit -m "docs: CLAUDE.md proibe git add . no fluxo"'
allows 'git commit -m "chore(build): script clean passa a usar rm -rf dist .astro"'
allows 'git commit -m "docs: documenta PUBLIC_SITE_URL em .env.example e ignora .env.local"'

# `>` que nao e redirecionamento gera alvo fantasma, e ele precisa ser inocuo.
allows 'echo "a > b"'
allows "python3 -c 'print(1>0)'"
allows "/usr/bin/grep '>' src/pages/index.astro"
allows "node -e 'const f = a=>b'"
allows 'git commit -m "refactor(frontend): renomeia Header -> SiteHeader"'
allows "/usr/bin/grep -o '<link rel=\"alternate\"[^>]*>' dist/pt-br/index.html | sort -u"

# --- comandos da sessao de planejamento ------------------------------------
allows 'git rev-parse HEAD'
allows 'npm run build'
allows 'ALLOW_PLACEHOLDER_TEXT=1 npm run build'
allows 'ALLOW_PLACEHOLDER_TEXT=1 npm run build 2>&1 | tail -20'
allows "find dist -name '*.html' | sort"
allows "/usr/bin/grep -n 'const [A-Z_]* = [0-9]' dist/pt-br/index.html"
allows "/usr/bin/grep -n '⟨' docs/*.md docs/adr/*.md CLAUDE.md"
# `import.meta.env` lembra `.env` e a alternancia parte o subcomando no `|`.
allows "/usr/bin/grep -rlE 'astro:content|astro:assets|import\\.meta\\.env' src | xargs wc -l"
allows "/usr/bin/grep -rnE 'VITE_|import\\.meta\\.env|\\.env' src astro.config.mjs"
allows "/usr/bin/grep -rn 'import.meta.env' src > ~/.claude/planejamento-sisbodeveloper/env-usos.txt"
allows 'sha256sum AGENTS.md'
allows 'rm CLAUDE.md && test ! -L CLAUDE.md && sha256sum AGENTS.md'
allows 'git status --porcelain'
allows 'git log --oneline -10'
allows 'git show HEAD:src/content.config.ts'
allows 'git check-ignore -v .env .env.local .claude/logs/instrucoes-carregadas.log'
allows "find . -name '.env*' -not -path './node_modules/*' | sort"
allows 'cat .env.example'
allows 'ls -la .claude/'
allows 'astro dev --background'
allows 'astro dev logs > /tmp/astro.log 2>&1'

# --- comandos da execucao --------------------------------------------------
allows 'npm install astro-icon@1.1.5'
allows 'npm install -D @astrojs/sitemap@3.2.1 && git add package.json package-lock.json'
allows 'rm -rf dist .astro && ALLOW_PLACEHOLDER_TEXT=1 npm run build 2>&1 | tail -20'
allows 'rm -rf dist .astro node_modules && npm install'
allows 'npx playwright screenshot http://localhost:4321/pt-br/ /tmp/x.png'
allows 'npm run dev & sleep 3 && curl -s localhost:4321 | head -5'
allows 'npm run build 2>&1 | tee /tmp/build.log'
allows 'git add src/components/X.astro docs/03-backlog.md'
allows 'git add src/pages/index.astro src/pages/en/index.astro && git commit -m "feat(frontend): rota en"'
allows "git add 'src/pages/[...slug].astro'"
allows 'git add "src/pages/serviços.astro" && git commit -m "feat: seção de serviços — ação"'
allows 'git commit -m "feat(frontend): adiciona rota /en; ajusta hreflang"'
allows 'git add src/pages/pt-br/index.astro src/pages/en/index.astro && git commit -m "feat(frontend): home bilingue; hreflang pt-br <-> en"'
allows 'git commit -F /tmp/commit-msg.txt'
allows "git diff --cached --name-only | /usr/bin/grep -E '(^|/)\\.env' && echo ALERTA || echo limpo"

# A forma de commit do Claude Code: cada linha do corpo do heredoc vira um
# subcomando solto, e nenhuma pode disparar o guard.
allows $'git commit -m "$(cat <<\'EOF\'\nfeat(frontend): adiciona pagina de contato\n\n- formulario envia via mailto; sem backend\n- seletor de idioma: /en/contact -> /pt-br/contato\n- variaveis documentadas em .env.example\nEOF\n)"'

# --- entrada do hook -------------------------------------------------------
# Falha FECHADO so onde o guard nao consegue ler; sem comando, libera.
payload_blocks 'isto nao e json {'
payload_blocks '{"tool_input":{"command":"git status"}} lixo'
payload_blocks '{"tool_input":"git add .env.local"}'
payload_allows '{"tool_input":{"command":""}}'
payload_blocks '{"session_id":"s","hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"git add .env.local","description":"stage"}}'
payload_allows '{"tool_name":"Bash","tool_input":{"command":"git status --short","description":"antes de git add -A, conferir .env e rm -rf src"}}'

# Sem jq, bloqueia ate comando legitimo: nao ha como inspeciona-lo. O PATH tem
# as outras ferramentas do guard: sem `cat` ele bloquearia por entrada ilegivel,
# e o ramo do jq nunca seria exercitado.
no_jq_bin="$sandbox/bin-sem-jq"
mkdir -p "$no_jq_bin"
for tool in cat sed grep tr; do
  ln -s "$(type -P "$tool")" "$no_jq_bin/$tool"
done
stderr=$(printf '%s' '{"tool_input":{"command":"npm run build"}}' \
  | (cd "$sandbox" && env -i PATH="$no_jq_bin" "$bash_bin" "$guard") 2>&1 >/dev/null)
record 2 "$?" "jq ausente: npm run build"
case "$stderr" in
  *"jq ausente"*) passed=$((passed + 1)) ;;
  *) failed=$((failed + 1)); printf 'FALHOU  jq ausente bloqueou por outro motivo: %s\n' "$stderr" >&2 ;;
esac

total=$((passed + failed))
if [ "$failed" -eq 0 ]; then
  printf 'guard-dados-sensiveis: %s casos, todos passaram\n' "$total"
  exit 0
fi

printf 'guard-dados-sensiveis: %s casos, %s FALHARAM\n' "$total" "$failed" >&2
exit 1
