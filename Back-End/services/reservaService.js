const supabase = require('../db/supabaseClient');

// Verifica se a data da reserva está no passado
function dataNoPassado(data_reserva) {
  const hoje = new Date();
  const hojeStr = hoje.toISOString().split('T')[0];
  return data_reserva < hojeStr;
}

// Verifica se o horário já passou (para o mesmo dia)
function horarioJaPassou(data_reserva, horario_inicio) {
  const hoje = new Date();
  const hojeStr = hoje.toISOString().split('T')[0];
  if (data_reserva !== hojeStr) return false;

  const horaAgora = hoje.toTimeString().split(':').slice(0, 2).join(':'); // HH:MM
  return horario_inicio <= horaAgora;
}

// Verifica se usuário já tem reserva no mesmo dia
async function usuarioJaTemReserva(id_usuario, data_reserva) {
  const { data } = await supabase
    .from('reserva')
    .select('id_reserva')
    .eq('id_usuario', id_usuario)
    .eq('data_reserva', data_reserva)
    .in('status', ['pendente', 'confirmada']);
  return data.length > 0;
}

// Para validação na aprovação
async function usuarioJaTemOutraReserva(id_usuario, data_reserva, id_reserva_atual) {
  const { data, error } = await supabase
    .from('reserva')
    .select('id_reserva')
    .eq('id_usuario', id_usuario)
    .eq('data_reserva', data_reserva)
    .in('status', ['pendente', 'confirmada'])
    .neq('id_reserva', id_reserva_atual);

  if (error) {
    console.error('Erro ao verificar duplicidade ao aprovar reserva:', error.message);
    return false;
  }

  return Array.isArray(data) && data.length > 0;
}


// Verifica conflito com reservas confirmadas
async function existeConflitoDeHorario(id_quadra, data_reserva, horario_inicio, horario_fim) {
  const { data } = await supabase
    .from('reserva')
    .select('*')
    .eq('id_quadra', id_quadra)
    .eq('data_reserva', data_reserva)
    .eq('status', 'confirmada')
    .lt('horario_inicio', horario_fim)  // Início existente < Fim novo
    .gt('horario_fim', horario_inicio); // Fim existente > Início novo

  return data.length > 0;
}

module.exports = {
  dataNoPassado,
  horarioJaPassou,
  usuarioJaTemReserva,
  existeConflitoDeHorario,
  usuarioJaTemOutraReserva
};
