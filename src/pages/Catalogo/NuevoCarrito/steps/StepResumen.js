import React from 'react';

export default function StepResumen({ cart, summary, onBack, onNext }) {
  // Aquí va el resumen del carrito (subtotal, descuentos, total)
  return (
    <div>
      <h2>Resumen</h2>
      {/* Mostrar resumen del carrito */}
      <button onClick={onBack}>Atrás</button>
      <button onClick={onNext}>Procesar pago</button>
    </div>
  );
}
