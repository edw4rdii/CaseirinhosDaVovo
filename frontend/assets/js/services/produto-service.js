import { PRODUTOS_HOME } from '../../../data/mocks/home.js';

export function listarVitrines() {
  return Promise.resolve(PRODUTOS_HOME);
}
