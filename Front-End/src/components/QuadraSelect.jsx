import React from 'react';
import './QuadraSelect.css';

const QuadraSelect = ({ quadras, selectedQuadra, onChange }) => {
  return (
    <div className="quadra-select">
      <label htmlFor="quadra">Quadra:</label>
      <select id="quadra" value={selectedQuadra} onChange={onChange}>
        <option value="">Selecione uma quadra</option>
        {quadras.map((q) => (
          <option key={q.id} value={q.id}>
            {q.nome}
          </option>
        ))}
      </select>
    </div>
  );
};

export default QuadraSelect;
