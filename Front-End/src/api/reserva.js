import API from './apiClient';

// Criar nova reserva
export const criarReserva = async (dados) => {
  const resposta = await API.post('/reservas', dados);
  return resposta.data;
};

// Listar TODAS as reservas
export const listarReservas = async () => {
  const resposta = await API.get('/reservas');
  return resposta.data;
};

// Listar reservas de um usuário específico
export const listarReservasPorUsuario = async (id_usuario) => {
  const resposta = await API.get(`/reservas/usuario/${id_usuario}`);
  return resposta.data;
};

// Excluir uma reserva
export const excluirReserva = async (idReserva) => {
  const resposta = await API.delete(`/reservas/${idReserva}`);
  return resposta.data;
};

// Atualizar o status de uma reserva (aprovar ou rejeitar)
export const atualizarStatusReserva = async (id, status) => {
  const resposta = await API.put(`/reservas/${id}/status`, { status });
  return resposta.data;
};

// Buscar reserva por ID (ex: para edição ou detalhes)
export const buscarReservaPorId = async (id) => {
  const resposta = await API.get(`/reservas/${id}`);
  return resposta.data;
};
