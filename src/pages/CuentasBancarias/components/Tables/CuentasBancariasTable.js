import React from 'react';
import { Button } from 'primereact/button';
import EstadoBadge from 'components/styles/EstadoBadge';

const CuentasBancariasTable = ({ cuentas, onView }) => (
  <div className="tabla-ordenes">
    <table className="app-table">
      <thead>
        <tr>
          <th>Banco</th>
          <th>Tipo de cuenta</th>
          <th>Moneda</th>
          <th>CC</th>
          <th>CCI</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cuentas.length === 0 ? (
          <tr>
            <td colSpan={9} style={{ textAlign: 'center' }}>No hay cuentas bancarias</td>
          </tr>
        ) : (
          cuentas.map((cuenta) => (
            <tr key={cuenta.id}>
              <td>{cuenta.entidad_bancaria_desc || cuenta.entidad_bancaria}</td>
              <td>{cuenta.tipo_cuenta_desc || cuenta.tipo_cuenta}</td>
              <td>{cuenta.moneda}</td>
              <td>{cuenta.cc ? `****${cuenta.cc.slice(-4)}` : ''}</td>
              <td>{cuenta.cci ? `****${cuenta.cci.slice(-4)}` : ''}</td>
              <td><EstadoBadge estado={cuenta.estado} /></td>
              <td>
                <div className="actions">
                  <Button icon="pi pi-eye" className="p-button p-component p-button-icon-only" style={{ background: 'transparent' }} aria-label="Ver Cuenta" onClick={() => onView && onView(cuenta)} />
                  <Button icon="pi pi-pencil" className="p-button p-component p-button-icon-only" style={{ background: 'transparent', marginLeft: 8 }} aria-label="Editar" />
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default CuentasBancariasTable;
