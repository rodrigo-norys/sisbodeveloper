# ADR-0002 — O site é hospedado no Cloudflare Pages, publicado a partir da main

- **Status:** aceita
- **Data:** 13-10-2026
- **Substitui:** nenhuma
- **Requisitos afetados:** `REQ-14`, `REQ-18`, `REQ-23`

## Contexto

O site é estático (`ADR-0001`) e precisa ir ao ar em `sisbodeveloper.com.br`, cujo DNS já está na Cloudflare, em nome do dono (`RS-01`). Uma pessoa mantém o site (`RS-03`), e a confiabilidade aceita é a de um plano gratuito (§3 do `02-arquitetura.md`). A contagem de acessos (`REQ-18`) depende de onde o site roda.

## Decisão

Nós vamos hospedar o site no Cloudflare Pages, ligado ao repositório no GitHub: cada merge na main dispara o build de publicação no Pages, sem o escape de texto provisório.

## Alternativas rejeitadas

### O servidor que atendia o domínio

**Por que foi considerada:** já existe e já responde pelo domínio.
**Por que foi rejeitada:** servidor é peça a manter — sistema, certificado, atualização — para servir arquivos estáticos; e a contagem por registro do servidor exigiria tratar o endereço do visitante (`P-03`).

### GitHub Pages

**Por que foi considerada:** gratuito, junto do repositório.
**Por que foi rejeitada:** não tem contagem própria; a `REQ-18` exigiria um serviço de terceiros só para contar, um terceiro a mais recebendo a requisição do visitante.

### Publicação por upload direto a partir do CI

**Por que foi considerada:** o deploy só aconteceria depois do portão de qualidade verde.
**Por que foi rejeitada:** exige um token da Cloudflare guardado como segredo no GitHub; a branch protegida já garante que só entra na main o que passou no portão.

## Consequências

**Passa a ser possível:** publicar sem servidor; prévia de cada PR num endereço próprio do Pages; contagem no mesmo provedor (`ADR-0003`).

**Passa a ser difícil ou impossível:** o site e a contagem caem juntos se a Cloudflare cair; os limites do plano gratuito valem.

**O que precisa mudar junto:** o registro do domínio passa a apontar para o projeto no Pages; a versão do Node do build no Pages é a mesma do projeto.

## Gatilho de reavaliação

Mudança nos limites ou no preço do plano gratuito do Pages que o site ultrapasse, ou um requisito que precise de servidor.
