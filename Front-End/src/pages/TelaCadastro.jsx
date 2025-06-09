import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TelaCadastro.css';
import { cadastrarUsuario } from '../api/usuario';

const TelaCadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (senha !== confirmar) {
      setMensagem('As senhas não coincidem.');
      setTipoMensagem('erro');
      setTimeout(() => setMensagem(''), 3000);
      return;
    }

    try {
      const resposta = await cadastrarUsuario({ nome, email, senha });
      console.log('resposta API:', resposta); // ajuda a verificar o que veio
      setMensagem(resposta.mensagem || 'Usuário cadastrado com sucesso.');
      setTipoMensagem('sucesso');
      setTimeout(() => {
        setMensagem('');
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Erro ao cadastrar:', err.response?.data || err);
      setMensagem(
        err.response?.data?.error?.includes('duplicate') ?
          'Esse e-mail já está em uso.' :
          'Erro ao cadastrar. Verifique os dados.'
      );
      setTipoMensagem('erro');
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  return (
    <div className="tela-cadastro">
      <h2>Cadastrar</h2>

      {mensagem && (
        <div className={`mensagem ${tipoMensagem}`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleCadastro}>
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Senha:</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

        <label>Confirmar Senha:</label>
        <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />

        <button className="botao-cadastrar" type="submit">Cadastrar</button>
        <button type="button" className="botao-cancelar" onClick={() => navigate('/login')}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default TelaCadastro;
