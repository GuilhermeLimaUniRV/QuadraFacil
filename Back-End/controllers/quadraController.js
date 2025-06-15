const supabase = require('../db/supabaseClient');
const enderecoController = require('./enderecoController');  // Importando o controller de endereco

exports.criarQuadra = async (req, res) => {
  const { nome, tipo, endereco } = req.body; // Espera o objeto endereco no corpo da requisição

  try {
    // Passo 1: Criar o endereço
    const enderecoCriado = await enderecoController.criarEnderecoInterno(endereco);

    // Passo 2: Criar a quadra com o id_endereco do endereço recém-criado
    const { data: quadraCriada, error: errorQuadra } = await supabase
      .from('Quadra')
      .insert([
        {
          nome,
          tipo,
          id_endereco: enderecoCriado.id_endereco, // Associa o id_endereco da quadra
        }
      ])
      .select(); // Retorna a quadra criada

    if (errorQuadra) {
      return res.status(500).json({ error: 'Erro ao cadastrar a quadra: ' + errorQuadra.message });
    }

    res.status(201).json({
      mensagem: 'Quadra e endereço cadastrados com sucesso!',
      quadra: quadraCriada[0], // Retorna a quadra criada
      endereco: enderecoCriado, // Retorna o endereço criado
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao cadastrar quadra: ' + error.message });
  }
};


exports.listarQuadras = async (req, res) => {
  const { data, error } = await supabase.from('quadra').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.buscarQuadraPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('quadra').select('*').eq('id_quadra', id).single();
  if (error) return res.status(404).json({ error: 'Quadra não encontrada' });
  res.json(data);
};

exports.atualizarQuadra = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('quadra').update(req.body).eq('id_quadra', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.deletarQuadra = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('quadra').delete().eq('id_quadra', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
};
