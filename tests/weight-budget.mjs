/**
 * O teto de peso por página sai da meta da REQ-25, e não do tamanho de hoje: mudar a regra é mudar
 * uma entrada abaixo. A rede é o perfil "Slow 4G" do teste móvel do Lighthouse (docs/throttling.md
 * do Lighthouse); o peso é o que trafega — HTML e CSS comprimidos, fontes como estão.
 */
export const LCP_TARGET_MILLISECONDS = 2500
export const THROUGHPUT_BITS_PER_SECOND = 1_600_000
export const ROUND_TRIP_MILLISECONDS = 150
/** DNS, TCP, TLS e o pedido da página, antes do primeiro byte. */
export const SETUP_ROUND_TRIPS = 4
/** A outra parte fica para renderizar, para a CPU quatro vezes mais lenta e para as imagens. */
export const TRANSFER_SHARE = 0.5

const transferMilliseconds = LCP_TARGET_MILLISECONDS - SETUP_ROUND_TRIPS * ROUND_TRIP_MILLISECONDS
const bytesPerMillisecond = THROUGHPUT_BITS_PER_SECOND / 8 / 1000

export const WEIGHT_BUDGET_BYTES = Math.floor(transferMilliseconds * bytesPerMillisecond * TRANSFER_SHARE)
