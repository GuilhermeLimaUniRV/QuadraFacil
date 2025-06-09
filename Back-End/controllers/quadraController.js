const supabase = require('../db/supabaseClient');

exports.criarQuadra = async (req, res) => {
  const { nome, tipo, id_endereco } = req.body;
  const { data, error } = await supabase.from('Quadra').insert([{ nome, tipo, id_endereco }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

exports.listarQuadras = async (req, res) => {
  const { data, error } = await supabase.from('Quadra').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.buscarQuadraPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Quadra').select('*').eq('id_quadra', id).single();
  if (error) return res.status(404).json({ error: 'Quadra não encontrada' });
  res.json(data);
};

exports.atualizarQuadra = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Quadra').update(req.body).eq('id_quadra', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.deletarQuadra = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('Quadra').delete().eq('id_quadra', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
};
