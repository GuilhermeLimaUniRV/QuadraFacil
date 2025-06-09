// src/api/apiClient.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api' // Ajuste se sua porta for diferente
});

export default API;
