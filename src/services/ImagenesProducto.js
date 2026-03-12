import { makeRequest } from 'utils/api';
import { getBearer } from 'utils/auth';

const ENDPOINT = '/images';

const ImagenesProductoService = {
  create: async ({ productId, file }) => {
    const formData = new FormData();
    formData.append('product', productId);
    formData.append('image', file);
    return makeRequest(`${ENDPOINT}/create/`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: localStorage.getItem('accessToken')
          ? getBearer()
          : undefined,
      },
      isFormData: true,
    });
  },
  update: async ({ imageId, productId, file }) => {
    const formData = new FormData();
    formData.append('product', productId);
    formData.append('image', file);
    return makeRequest(`${ENDPOINT}/${imageId}/update/`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authorization: localStorage.getItem('accessToken')
          ? getBearer()
          : undefined,
      },
      isFormData: true,
    });
  },
  delete: async (imageId) => makeRequest(`${ENDPOINT}/${imageId}/delete/`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem('accessToken')
        ? getBearer()
        : undefined,
    },
  }),
  list: async (productId) => {
    const res = await makeRequest(`${ENDPOINT}/?product=${productId}`, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('accessToken')
          ? getBearer()
          : undefined,
      },
    });
    const data = await res.json();
    // Si la respuesta tiene result.results, devolver solo ese array
    if (data && data.result && Array.isArray(data.result.results)) {
      return data.result.results;
    }
    // Fallback: si la respuesta es un array directamente
    if (Array.isArray(data)) return data;
    // Si no, devolver array vacío
    return [];
  },
};

export default ImagenesProductoService;
