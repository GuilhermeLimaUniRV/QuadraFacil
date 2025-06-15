import { Routes, Route, Navigate } from 'react-router-dom';
import TelaLogin from './pages/TelaLogin';
import TelaCadastro from './pages/TelaCadastro';
import TelaReserva from './pages/TelaReserva';
import TelaPerdiASenha from './pages/TelaPerdiASenha';
import TelaCadastroQuadra from './pages/TelaCadastroQuadra';
import TelaPrincipal from './pages/TelaPrincipal';
import MinhasReservas from './pages/MinhasReservas';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<TelaLogin />} />
      <Route path="/principal" element={<TelaPrincipal />} /> 
      <Route path="//minhas-reservas" element={<MinhasReservas />} /> 
      <Route path="/cadastro" element={<TelaCadastro />} />
      <Route path="/reserva" element={<TelaReserva />} />
      <Route path="/recuperar" element={<TelaPerdiASenha />} />
      <Route path="/cadastro-quadra" element={<TelaCadastroQuadra />} />
    </Routes>
  );
}

export default App;
