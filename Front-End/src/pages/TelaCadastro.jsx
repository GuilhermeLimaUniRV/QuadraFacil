import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TelaCadastro.css';

const TelaCadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();
    if (senha !== confirmar) {
      alert('As senhas não coincidem.');
      return;
    }

    alert(`Usuário cadastrado: ${nome} - ${email}`);
    navigate('/login');
  };

  const cancelarCadastro = () => {
    navigate('/login');
  };

  return (
    <div className="tela-cadastro">
      <h2>Cadastrar</h2>
      <form onSubmit={handleCadastro}>
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Senha:</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

        <label>Confirmar Senha:</label>
        <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />

        <button type="submit">Cadastrar</button>
        <button type="button" onClick={cancelarCadastro} className="botao-cancelar">Cancelar</button>
      </form>
    </div>
  );
};

export default TelaCadastro;
