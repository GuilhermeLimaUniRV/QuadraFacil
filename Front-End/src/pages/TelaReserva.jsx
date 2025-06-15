import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TelaReserva.css';
import { listarQuadras } from '../api/quadra';
import { criarReserva } from '../api/reserva';

const TelaReserva = () => {
  const [quadras, setQuadras] = useState([]);
  const [quadraSelecionada, setQuadraSelecionada] = useState('');
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  useEffect(() => {
    listarQuadras().then(setQuadras);
  }, []);

  const handleReserva = async (e) => {
    e.preventDefault();

    if (!quadraSelecionada || !data || !horaInicio || !horaFim) {
      setMensagem('Preencha todos os campos.');
      setTipoMensagem('erro');
      return;
    }

    if (horaInicio >= horaFim) {
      setMensagem('Horário inicial deve ser menor que o final.');
      setTipoMensagem('erro');
      return;
    }

    const id_usuario = parseInt(localStorage.getItem('id_usuario'));

    if (!id_usuario) {
      setMensagem('Usuário não autenticado.');
      setTipoMensagem('erro');
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

      setMensagem('Reserva realizada com sucesso!');
      setTipoMensagem('sucesso');

      // Resetar os campos após 2 segundos
      setTimeout(() => {
        setMensagem('');
        setQuadraSelecionada('');
        setData('');
        setHoraInicio('');
        setHoraFim('');
      }, 2000);

    } catch (err) {
      setMensagem('Horário já reservado ou erro na reserva.');
      setTipoMensagem('erro');
    }
  };


  return (
    <div className="tela-reserva">
      <h2>Nova Reserva</h2>

      {mensagem && <div className={`mensagem ${tipoMensagem}`}>{mensagem}</div>}

      <form onSubmit={handleReserva}>
        <label>Quadra:</label>
        <select value={quadraSelecionada} onChange={(e) => setQuadraSelecionada(e.target.value)} required>
          <option value="">Selecione uma quadra</option>
          {quadras.map((q) => (
            <option key={q.id_quadra} value={q.id_quadra}>
              {q.nome}
            </option>
          ))}
        </select>

        <label>Data:</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} required />

        <label>Horário de Início:</label>
        <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />

        <label>Horário de Fim:</label>
        <input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} required />

        <button type="submit">Reservar</button>
      </form>
    </div>
  );
};

export default TelaReserva;
