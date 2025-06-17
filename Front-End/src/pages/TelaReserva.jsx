import React, { useEffect, useState } from 'react';
import './TelaReserva.css';
import { listarQuadras } from '../api/quadra';
import { criarReserva, listarReservas } from '../api/reserva';
import BotaoVoltar from '../components/BotaoVoltar';
import AlertaPopup from '../components/AlertaPopup'; // Importando o pop-up de mensagem

const TelaReserva = () => {

  const [quadras, setQuadras] = useState([]);
  const [quadraSelecionada, setQuadraSelecionada] = useState('');
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  // NOVO: Estado para armazenar o ID do usuário logado
  const [idUsuarioLogado, setIdUsuarioLogado] = useState(null);

  // Determinar se o usuário é admin baseado na sessionStorage
  const isAdmin = sessionStorage.getItem('perfil') === 'administrador';

  useEffect(() => {
    // Obter o ID do usuário logado do sessionStorage ao carregar o componente
    const userId = parseInt(sessionStorage.getItem('id_usuario'));
    if (!isNaN(userId)) { // Verifica se é um número válido
      setIdUsuarioLogado(userId);
    } else {
      console.warn("ID do usuário não encontrado ou inválido no sessionStorage.");
    }

    const carregarDados = async () => {
      try {
        const [quadrasData, reservasData] = await Promise.all([
          listarQuadras(),
          listarReservas() // Assumindo que listarReservas já traz os dados completos
        ]);
        setQuadras(quadrasData);
        setReservas(reservasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        mostrarMensagem('Erro ao carregar dados', 'erro');
      }
    };
    carregarDados();
  }, []);

  // Este useEffect e a função filtrarReservas farão com que a lista de reservas seja filtrada
  // pelos campos do formulário de "Nova Reserva".
  useEffect(() => {
    if (quadraSelecionada || data) {
      filtrarReservas();
    } else {
      listarReservas().then(setReservas);
    }
  }, [quadraSelecionada, data]);

  const formatarDataExibicao = (dataUTC) => {
    if (!dataUTC) return 'N/D';
    const [ano, mes, dia] = dataUTC.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const mostrarMensagem = (msg, tipo) => {
    setMensagem(msg);
    setTipoMensagem(tipo);
    setTimeout(() => setMensagem(''), 3000);
  };

  const filtrarReservas = async () => {
    setCarregando(true);
    try {
      const todasReservas = await listarReservas();

      let reservasFiltradas = todasReservas;

      if (quadraSelecionada) {
        reservasFiltradas = reservasFiltradas.filter(
          r => r.id_quadra.toString() === quadraSelecionada.toString()
        );
      }

      if (data) {
        const dataFiltro = new Date(data).toISOString().split('T')[0];
        reservasFiltradas = reservasFiltradas.filter(
          r => r.data_reserva && r.data_reserva.startsWith(dataFiltro)
        );
      }

      setReservas(reservasFiltradas);
    } catch (err) {
      console.error("Erro ao filtrar reservas:", err);
      mostrarMensagem('Erro ao filtrar reservas', 'erro');
    } finally {
      setCarregando(false);
    }
  };

  const handleReserva = async (e) => {
    e.preventDefault();

    if (!quadraSelecionada || !data || !horaInicio || !horaFim) {
      mostrarMensagem('Preencha todos os campos.', 'erro');
      return;
    }

    if (horaInicio >= horaFim) {
      mostrarMensagem('Horário inicial deve ser menor que o final.', 'erro');
      return;
    }

    const id_usuario = parseInt(sessionStorage.getItem('id_usuario'));

    if (!id_usuario) {
      mostrarMensagem('Usuário não autenticado.', 'erro');
      return;
    }

    try {
      await criarReserva({
        id_usuario,
        id_quadra: quadraSelecionada,
        data_reserva: data,
        horario_inicio: horaInicio,
        horario_fim: horaFim
      });

      mostrarMensagem('Pedido de reserva Realizado!', 'sucesso');
      setQuadraSelecionada('');
      setData('');
      setHoraInicio('');
      setHoraFim('');
      listarReservas().then(setReservas);
    } catch (err) {
      const mensagemErro = err.response?.data?.mensagem || 'Erro ao realizar reserva.';
      console.error("Erro ao criar reserva:", err);
      mostrarMensagem(mensagemErro, 'erro');
    }
  };

  return (
    <div className="tela-reserva">
      <BotaoVoltar />

      <h2>Nova Reserva</h2>

      {/* Exibindo o Pop-up de mensagem */}
      <AlertaPopup mensagem={mensagem} tipo={tipoMensagem} onFechar={() => setMensagem('')} />

      <div className="lista-reservas">
        <h3>Reservas Existentes</h3>

        {carregando ? (
          <div className="carregando">Carregando reservas...</div>
        ) : reservas.length === 0 ? (
          <div className="sem-reservas">
            {quadraSelecionada || data ? (
                `Nenhuma reserva encontrada para os critérios de filtro (quadra ou data do formulário).`
            ) : (
                "Nenhuma reserva cadastrada ainda."
            )}
          </div>
        ) : (
          <ul className="reservas-lista">
            {reservas.map((reserva) => (
              <li key={reserva.id_reserva} className="reserva-item">
                <div className="reserva-info">
                  {/* Informações da Quadra */}
                  <div className="info-group">
                    <strong>Quadra:</strong>
                    <span className="reserva-quadra">
                      {reserva.quadra?.nome || 'N/D'}
                    </span>
                    <span className="reserva-tipo-quadra">
                      ({reserva.quadra?.tipo || 'N/D'})
                    </span>
                  </div>

                  {/* Informações do Usuário: Lógica Aprimorada */}
                  <div className="info-group">
                    <strong>Usuário:</strong>
                    <span className="reserva-usuario">
                      {idUsuarioLogado && reserva.id_usuario === idUsuarioLogado ? (
                        // Se a reserva for do usuário logado
                        'Você' // Ou 'Eu' ou seu nome: `{sessionStorage.getItem('nome_usuario')}`
                      ) : isAdmin ? (
                        // Se não for sua e você for admin, mostra o nome do outro usuário
                        reserva.usuario?.nome || 'N/D'
                      ) : (
                        // Se não for sua e você não for admin, não mostra ou mostra genérico
                        'Outro Usuário' // Ou 'N/D' ou remova este span
                      )}
                    </span>
                  </div>

                  {/* Informações de Data e Horário */}
                  <div className="info-group">
                    <strong>Data:</strong>
                    <span className="reserva-data">
                      {formatarDataExibicao(reserva.data_reserva)}
                    </span>
                  </div>
                  <div className="info-group">
                    <strong>Horário:</strong>
                    <span className="reserva-horario">
                      {reserva.horario_inicio.substring(0, 5)} - {reserva.horario_fim.substring(0, 5)}
                    </span>
                  </div>

                  {/* Status da Reserva */}
                  <div className="info-group">
                    <strong>Status:</strong>
                    <span className={`reserva-status status-${reserva.status}`}>
                      {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleReserva} className="form-nova-reserva">
        <h3>Realizar Nova Reserva</h3>

        <div className="form-group">
          <label>Quadra:</label>
          <select
            value={quadraSelecionada}
            onChange={(e) => setQuadraSelecionada(e.target.value)}
            required
          >
            <option value="">Selecione uma quadra</option>
            {quadras.map((q) => (
              <option key={q.id_quadra} value={q.id_quadra}>
                {q.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Data:</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Horário de Início:</label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Horário de Fim:</label>
          <input
            type="time"
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
            required
          />
        </div>

        <button type="submit">Registrar Reserva</button>
      </form>
    </div>
  );
};

export default TelaReserva;