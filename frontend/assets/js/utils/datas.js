import { CONFIG } from '../core/config.js';

// A API devolve datas em UTC (ex.: "2026-11-24T00:16:47.555Z").
// Estas funções exibem no horário de Brasília, independente do fuso do computador de quem abre.

// "2026-11-24T00:16:47Z" → "23/11/2026"
export function formatarData(dataIso) {
  return new Date(dataIso).toLocaleDateString(CONFIG.localidade, { timeZone: CONFIG.fusoHorario });
}

// "2026-11-24T00:16:47Z" → "23/11/2026 21:16"
export function formatarDataHora(dataIso) {
  return new Date(dataIso).toLocaleString(CONFIG.localidade, {
    timeZone: CONFIG.fusoHorario,
    dateStyle: 'short',
    timeStyle: 'short',
  }).replace(',', '');
}

// Para preencher <input type="date"> e para os filtros (?dataInicio=&dataFim=).
// Devolve "AAAA-MM-DD" no dia de Brasília. Sem argumento = hoje.
// (Não use toISOString().slice(0, 10): depois das 21h ele já devolve o dia seguinte.)
export function paraInputData(dataIso = new Date()) {
  // en-CA formata como AAAA-MM-DD
  return new Date(dataIso).toLocaleDateString('en-CA', { timeZone: CONFIG.fusoHorario });
}

// "2026-11-14" → "14/11/2026". Usa só o texto do <input type="date">, sem passar por Date (evita deslocar o dia pelo fuso).
export function formatarDataInput(valor) {
  const [ano, mes, dia] = String(valor ?? '').split('-');
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : '';
}

export function converterDataParaISO(valor) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(valor ?? ''));
  if (!partes) return '';

  const [, dia, mes, ano] = partes;
  const data = new Date(0);
  data.setUTCFullYear(Number(ano), Number(mes) - 1, Number(dia));
  if (
    data.getUTCFullYear() !== Number(ano)
    || data.getUTCMonth() !== Number(mes) - 1
    || data.getUTCDate() !== Number(dia)
  ) return '';

  return `${ano}-${mes}-${dia}`;
}
