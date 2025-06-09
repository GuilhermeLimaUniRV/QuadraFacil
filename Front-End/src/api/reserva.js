import API from './apiClient';

export const criarReserva = async (dados) => {
  const resposta = await API.post('/reservas', dados);
  return resposta.data;
};
