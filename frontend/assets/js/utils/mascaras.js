export function mascararTelefone(valor) {
  const digitos = String(valor ?? '').replace(/\D/g, '').slice(0, 11);
  if (digitos.length <= 2) return digitos ? `(${digitos}` : '';
  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);
  const corte = digitos.length > 10 ? 5 : 4;
  if (resto.length <= corte) return `(${ddd}) ${resto}`;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}
