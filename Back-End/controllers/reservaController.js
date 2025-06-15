const supabase = require('../db/supabaseClient');

exports.criarReserva = async (req, res) => {
  const { id_usuario, id_quadra, data_reserva, horario_inicio, horario_fim } = req.body;

  const { data: conflito } = await supabase
    .from('reserva')
    .select('*')
    .eq('id_quadra', id_quadra)
    .eq('data_reserva', data_reserva)
    .lte('horario_inicio', horario_fim)
    .gte('horario_fim', horario_inicio);

  if (conflito.length > 0) {
    return res.status(409).json({ mensagem: 'Horário já reservado.' });
  }

  const { data, error } = await supabase.from('reserva').insert([{ id_usuario, id_quadra, data_reserva, horario_inicio, horario_fim }]);
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
