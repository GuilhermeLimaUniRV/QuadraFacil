import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TelaLogin.css';

const TelaLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulação simples de login bem-sucedido
    if (email && senha) {
      navigate('/reserva');
    } else {
      alert('Preencha os campos corretamente.');
    }
  };

  const irParaCadastro = () => {
    navigate('/cadastro');
  };

  return (
    <div className="tela-login">
      <h2>Entrar</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Senha:</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

        <button type="submit">Entrar</button>
      </form>

      <p className="link-recuperar">Esqueci minha senha</p>

      <div className="cadastro-container">
        <p>Não tem conta?</p>
        <button onClick={irParaCadastro}>Criar conta</button>
      </div>
    </div>
  );
};

export default TelaLogin;
