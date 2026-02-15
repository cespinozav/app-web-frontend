
import { makeRequest } from '../utils/api';
import { getBearer } from '../utils/auth';

/**
 * Consulta la fecha estimada de entrega para una orden.
 * @returns {Promise<{fecha_orden: string, fecha_entrega_estimada: string}>}
 */
const calcularFechaEntrega = async () => {
  const response = await makeRequest('/calcular-fecha-entrega/', {
    headers: {
      Authorization: getBearer(),
    },
  });
  return response.json();
};

export default calcularFechaEntrega;
