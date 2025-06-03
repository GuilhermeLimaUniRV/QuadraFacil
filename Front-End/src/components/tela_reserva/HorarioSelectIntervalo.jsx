import React from 'react';
import './HorarioSelectIntervalo.css';

const HorarioSelectIntervalo = ({
  horarios,
  inicio,
  fim,
  onChangeInicio,
  onChangeFim,
}) => {
  return (
    <div className="horario-select-intervalo">
      <label>Horário de Início:</label>
      <select value={inicio} onChange={onChangeInicio}>
        <option value="">Selecionar</option>
        {horarios.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>

      <label>Horário de Fim:</label>
      <select value={fim} onChange={onChangeFim}>
        <option value="">Selecionar</option>
        {horarios.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
    </div>
  );
};

export default HorarioSelectIntervalo;
