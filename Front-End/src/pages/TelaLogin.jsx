import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TelaLogin.css';
import { loginUsuario } from '../api/usuario';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const TelaLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resposta = await loginUsuario(email, senha);
      localStorage.setItem('id_usuario', resposta.usuario.id_usuario); // salvar ID
      localStorage.setItem('perfil', resposta.usuario.perfil); // Administrador ou Cidadão
      localStorage.setItem('nome', resposta.usuario.nome); // Salvar o nome do usuário (opcional)
      setMensagem(resposta.mensagem);
      setTipoMensagem('sucesso');
      setTimeout(() => {
        setMensagem('');
        navigate('/principal');
      }, 1000);
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
        <input type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Senha:</label>
        <div className="campo-senha">
          <input
            type={mostrarSenha ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <span className="icone-senha" onClick={() => setMostrarSenha(!mostrarSenha)}>
            {mostrarSenha ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button type="submit">Entrar</button>
      </form>

      <p onClick={() => navigate('/recuperar')} className="link-recuperar">Esqueci minha senha</p>

      <div className="cadastro-container">
        <p onClick={() => navigate('/cadastro')} >Não tenho conta</p>
      </div>
    </div>
  );
};

export default TelaLogin;
