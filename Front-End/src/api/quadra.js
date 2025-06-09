import API from './apiClient';

export const listarQuadras = async () => {
  const resposta = await API.get('/quadras');
  return resposta.data;
};
