import API from './apiClient';

export const criarReserva = async (dados) => {
  const resposta = await API.post('/reservas', dados);
  return resposta.data;
};
export const listarReservas = async (id_usuario) => {
  const url = id_usuario ? `/reservas/usuario/${id_usuario}` : '/reservas';
  const resposta = await API.get(url);
  return resposta.data;
};
export const excluirReserva = async (idReserva) => {
  const resposta = await API.delete(`/reservas/${idReserva}`);
  return resposta.data;
};
