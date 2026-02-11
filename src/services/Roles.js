/* eslint-disable camelcase, global-require */
import { makeRequest } from 'utils/api';

const ENDPOINT = '/roles';

const RolesService = {
  get: async ({ page = 1, page_size = 10 } = {}) => {
    const response = await makeRequest(`${ENDPOINT}?page=${page}&page_size=${page_size}`, {
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    });
    return response.json();
  },
  post: ({ description, state }) =>
    makeRequest(`${ENDPOINT}/create`, {
      method: 'POST',
      body: { description, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    }),
  put: ({ id, description, state }) =>
    makeRequest(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      body: { description, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    }),
  delete: ({ id }) =>
    makeRequest(`${ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
};

export default RolesService;
