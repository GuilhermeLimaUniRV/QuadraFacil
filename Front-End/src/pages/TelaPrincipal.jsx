import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TelaPrincipal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const TelaPrincipal = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [menuVisible, setMenuVisible] = useState(false); // Controle para mostrar/ocultar o menu

  useEffect(() => {
    const usuarioId = localStorage.getItem('id_usuario');
    const usuarioPerfil = localStorage.getItem('perfil');
    const usuarioNome = localStorage.getItem('nome'); // Salve o nome durante o login, se necessário

    if (!usuarioId) {
      navigate('/login');
    } else if (usuarioPerfil === 'administrador') {
      setIsAdmin(true);
    }

    setUserInfo({
      nome: usuarioNome || 'Usuário',
      perfil: usuarioPerfil || 'cidadão',
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // Alterna a visibilidade do menu
  };

  return (
    <div className="tela-principal">
      <h1>Bem-vindo à Tela Principal</h1>

      {/* Ícone de Usuário */}
      <div className="user-icon" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faUserCircle} size="2x" />
      </div>

      {/* Menu de informações do usuário */}
      {menuVisible && (
        <div className="user-menu">
          <p><strong>{userInfo.nome}</strong></p>
          <p>Perfil: {userInfo.perfil}</p>
          <button onClick={handleLogout}>Sair</button>
        </div>
      )}

      <div className="menu-principal">
        <button onClick={() => navigate('/reserva')}>Fazer Reserva</button>
        <button onClick={() => navigate('/minhas-reservas')}>Minhas Reservas</button>

        {isAdmin && (
          <button onClick={() => navigate('/cadastro-quadra')}>Cadastrar Quadra</button>
        )}
      </div>
    </div>
  );
};

export default TelaPrincipal;
