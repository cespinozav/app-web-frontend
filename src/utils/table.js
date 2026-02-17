// Devuelve el número de fila (1-based) para tablas, útil para paginación o listados
// pageIndex: índice de la página actual (0-based)
// pageSize: cantidad de filas por página
// rowIndex: índice de la fila en la página actual (0-based)
export function getRowNumber({ pageIndex = 0, pageSize = 0, rowIndex = 0 } = {}) {
  return pageIndex * pageSize + rowIndex + 1
}

// Para tablas sin paginación, solo usa rowIndex + 1
export function getSimpleRowNumber(rowIndex = 0) {
  return rowIndex + 1
}
