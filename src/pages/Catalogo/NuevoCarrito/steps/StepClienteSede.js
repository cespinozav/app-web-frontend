import React from 'react';

export default function StepClienteSede({ clients, sites, selectedClient, setSelectedClient, selectedSite, setSelectedSite, onBack, onNext }) {
  // Aquí van los selectores de cliente y sede
  return (
    <div>
      <h2>Cliente y Sede</h2>
      {/* Selectores de cliente y sede */}
      <button onClick={onBack}>Atrás</button>
      <button onClick={onNext} disabled={!selectedClient || !selectedSite}>Continuar</button>
    </div>
  );
}
