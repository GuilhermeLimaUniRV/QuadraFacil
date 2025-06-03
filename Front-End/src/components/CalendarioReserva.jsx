import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CalendarioReserva.css';

const CalendarioReserva = ({ dataSelecionada, onChange }) => {
  return (
    <div className="calendario-reserva">
      <label>Data:</label>
      <DatePicker selected={dataSelecionada} onChange={onChange} dateFormat="dd/MM/yyyy" />
    </div>
  );
};

export default CalendarioReserva;
