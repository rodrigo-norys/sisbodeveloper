# ADR-0001 — O site continua no Astro, com saída estática

- **Status:** aceita
- **Data:** 13-10-2026
- **Substitui:** nenhuma
- **Requisitos afetados:** `REQ-01`, `REQ-10`, `REQ-13`, `REQ-14`, `REQ-15`, `REQ-16`, `REQ-17`

## Contexto

O site existe e funciona: sete pares de rota em dois idiomas, conteúdo em arquivos com esquema, e guardas que reprovam o build. A constituição pede que todo conteúdo e toda navegação existam no HTML entregue (`P-04`) e que o build falhe em vez de publicar errado (`P-05`); quem lê o site inclui o agente de IA que não executa script. O dono pediu que a escolha da stack pese o `P-04`.

## Decisão

Nós vamos manter o Astro, gerando HTML estático no build, sem roteador no cliente e sem JavaScript próprio nas páginas.

## Alternativas rejeitadas

### Next.js

**Por que foi considerada:** é o framework React mais usado, com geração estática.
**Por que foi rejeitada:** por padrão, entrega ao navegador o runtime da aplicação e troca de página por script, o que tensiona o `P-04`; desligar isso é trabalhar contra o framework.

### Hugo ou Eleventy

**Por que foi considerada:** geram HTML estático sem JavaScript, como o Astro.
**Por que foi rejeitada:** exigem reescrever as páginas e as guardas do esquema de conteúdo, sem ganho para nenhum requisito.

### HTML escrito à mão

**Por que foi considerada:** zero dependência (`P-06`).
**Por que foi rejeitada:** perde as guardas do build — medida sem procedência, texto provisório, imagem sem texto alternativo —, contrariando o `P-05`.

## Consequências

**Passa a ser possível:** reaproveitar o código, o conteúdo e o design atuais (`P-08`); manter as guardas no esquema do conteúdo, que reprova o build.

**Passa a ser difícil ou impossível:** trocar de gerador sem reescrever páginas e componentes; o conteúdo, de frontmatter neutro, muda de lugar intacto. Acompanhar as versões maiores do Astro é trabalho recorrente.

**O que precisa mudar junto:** nada; é a stack atual.

## Gatilho de reavaliação

Uma versão maior do Astro que exija reescrever páginas, ou um requisito que precise de servidor.
