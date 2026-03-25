import React from 'react'
import { Button } from 'primereact/button'
import { Skeleton } from 'primereact/skeleton'
import EstadoBadge from 'components/styles/EstadoBadge'
import { formatDate } from 'utils/dates'


export default function ClientesTable({ clientes, page, PAGE_SIZE, setRowData, setShowAdd, setShowSedes, isFetching }) {
  return (
    <div className="tabla-clientes">
      {isFetching ? (
        Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton className="table" key={i} />)
      ) : (
        <table className="app-table">
          <thead>
            <tr>
              <th>Nro</th>
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
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>
                  No hay resultados
                </td>
              </tr>
            ) : (
              clientes.map(cli => (
                <tr key={cli.id}>
                  <td>{(page - 1) * PAGE_SIZE + clientes.indexOf(cli) + 1}</td>
                  <td>{cli.nombre}</td>
                  <td>{cli.abreviatura}</td>
                  <td>{cli.categoria || '-'}</td>
                  <td>{cli.ruc}</td>
                  <td>
                    <EstadoBadge estado={cli.active} />
                  </td>
                  <td>{cli.usuario_creado || '-'}</td>
                  <td>{formatDate(cli.fecha_creada)}</td>
                  <td>
                    <div className="actions">
                      <Button
                        icon="pi pi-pencil"
                        className="p-button p-component p-button-icon-only"
                        style={{ background: 'transparent' }}
                        onClick={() => {
                          setRowData(cli)
                          setShowAdd(true)
                        }}
                        aria-label="Editar"
                      />
                      <Button
                        icon="pi pi-map-marker"
                        className="p-button p-component p-button-icon-only"
                        style={{ background: 'transparent', marginLeft: 8 }}
                        onClick={() => {
                          setRowData(cli)
                          setShowSedes(true)
                        }}
                        aria-label="Sedes"
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
  )
}
