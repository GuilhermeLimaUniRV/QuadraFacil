// src/api/usuario.js
import API from './apiClient';

export const loginUsuario = async (email, senha) => {
  const resposta = await API.post('/usuarios/login', {
    email,
    senha_hash: senha
  });
  return resposta.data;
};
