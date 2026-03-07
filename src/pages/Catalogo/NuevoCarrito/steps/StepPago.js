import React from 'react';

export default function StepPago({ paymentMethod, setPaymentMethod, operationNumber, setOperationNumber, onBack, onSubmit, isSaving }) {
  // Aquí va el formulario/modal de pago
  return (
    <div>
      <h2>Procesar Pago</h2>
      {/* Formulario de método de pago y número de operación */}
      <button onClick={onBack}>Atrás</button>
      <button onClick={onSubmit} disabled={isSaving}>Crear Orden</button>
    </div>
  );
}
