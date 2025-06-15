import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TelaCadastroQuadra.css';
import { cadastrarQuadra } from '../api/quadra';

const TelaCadastroQuadra = () => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [endereco, setEndereco] = useState({
    rua: '',
    bairro: '',
    cidade: '',
    estado: '', // Agora será o nome completo do estado
    cep: '',
    complemento: ''
  });
  const navigate = useNavigate();

  // Lista de estados com nome completo
  const estados = [
    { nome: "Acre" },
    { nome: "Alagoas" },
    { nome: "Amazonas" },
    { nome: "Bahia" },
    { nome: "Ceará" },
    { nome: "Distrito Federal" },
    { nome: "Espírito Santo" },
    { nome: "Goiás" },
    { nome: "Maranhão" },
    { nome: "Mato Grosso" },
    { nome: "Mato Grosso do Sul" },
    { nome: "Minas Gerais" },
    { nome: "Pará" },
    { nome: "Paraíba" },
    { nome: "Paraná" },
    { nome: "Pernambuco" },
    { nome: "Piauí" },
    { nome: "Rio de Janeiro" },
    { nome: "Rio Grande do Norte" },
    { nome: "Rio Grande do Sul" },
    { nome: "Rondônia" },
    { nome: "Roraima" },
    { nome: "Santa Catarina" },
    { nome: "São Paulo" },
    { nome: "Sergipe" },
    { nome: "Tocantins" }
  ];

  const handleCadastroQuadra = async (e) => {
    e.preventDefault();

    const quadraComEndereco = {
      nome,
      tipo,
      endereco // Envia o objeto de endereço junto com a quadra
    };

    try {
      const resposta = await cadastrarQuadra(quadraComEndereco);
      alert(resposta.mensagem);
      navigate('/quadras'); // Redireciona após sucesso
    } catch (err) {
      alert('Erro ao cadastrar a quadra.');
    }
  };

  return (
    <div className="tela-cadastro-quadra">
      <h2>Cadastrar Quadra</h2>

      <form onSubmit={handleCadastroQuadra}>
        <label>Nome da Quadra:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label>Tipo:</label>
        <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} required />

        <h3>Endereço</h3>
        <label>Rua:</label>
        <input type="text" value={endereco.rua} onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })} required />

        <label>Bairro:</label>
        <input type="text" value={endereco.bairro} onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })} required />

        <label>Cidade:</label>
        <input type="text" value={endereco.cidade} onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })} required />

        <label>Estado:</label>
        <select 
          value={endereco.estado} 
          onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })} 
          required
        >
          <option value="">Selecione o estado</option>
          {estados.map((estado, index) => (
            <option key={index} value={estado.nome}>
              {estado.nome}
            </option>
          ))}
        </select>

        <label>CEP:</label>
        <input type="text" value={endereco.cep} onChange={(e) => setEndereco({ ...endereco, cep: e.target.value })} required />

        <label>Complemento:</label>
        <input type="text" value={endereco.complemento} onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })} />

        <button type="submit">Cadastrar Quadra</button>
      </form>
    </div>
  );
};

export default TelaCadastroQuadra;
