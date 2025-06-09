import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TelaLogin.css';
import { loginUsuario } from '../api/usuario';

const TelaLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resposta = await loginUsuario(email, senha);
      setMensagem(resposta.mensagem);
      setTipoMensagem('sucesso');
      setTimeout(() => {
        setMensagem('');
        navigate('/reserva');
      }, 1500);
    } catch (err) {
      setMensagem('Credenciais inválidas.');
      setTipoMensagem('erro');
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  return (
    <div className="tela-login">
      <h2>Login</h2>

      {mensagem && (
        <div className={`mensagem ${tipoMensagem}`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Senha:</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

        <button type="submit">Entrar</button>
      </form>

      <p  className="link-recuperar">Esqueci minha senha</p>

      <div className="cadastro-container">
        <p onClick={() => navigate('/cadastro')} >Não tenho conta</p>
      </div>
    </div>
  );
};

export default TelaLogin;
