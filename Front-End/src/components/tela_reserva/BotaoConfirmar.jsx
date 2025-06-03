import React from 'react';
import './BotaoConfirmar.css';

const BotaoConfirmar = ({ onClick, disabled }) => {
  return (
    <button className="botao-confirmar" onClick={onClick} disabled={disabled}>
      Confirmar Reserva
    </button>
  );
};

export default BotaoConfirmar;
