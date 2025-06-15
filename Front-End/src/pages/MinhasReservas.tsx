import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MinhasReservas.css';
import { listarReservas, excluirReserva } from '../api/reserva';

const MinhasReservas = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);

  // Filtros
  const [filtroQuadra, setFiltroQuadra] = useState('');
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('id_usuario');
    const perfil = localStorage.getItem('perfil');

    if (!id) {
      navigate('/login');
      return;
    }

    setUsuarioId(id);
    setIsAdmin(perfil === 'administrador');
  }, [navigate]);

  useEffect(() => {
    if (!usuarioId) return;

    const buscarReservas = async () => {
      try {
        const resposta = isAdmin
          ? await listarReservas()
          : await listarReservas(usuarioId);

        console.log('Reservas carregadas:', resposta);
        setReservas(resposta);
      } catch (err) {
        console.error('Erro ao buscar reservas:', err);
      }
    };

    buscarReservas();
  }, [usuarioId, isAdmin]);

  const handleExcluir = async (idReserva) => {
    try {
      await excluirReserva(idReserva);
      setReservas(reservas.filter(r => r.id_reserva !== idReserva));
    } catch (err) {
      console.error('Erro ao excluir reserva:', err);
    }
  };

  const handleEditar = (idReserva) => {
    navigate(`/editar-reserva/${idReserva}`);
  };

  const reservasFiltradas = reservas.filter(reserva => {
    return (
      reserva.quadra?.nome.toLowerCase().includes(filtroQuadra.toLowerCase()) &&
      reserva.usuario?.nome.toLowerCase().includes(filtroUsuario.toLowerCase()) &&
      reserva.data_reserva.includes(filtroData) &&
      (filtroStatus === '' || reserva.status === filtroStatus)
    );
  });

  return (
    <div className="minhas-reservas">
      <h2>{isAdmin ? 'Todas as Reservas' : 'Minhas Reservas'}</h2>

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
            <option value="">Todos os status</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
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
              {isAdmin && (
                <button onClick={() => handleEditar(reserva.id_reserva)}>Editar</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MinhasReservas;
