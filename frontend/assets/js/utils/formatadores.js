import { CONFIG } from '../core/config.js';

export function formatarMoeda(valor) {
  return new Intl.NumberFormat(CONFIG.localidade, { style: 'currency', currency: CONFIG.moeda }).format(valor);
}

export function formatarParcela(valor, parcelas = CONFIG.parcelasSemJuros) {
  const valorParcela = valor / parcelas;
  if (valorParcela < CONFIG.valorMinimoParcela) return '';
  return `até ${parcelas}x de ${formatarMoeda(valorParcela)} sem juros`;
}
