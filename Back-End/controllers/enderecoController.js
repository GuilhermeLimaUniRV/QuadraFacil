const supabase = require('../db/supabaseClient');

exports.criarEndereco = async (req, res) => {
  const { data, error } = await supabase.from('endereco').insert([req.body]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};
exports.criarEnderecoInterno = async (endereco) => {
  const { data, error } = await supabase.from('Endereco').insert([endereco]).select();

  if (error) {
    throw new Error('Erro ao criar endereço: ' + error.message);
  }

  return data[0]; // Retorna o primeiro item, que é o endereço recém-criado
};


exports.listarEnderecos = async (req, res) => {
  const { data, error } = await supabase.from('endereco').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.buscarEnderecoPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('endereco').select('*').eq('id_endereco', id).single();
  if (error) return res.status(404).json({ error: 'Endereço não encontrado' });
  res.json(data);
};

exports.atualizarEndereco = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('endereco').update(req.body).eq('id_endereco', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.deletarEndereco = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('endereco').delete().eq('id_endereco', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
};