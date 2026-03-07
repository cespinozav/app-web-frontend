import React, { useState } from 'react';
import StepCarrito from './steps/StepCarrito';
import StepResumen from './steps/StepResumen';
import StepClienteSede from './steps/StepClienteSede';
import StepPago from './steps/StepPago';

export default function NuevoCarritoWizard() {
  // Estado global del wizard
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState({ subtotal: 0, discount: 0, total: 0 });
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [operationNumber, setOperationNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Lógica de navegación
  const goNext = () => setStep(s => s + 1);
  const goBack = () => setStep(s => s - 1);

  // Renderizado condicional por paso
  return (
    <div>
      {step === 0 && (
        <StepCarrito cart={cart} onUpdate={() => {}} onRemove={() => {}} onNext={goNext} />
      )}
      {step === 1 && (
        <StepResumen cart={cart} summary={summary} onBack={goBack} onNext={goNext} />
      )}
      {step === 2 && (
        <StepClienteSede
          clients={clients}
          sites={sites}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 3 && (
        <StepPago
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          operationNumber={operationNumber}
          setOperationNumber={setOperationNumber}
          onBack={goBack}
          onSubmit={() => {}}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
