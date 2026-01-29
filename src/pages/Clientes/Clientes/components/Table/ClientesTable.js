import React from 'react';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';

const PAGE_SIZE = 10;

export default function ClientesTable({ clientes, isFetching, onEdit, onDelete }) {
  return (
    <div className="tabla-clientes">
      {isFetching ? (
        Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton className="table" key={i} />)
      ) : (
        <table className="p-datatable table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Abreviatura</th>
              <th>Categoría</th>
              <th>RUC</th>
              <th>Estado</th>
              <th>Usuario creado</th>
              <th>Fecha creada</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center' }}>No hay resultados</td></tr>
            ) : (
              clientes.map(cli => (
                <tr key={cli.id}>
                  <td>{cli.id}</td>
                  <td>{cli.nombre}</td>
                  <td>{cli.abreviatura}</td>
                  <td>{cli.categoria || '-'}</td>
                  <td>{cli.ruc}</td>
                  <td>{cli.active}</td>
                  <td>{cli.usuario_creado || '-'}</td>
                  <td>{cli.fecha_creada ? cli.fecha_creada : '-'}</td>
                  <td>
                    <div className="actions">
                      <Button
                        icon="pi pi-pencil"
                        className="p-button p-component p-button-icon-only"
                        style={{ background: 'transparent' }}
                        onClick={() => onEdit(cli)}
                        aria-label="Editar"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
