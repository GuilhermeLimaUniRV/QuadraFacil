import React from 'react';
import './HorarioList.css';

const HorarioList = ({ horarios, horarioSelecionado, onSelect }) => {
  return (
    <div className="horario-list">
      <label>Horário:</label>
      <div className="horario-botoes">
        {horarios.map((h) => (
          <button
            key={h}
            className={`horario-btn ${horarioSelecionado === h ? 'selecionado' : ''}`}
            onClick={() => onSelect(h)}
          >
            {h}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HorarioList;
