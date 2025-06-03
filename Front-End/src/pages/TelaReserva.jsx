import React, { useState } from 'react';
import QuadraSelect from '../components/QuadraSelect';
import CalendarioReserva from '../components/CalendarioReserva';
import HorarioSelectIntervalo from '../components/HorarioSelectIntervalo';
import BotaoConfirmar from '../components/BotaoConfirmar';
import './TelaReserva.css';

const TelaReserva = () => {
  const quadras = [
    { id: '1', nome: 'Quadra 1 - Jardim Presidente, Rua 117, Quadra 13, lt9' },
    { id: '2', nome: 'Quadra 2 - Norte' },
  ];

  const horarios = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  const [quadraSelecionada, setQuadraSelecionada] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');

  // Simulação de horários já reservados
  const horariosOcupados = [
    { inicio: '10:00', fim: '11:00' },
    { inicio: '14:00', fim: '15:00' },
  ];

  const handleReserva = () => {
    if (horarioInicio >= horarioFim) {
      alert('O horário final deve ser posterior ao horário inicial.');
      return;
    }

    const conflito = horariosOcupados.some(
      (h) => h.inicio === horarioInicio && h.fim === horarioFim
    );

    if (conflito) {
      alert('Esse horário já está reservado. Por favor, escolha outro intervalo.');
      return;
    }

    alert(
      `Reserva confirmada para a quadra ${quadraSelecionada}, no dia ${dataSelecionada?.toLocaleDateString()} das ${horarioInicio} às ${horarioFim}.`
    );
  };

  return (
    <div className="tela-reserva">
      <h2>Reserva de Quadra</h2>

      <QuadraSelect
        quadras={quadras}
        selectedQuadra={quadraSelecionada}
        onChange={(e) => setQuadraSelecionada(e.target.value)}
      />

      <CalendarioReserva
        dataSelecionada={dataSelecionada}
        onChange={setDataSelecionada}
      />

      <HorarioSelectIntervalo
        horarios={horarios}
        inicio={horarioInicio}
        fim={horarioFim}
        onChangeInicio={(e) => setHorarioInicio(e.target.value)}
        onChangeFim={(e) => setHorarioFim(e.target.value)}
      />

      <BotaoConfirmar
        onClick={handleReserva}
        disabled={
          !quadraSelecionada || !dataSelecionada || !horarioInicio || !horarioFim
        }
      />
    </div>
  );
};

export default TelaReserva;
