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

export function ClienteDeleteModal({ visible, onHide, onDelete, rowData }) {
  return (
    <Dialog
      className="dialog delete-dialog"
      draggable={false}
      visible={visible}
      modal
      onHide={onHide}
      header={<span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Eliminar cliente</span>}
      closable={true}
      footer={<div>
        <button className="p-button-text" onClick={onHide}>Cancelar</button>
        <button className="p-button-danger" onClick={onDelete}>Eliminar</button>
      </div>}
    >
      <p>¿Está seguro que desea eliminar el cliente <b>{rowData?.nombre}</b>?</p>
    </Dialog>
  );
}
