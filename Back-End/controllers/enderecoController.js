const supabase = require('../db/supabaseClient');

exports.criarEndereco = async (req, res) => {
  const { data, error } = await supabase.from('Endereco').insert([req.body]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

exports.listarEnderecos = async (req, res) => {
  const { data, error } = await supabase.from('Endereco').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.buscarEnderecoPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Endereco').select('*').eq('id_endereco', id).single();
  if (error) return res.status(404).json({ error: 'Endereço não encontrado' });
  res.json(data);
};

exports.atualizarEndereco = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('Endereco').update(req.body).eq('id_endereco', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.deletarEndereco = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('Endereco').delete().eq('id_endereco', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
};
