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

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [quadrasData, reservasData] = await Promise.all([
          listarQuadras(),
          listarReservas()
        ]);
        setQuadras(quadrasData);
        setReservas(reservasData);
      } catch (error) {
        mostrarMensagem('Erro ao carregar dados', 'erro');
      }
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if (quadraSelecionada || data) {
      filtrarReservas();
    } else {
      listarReservas().then(setReservas);
    }
  }, [quadraSelecionada, data]);

  const formatarDataExibicao = (dataUTC) => {
    // Divida a string YYYY-MM-DD e reconstrua manualmente
    const [ano, mes, dia] = dataUTC.split('-');
    return `${dia}/${mes}/${ano}`; // Formato pt-BR sem conversão de timezone
  };
  
  const mostrarMensagem = (msg, tipo) => {
    setMensagem(msg);
    setTipoMensagem(tipo);
    setTimeout(() => setMensagem(''), 3000);  // A mensagem desaparecerá automaticamente após 3 segundos
  };

  const filtrarReservas = async () => {
    try {
      setCarregando(true);
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
          r => new Date(r.data_reserva).toISOString().split('T')[0] === dataFiltro
        );
      }

      setReservas(reservasFiltradas);
    } catch (err) {
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

      mostrarMensagem('Reserva realizada com sucesso!', 'sucesso');
      setQuadraSelecionada('');
      setData('');
      setHoraInicio('');
      setHoraFim('');
      listarReservas().then(setReservas);
    } catch (err) {
      const mensagemErro = err.response?.data?.mensagem || 'Erro ao realizar reserva.';
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
          <div className="carregando">Carregando...</div>
        ) : reservas.length === 0 ? (
          <div className="sem-reservas">
            {quadraSelecionada || data
              ? "Nenhuma reserva encontrada"
              : "Nenhuma reserva cadastrada"}
          </div>
        ) : (
          <ul className="reservas-lista">
            {reservas.map((reserva) => (
              <li key={reserva.id_reserva} className="reserva-item">
                <div className="reserva-info">
                  <span className="reserva-quadra">
                    {quadras.find(q => q.id_quadra === reserva.id_quadra)?.nome || reserva.id_quadra}
                  </span>
                  <span className="reserva-data">
                    {formatarDataExibicao(reserva.data_reserva)}
                  </span>
                  <span className="reserva-horario">
                    {reserva.horario_inicio} - {reserva.horario_fim}
                  </span>
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

        <button type="submit">Reservar</button>
      </form>
    </div>
  );
};

export default TelaReserva;
