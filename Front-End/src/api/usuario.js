// src/api/usuario.js
import API from './apiClient';

//login do usuaruo
export const loginUsuario = async (email, senha) => {
  const resposta = await API.post('/usuarios/login', {
    email,
    senha_hash: senha
  });
  return resposta.data;
};

// Cadastro do usuario
export const cadastrarUsuario = async ({ nome, email, senha }) => {
  const resposta = await API.post('/usuarios', {
    nome,
    email,
    senha_hash: senha,
    perfil: 'cidadão'
  });
  return resposta.data;
};
