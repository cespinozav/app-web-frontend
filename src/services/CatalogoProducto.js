/* eslint-disable camelcase */
import { makeRequest } from 'utils/api';

const ENDPOINT = '/catalogo-productos';

const CatalogoProductoService = {
  get: ({ page = 1, page_size = 10, search = '', cat = '' } = {}) =>
    makeRequest(`${ENDPOINT}`, {
      params: { page, page_size, search, cat },
    }).then(res => res.json()),
  getById: (id) =>
    makeRequest(`${ENDPOINT}/${id}`, {}).then(res => res.json()),
};

export default CatalogoProductoService;
