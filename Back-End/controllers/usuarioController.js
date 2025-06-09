const supabase = require('../db/supabaseClient');

exports.criarUsuario = async (req, res) => {
  const { nome, email, senha_hash, perfil } = req.body;

  const { data, error } = await supabase
    .from('usuario')
    .insert([{ nome, email: email.trim().toLowerCase(), senha_hash, perfil }])
    .select(); // ← isso garante que data venha com o novo registro

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(500).json({ error: 'Erro inesperado: nenhum dado retornado.' });
  }

  res.status(201).json({
    mensagem: 'Usuário cadastrado com sucesso!',
    usuario: data[0]
  });
};



exports.listarUsuarios = async (req, res) => {
  const { data, error } = await supabase.from('usuario').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.buscarUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('usuario').select('*').eq('id_usuario', id).single();
  if (error) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(data);
};

exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('usuario').update(req.body).eq('id_usuario', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('usuario').delete().eq('id_usuario', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
};

exports.loginUsuario = async (req, res) => {
  const { email, senha_hash } = req.body;

  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('email', email)
    .eq('senha_hash', senha_hash)
    .single();

  if (error || !data) {
    return res.status(401).json({ mensagem: 'Credenciais inválidas' });
  }

  res.json({ mensagem: 'Login bem-sucedido', usuario: data });
};
