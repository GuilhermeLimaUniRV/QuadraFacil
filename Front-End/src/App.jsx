import { Routes, Route, Navigate } from 'react-router-dom';
import TelaLogin from './pages/TelaLogin';
import TelaCadastro from './pages/TelaCadastro';
import TelaReserva from './pages/TelaReserva';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<TelaLogin />} />
      <Route path="/cadastro" element={<TelaCadastro />} />
      <Route path="/reserva" element={<TelaReserva />} />
    </Routes>
  );
}

export default App;
