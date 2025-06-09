const supabase = require('../db/supabaseClient');

exports.criarUsuario = async (req, res) => {
  const { nome, email, senha_hash, perfil } = req.body;
  const { data, error } = await supabase.from('Usuario').insert([{ nome, email, senha_hash, perfil }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

exports.listarUsuarios = async (req, res) => {
  const { data, error } = await supabase.from('Usuario').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.buscarUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Usuario').select('*').eq('id_usuario', id).single();
  if (error) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(data);
};

exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Usuario').update(req.body).eq('id_usuario', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('Usuario').delete().eq('id_usuario', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
};
