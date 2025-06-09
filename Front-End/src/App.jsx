import { Routes, Route, Navigate } from 'react-router-dom';
import TelaLogin from './pages/TelaLogin';
import TelaCadastro from './pages/TelaCadastro';
import TelaReserva from './pages/TelaReserva';
import TelaPerdiASenha from './pages/TelaPerdiASenha';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<TelaLogin />} />
      <Route path="/cadastro" element={<TelaCadastro />} />
      <Route path="/reserva" element={<TelaReserva />} />
      <Route path="/recuperar" element={<TelaPerdiASenha />} />
    </Routes>
  );
}

export default App;
