import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MinhasReservas.css';
import {
  listarReservas,
  listarReservasPorUsuario,
  excluirReserva,
  atualizarStatusReserva
} from '../api/reserva';
import AlertaPopup from '../components/AlertaPopup'; // novo componente
import BotaoVoltar from '../components/BotaoVoltar';

const MinhasReservas = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);

  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  // Filtros
  const [filtroQuadra, setFiltroQuadra] = useState('');
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    const id = sessionStorage.getItem('id_usuario');
    const perfil = sessionStorage.getItem('perfil');

    if (!id) {
      navigate('/login');
      return;
    }

    setUsuarioId(id);
    setIsAdmin(perfil === 'administrador');
  }, [navigate]);

  const buscarReservas = async () => {
    try {
      const resposta = isAdmin
        ? await listarReservas()
        : await listarReservasPorUsuario(usuarioId);

      setReservas(resposta);
    } catch (err) {
      console.error('Erro ao buscar reservas:', err);
      setMensagem('Erro ao buscar reservas.');
      setTipoMensagem('erro');
    }
  };

  useEffect(() => {
    if (usuarioId) buscarReservas();
  }, [usuarioId, isAdmin]);

  const exibirMensagem = (texto, tipo) => {
    setMensagem(texto);
    setTipoMensagem(tipo);
    setTimeout(() => setMensagem(''), 3000);
  };

  const handleExcluir = async (idReserva) => {
    try {
      await excluirReserva(idReserva);
      setReservas(reservas.filter(r => r.id_reserva !== idReserva));
      exibirMensagem('Reserva Excluida', 'sucesso');
    } catch (err) {
      console.error('Erro ao excluir reserva:', err);
      exibirMensagem('Erro ao excluir reserva.', 'erro');
    }
  };

  const handleAtualizarStatus = async (id, novoStatus) => {
    try {
      await atualizarStatusReserva(id, novoStatus);
      setReservas(prev =>
        prev.map(r =>
          r.id_reserva === id ? { ...r, status: novoStatus } : r
        )
      );
      exibirMensagem(
        `Reserva ${novoStatus === 'confirmada' ? 'aprovada' : 'rejeitada'} com sucesso.`,
        'sucesso'
      );
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      const erroMsg = err.response?.data?.mensagem || 'Erro ao atualizar status.';
      exibirMensagem(erroMsg, 'erro');
    }
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    return (
      reserva.quadra?.nome.toLowerCase().includes(filtroQuadra.toLowerCase()) &&
      reserva.usuario?.nome.toLowerCase().includes(filtroUsuario.toLowerCase()) &&
      reserva.data_reserva.includes(filtroData) &&
      (filtroStatus === '' || reserva.status === filtroStatus)
    );
  });

  return (
    <div className="minhas-reservas">
      <BotaoVoltar/>
      <h2>Reservas</h2>

      <AlertaPopup
        mensagem={mensagem}
        tipo={tipoMensagem}
        onFechar={() => setMensagem('')}
      />

      {isAdmin && (
        <div className="filtros">
          <input
            type="text"
            placeholder="Filtrar por quadra"
            value={filtroQuadra}
            onChange={(e) => setFiltroQuadra(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por usuário"
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
          />
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="pendente">Pendente</option>
            <option value="confirmada">Confirmada</option>
            <option value="rejeitada">Rejeitada</option>
          </select>
        </div>
      )}

      <ul>
        {reservasFiltradas.map((reserva) => (
          <li key={reserva.id_reserva}>
            <div>
              <strong>Quadra:</strong> {reserva.quadra?.nome || 'N/D'}<br />
              <strong>Tipo:</strong> {reserva.quadra?.tipo || 'N/D'}<br />
              <strong>Data:</strong> {reserva.data_reserva}<br />
              <strong>Horário:</strong> {reserva.horario_inicio} - {reserva.horario_fim}<br />
              {isAdmin && (
                <><strong>Usuário:</strong> {reserva.usuario?.nome || 'N/D'}<br /></>
              )}
              <strong>Status:</strong> {reserva.status}
            </div>
            <div>
              <button onClick={() => handleExcluir(reserva.id_reserva)}>Excluir</button>

              {isAdmin && reserva.status === 'pendente' && (
                <>
                  <button onClick={() => handleAtualizarStatus(reserva.id_reserva, 'confirmada')}>Aprovar</button>
                  <button onClick={() => handleAtualizarStatus(reserva.id_reserva, 'rejeitada')}>Rejeitar</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MinhasReservas;
