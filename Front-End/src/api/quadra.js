import API from './apiClient';

export const listarQuadras = async () => {
  const resposta = await API.get('/quadras');
  return resposta.data;
};

export const cadastrarQuadra = async (quadraComEndereco) => {
  const resposta = await API.post('/quadras', quadraComEndereco);
  return resposta.data;
};