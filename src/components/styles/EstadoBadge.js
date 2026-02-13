import React from 'react';

const EstadoBadge = ({ estado }) => {
  const normalizedState = String(estado || '').toLowerCase();

  if (normalizedState === 'activo') {
    return <span style={{ color: '#22c55e', fontWeight: 600 }}>Activo</span>;
  }
  if (normalizedState === 'inactivo') {
    return <span style={{ color: '#ef4444', fontWeight: 600 }}>Inactivo</span>;
  }

  if (normalizedState === 'pendiente') {
    return <span style={{ color: '#f59e0b', fontWeight: 600 }}>Pendiente</span>;
  }
  if (normalizedState === 'confirmado') {
    return <span style={{ color: '#2563eb', fontWeight: 600 }}>Confirmado</span>;
  }
  if (normalizedState === 'en camino' || normalizedState === 'en_camino') {
    return <span style={{ color: '#7c3aed', fontWeight: 600 }}>En camino</span>;
  }
  if (normalizedState === 'entregado') {
    return <span style={{ color: '#16a34a', fontWeight: 600 }}>Entregado</span>;
  }

  return <span>{estado || '-'}</span>;
};

export default EstadoBadge;
