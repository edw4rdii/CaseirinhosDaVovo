export const CONFIG = Object.freeze({
  moeda: 'BRL',
  localidade: 'pt-BR',
  fusoHorario: 'America/Sao_Paulo',
  parcelasSemJuros: 6,
  valorMinimoParcela: 5,
  caminhoParciais: '/partials',
  apiBase: 'https://caseirosdavovo-backend.vercel.app/api',
  upload: Object.freeze({
    tiposAceitos: ['image/jpeg', 'image/png'],
    tamanhoMaximoBytes: 5 * 1024 * 1024,
  }),
});