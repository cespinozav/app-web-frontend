import React from 'react';

const EstadoBadge = ({ estado }) => {
  if (estado === 'activo') {
    return <span style={{ color: '#22c55e', fontWeight: 600 }}>Activo</span>;
  }
  if (estado === 'inactivo') {
    return <span style={{ color: '#ef4444', fontWeight: 600 }}>Inactivo</span>;
  }
  return <span>{estado || '-'}</span>;
};

export default EstadoBadge;
