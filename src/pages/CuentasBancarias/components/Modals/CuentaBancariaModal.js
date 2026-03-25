import React from 'react';
import { Dialog } from 'primereact/dialog';
import CuentaBancariaForm from '../Forms/CuentaBancariaForm';

const CuentaBancariaModal = ({ visible, onHide, readOnly, ...formProps }) => (
  <Dialog header={readOnly ? 'Detalle de cuenta bancaria' : 'Agregar cuenta bancaria'} visible={visible} style={{ width: '540px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }} onHide={onHide}>
    <section className="base-card__body">
      <CuentaBancariaForm {...formProps} onClose={onHide} readOnly={readOnly} />
    </section>
  </Dialog>
);

export default CuentaBancariaModal;
