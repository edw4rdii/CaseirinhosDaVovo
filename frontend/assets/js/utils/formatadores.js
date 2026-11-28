import { CONFIG } from '../core/config.js';

export function formatarMoeda(valor) {
  return new Intl.NumberFormat(CONFIG.localidade, { style: 'currency', currency: CONFIG.moeda }).format(valor);
}

export function formatarParcela(valor, parcelas = CONFIG.parcelasSemJuros) {
  const valorParcela = valor / parcelas;
  if (valorParcela < CONFIG.valorMinimoParcela) return '';
  return `até ${parcelas}x de ${formatarMoeda(valorParcela)} sem juros`;
}

// 1258291 → "1,2 MB"; 320000 → "313 KB"
export function formatarTamanhoArquivo(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  const mb = (bytes / (1024 * 1024)).toLocaleString(CONFIG.localidade, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${mb} MB`;
}
