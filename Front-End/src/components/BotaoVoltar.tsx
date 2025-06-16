import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BotaoVoltar = ({ destino = '/principal', texto = 'Voltar' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(destino)}
      style={{
        width: 'fit-content',
        padding: '4px 8px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: '#333',
        fontWeight: '500'
      }}
    >
      <FaArrowLeft style={{ fontSize: '12px' }} />
      {texto}
    </button>
  );
};

export default BotaoVoltar;
