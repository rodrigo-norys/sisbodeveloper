# ADR-0003 — Os acessos são contados com o Cloudflare Web Analytics

- **Status:** aceita
- **Data:** 13-10-2026
- **Substitui:** nenhuma
- **Requisitos afetados:** `REQ-18`, `REQ-19`, `REQ-17`

## Contexto

A contagem de acessos é diagnóstico, fora do critério de sucesso: separa "ninguém chegou" de "chegou e não procurou" (`Q-03`). Ela precisa ser anônima e agregada, por página, por origem e por dia (`REQ-18`), sem guardar nem enviar dado que identifique o visitante (`P-03`). O site roda no Cloudflare Pages (`ADR-0002`) e não tem servidor próprio.

## Decisão

Nós vamos contar os acessos com o Cloudflare Web Analytics, o script de contagem da Cloudflare, sem nenhum outro serviço de contagem.

## Alternativas rejeitadas

### Serviço de contagem de terceiros (Plausible, GoatCounter e afins)

**Por que foi considerada:** contagem sem cookie, com painel por página e origem.
**Por que foi rejeitada:** põe mais um terceiro recebendo a requisição do visitante, além da Cloudflare, que já a recebe como hospedagem.

### Contador próprio, numa função da Cloudflare com armazenamento

**Por que foi considerada:** contaria no servidor, sem script, inclusive quem não roda JavaScript.
**Por que foi rejeitada:** código e armazenamento a manter, e a decidir o que fazer com o endereço do visitante, para um número que só serve de diagnóstico.

## Consequências

**Passa a ser possível:** consultar visitas por página, origem e dia, sem servidor e sem custo.

**Passa a ser difícil ou impossível:** contar quem não roda JavaScript ou bloqueia o script; o número exato depois de 7 dias — a Cloudflare guarda o dado sem amostragem por 7 dias, depois agrega em cerca de 10%, e o mantém por seis meses (documentação do Web Analytics, FAQ, atualizada em 14-07-2026). O script é de domínio da Cloudflare, a exceção prevista na `REQ-19`.

**O que precisa mudar junto:** o Web Analytics é ativado para o domínio; a tarefa que o ativa confere, no navegador, que nenhuma resposta grava cookie (`R-01` do `02-arquitetura.md`).

## Gatilho de reavaliação

A conferência achar cookie gravado pelo script ou pela resposta dele, ou a Cloudflare mudar o que o Web Analytics coleta.
