import React from 'react';
import NuevoCarritoForm from './components/Forms/NuevoCarritoForm';
import { CatalogoCartProvider } from '../Catalogo/context/CartContext';

export default function NuevoCarrito() {
  return (
    <CatalogoCartProvider>
      <NuevoCarritoForm />
    </CatalogoCartProvider>
  );
}
