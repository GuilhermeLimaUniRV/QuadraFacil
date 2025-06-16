const supabase = require('../db/supabaseClient');
const {
  dataNoPassado,
  horarioJaPassou,
  usuarioJaTemReserva,
  existeConflitoDeHorario,
  usuarioJaTemOutraReserva
} = require('../services/reservaService');

exports.criarReserva = async (req, res) => {
  const { id_usuario, id_quadra, data_reserva, horario_inicio, horario_fim } = req.body;

  if (dataNoPassado(data_reserva)) {
    return res.status(400).json({ mensagem: 'A data da reserva não pode estar no passado.' });
  }

  if (horarioJaPassou(data_reserva, horario_inicio)) {
    return res.status(400).json({ mensagem: 'O horário da reserva deve ser posterior ao horário atual.' });
  }

  if (await usuarioJaTemReserva(id_usuario, data_reserva)) {
    return res.status(409).json({ mensagem: 'Você já possui uma reserva neste dia.' });
  }

  if (await existeConflitoDeHorario(id_quadra, data_reserva, horario_inicio, horario_fim)) {
    return res.status(409).json({ mensagem: 'Horário já reservado para essa quadra.' });
  }

  const { data, error } = await supabase
    .from('reserva')
    .insert([{ id_usuario, id_quadra, data_reserva, horario_inicio, horario_fim }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
};


exports.listarReservas = async (req, res) => {
  const { data, error } = await supabase
    .from('reserva')
    .select(`
      *,
      quadra (nome, tipo),
      usuario (nome)
    `);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};


exports.buscarReservaPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('reserva').select('*').eq('id_reserva', id).single();
  if (error) return res.status(404).json({ error: 'Reserva não encontrada' });
  res.json(data);
};

exports.listarPorUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  const { data, error } = await supabase
    .from('reserva')
    .select(`
      *,
      quadra (nome, tipo),
      usuario (nome)
    `)
    .eq('id_usuario', id_usuario);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};


exports.deletarReserva = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('reserva').delete().eq('id_reserva', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
};

exports.atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'confirmada') {
    // Se for rejeição ou outro status, apenas atualiza
    const { error } = await supabase
      .from('reserva')
      .update({ status })
      .eq('id_reserva', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ mensagem: 'Status atualizado com sucesso.' });
  }

  // Se for confirmação, aplica validações
  const { data: reserva, error } = await supabase
    .from('reserva')
    .select('*')
    .eq('id_reserva', id)
    .single();

  if (error || !reserva) {
    return res.status(404).json({ mensagem: 'Reserva não encontrada.' });
  }

  const { id_usuario, id_quadra, data_reserva, horario_inicio, horario_fim } = reserva;

  // Verifica conflito com outras reservas confirmadas
  const conflito = await existeConflitoDeHorario(id_quadra, data_reserva, horario_inicio, horario_fim);
  if (conflito) {
    return res.status(409).json({ mensagem: 'Há conflito de horário com outra reserva confirmada.' });
  }

  // (opcional) Verifica se o usuário já tem outra confirmada no mesmo dia
  const duplicada = await usuarioJaTemOutraReserva(id_usuario, data_reserva,id);
  if (duplicada) {
    return res.status(409).json({ mensagem: 'O usuário já possui uma reserva confirmada nesse dia.' });
  }

  // Atualiza status se tudo ok
  const resultado = await supabase
    .from('reserva')
    .update({ status: 'confirmada' })
    .eq('id_reserva', id);

  if (resultado.error) {
    return res.status(500).json({ error: resultado.error.message });
  }

  return res.status(200).json({ mensagem: 'Reserva aprovada com sucesso.' });
};

