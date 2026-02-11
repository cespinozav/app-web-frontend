/* eslint-disable global-require */
import { makeRequest } from 'utils/api';

const PerfilService = {
  getPerfil: () =>
    makeRequest('/perfil', {
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => res.result),
};

export default PerfilService;
