/* eslint-disable camelcase, global-require */
import { makeRequest } from 'utils/api';

const ENDPOINT = '/personas';

const UsuariosService = {
  get: ({ page = 1, page_size = 10, search = '', categoria = '', state = '' } = {}) =>
    makeRequest(`${ENDPOINT}`, {
      params: { page, page_size, search, cat_person: categoria, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => {
        const result = res.result || {};
        const results = Array.isArray(result.results)
          ? result.results.map(u => ({
              id: u.id,
              dni: u.dni,
              correo: u.email || '',
              telefono: u.phone_number || '',
              nombres: u.names,
              apellidoPaterno: u.lastname_p,
              apellidoMaterno: u.lastname_m,
              categoria: u.cat_person ? {
                id: u.cat_person.id,
                description: u.cat_person.description
              } : null,
              cliente: u.cliente ? {
                id: u.cliente.id,
                description: u.cliente.description,
                abreviatura: u.cliente.abreviatura,
                ruc: u.cliente.ruc
              } : null,
              usuarioCreado: u.user_created?.username || '',
              fechaCreada: u.date_created || ''
            }))
          : [];
        return {
          results,
          count: typeof result.count === 'number' ? result.count : 0
        };
      }),

  post: ({ dni, apellidoPaterno, apellidoMaterno, nombres, categoria, correo, cliente, telefono }) =>
    makeRequest(`${ENDPOINT}/create`, {
      method: 'POST',
      body: {
        dni,
        lastname_p: apellidoPaterno,
        lastname_m: apellidoMaterno,
        names: nombres,
        phone_number: telefono,
        cat_person_id: categoria,
        cliente_id: cliente?.id || cliente,
        email: correo
      },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    }),

  put: ({ id, dni, apellidoPaterno, apellidoMaterno, nombres, categoria, correo, cliente, telefono }) =>
    makeRequest(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      body: {
        dni,
        lastname_p: apellidoPaterno,
        lastname_m: apellidoMaterno,
        names: nombres,
        phone_number: telefono,
        cat_person_id: categoria,
        cliente_id: cliente?.id || cliente,
        email: correo
      },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
};

export default UsuariosService;
