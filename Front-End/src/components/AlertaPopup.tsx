import React from 'react';
import './AlertaPopup.css';

const AlertaPopup = ({ mensagem, tipo, onFechar }) => {
  if (!mensagem) return null;

  return (
    <div className={`alerta-popup ${tipo}`}>
      <p>{mensagem}</p>
      <button onClick={onFechar}>×</button>
    </div>
  );
};

export default AlertaPopup;
