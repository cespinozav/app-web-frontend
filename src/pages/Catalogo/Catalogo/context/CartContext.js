import React, { createContext, useContext } from 'react';

const CatalogoCartContext = createContext();

export function CatalogoCartProvider({ children }) {
  // Carrito deshabilitado: lógica será migrada a backend
  return (
    <CatalogoCartContext.Provider value={{ cart: [], addToCart: () => {}, removeProduct: () => {}, updateCartItem: () => {} }}>
      {children}
    </CatalogoCartContext.Provider>
  );
}

export function useCatalogoCart() {
  return useContext(CatalogoCartContext);
}
