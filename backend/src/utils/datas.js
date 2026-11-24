export const FUSO_BR = "-03:00";

const SO_DATA = /^\d{4}-\d{2}-\d{2}$/;
const DATA_HORA_SEM_FUSO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/;

// Converte o que veio do front em Date, tratando como horário de Brasília
// quando a string não informa o fuso. Strings com "Z" ou "+hh:mm" são respeitadas.
export function paraDataBR(valor) {
  if (valor instanceof Date) return valor;
  if (typeof valor === "string") {
    if (SO_DATA.test(valor)) return new Date(`${valor}T00:00:00${FUSO_BR}`);
    if (DATA_HORA_SEM_FUSO.test(valor)) return new Date(`${valor}${FUSO_BR}`);
  }
  return new Date(valor);
}

// Para filtros por período (?dataInicio=2026-11-01&dataFim=2026-11-30)
export function inicioDoDiaBR(dia) {
  return new Date(`${dia}T00:00:00.000${FUSO_BR}`);
}

export function fimDoDiaBR(dia) {
  return new Date(`${dia}T23:59:59.999${FUSO_BR}`);
}

export function dataValida(valor) {
  return !isNaN(paraDataBR(valor).getTime());
}
