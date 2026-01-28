import React from 'react';
import { Dialog } from 'primereact/dialog';
import ClienteForm from '../Forms/ClienteForm';

export function ClienteAddEditModal({ visible, onHide, onSubmitFields, isMutating, defaultValues, toast }) {
  return (
    <Dialog
      className="dialog clientes-dialog maintenance"
      draggable={false}
      visible={visible}
      modal
      onHide={onHide}
      header={<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{defaultValues ? 'Editar cliente' : 'Agregar cliente'}</span>}
      closable={true}
    >
      <ClienteForm
        onSubmitFields={onSubmitFields}
        isMutating={isMutating}
        defaultValues={defaultValues}
        toast={toast}
      />
    </Dialog>
  );
}

// ClienteDeleteModal removed as delete functionality is not required.
