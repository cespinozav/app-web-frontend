import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';

const CuentaBancariaForm = ({ form, formErrors, bancos, tiposCuenta, bancosLoading, onChange, onSubmit, onClose, readOnly }) => (
  <form onSubmit={e => { e.preventDefault(); if (!readOnly) onSubmit(); }} style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        width: '100%'
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          width: '100%'
        }}
      >
        <div style={{ flex: 1, minWidth: 180, maxWidth: '100%' }}>
          <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Banco <span className="required" style={{ color: '#e53935' }}>*</span></label>
          <Dropdown
            value={form.banco || ''}
            options={bancos.map(b => ({ label: b.descripcion, value: b.id }))}
            placeholder="Seleccione banco"
            style={{ width: '100%', borderRadius: 8, fontSize: 15, background: '#f8f9fa' }}
            disabled={bancosLoading || readOnly}
            onChange={e => !readOnly && onChange({ ...form, banco: e.value })}
            className={formErrors.banco ? 'p-invalid' : ''}
            showClear={!readOnly}
            filter={!readOnly}
          />
          {formErrors.banco && <div className="error new-input-error">{formErrors.banco}</div>}
        </div>
        <div style={{ flex: 1, minWidth: 180, maxWidth: '100%' }}>
          <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Tipo de cuenta <span className="required" style={{ color: '#e53935' }}>*</span></label>
          <Dropdown
            value={form.tipoCuenta}
            options={tiposCuenta.map(t => ({ label: t.descripcion, value: t.id }))}
            onChange={e => !readOnly && onChange({ ...form, tipoCuenta: e.value })}
            placeholder="Selecciona tipo de cuenta"
            style={{ width: '100%', borderRadius: 8, fontSize: 15, background: '#f8f9fa' }}
            className={formErrors.tipoCuenta ? 'p-invalid' : ''}
            showClear={!readOnly}
            filter={!readOnly}
            disabled={readOnly}
          />
          {formErrors.tipoCuenta && <div className="error new-input-error">{formErrors.tipoCuenta}</div>}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          width: '100%'
        }}
      >
        <div style={{ flex: 1, minWidth: 180, maxWidth: '100%' }}>
          <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Moneda <span className="required" style={{ color: '#e53935' }}>*</span></label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label className={`radio-card${form.moneda === 'SOL' ? ' activated' : ''}`} style={{ borderRadius: 8, padding: '6px 12px', fontSize: 15, background: form.moneda === 'SOL' ? '#e3f2fd' : '#fff', border: form.moneda === 'SOL' ? '1.5px solid #1976d2' : '1.5px solid #ecebeb', cursor: readOnly ? 'default' : 'pointer' }}>
              <RadioButton inputId="PEN" name="currency_type" value="SOL" checked={form.moneda === 'SOL'} onChange={e => !readOnly && onChange({ ...form, moneda: e.value })} disabled={readOnly} />
              <span className="radio-double-label" style={{ marginLeft: 6 }}>S/</span>
              <span className="radio-card-label" style={{ marginLeft: 4 }}>Soles</span>
            </label>
            <label className={`radio-card${form.moneda === 'USD' ? ' activated' : ''}`} style={{ borderRadius: 8, padding: '6px 12px', fontSize: 15, background: form.moneda === 'USD' ? '#e3f2fd' : '#fff', border: form.moneda === 'USD' ? '1.5px solid #1976d2' : '1.5px solid #ecebeb', cursor: readOnly ? 'default' : 'pointer' }}>
              <RadioButton inputId="USD" name="currency_type" value="USD" checked={form.moneda === 'USD'} onChange={e => !readOnly && onChange({ ...form, moneda: e.value })} disabled={readOnly} />
              <span className="radio-double-label" style={{ marginLeft: 6 }}>$</span>
              <span className="radio-card-label" style={{ marginLeft: 4 }}>Dólares</span>
            </label>
          </div>
          {formErrors.moneda && <div className="error new-input-error">{formErrors.moneda}</div>}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          width: '100%'
        }}
      >
        <div style={{ flex: 1, minWidth: 180, maxWidth: '100%' }}>
          <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>CC: Número de cuenta bancaria <span className="new-input-required" style={{ color: '#e53935' }}>*</span></label>
          <InputText
            id="cc-create"
            placeholder="Ingresa número de cuenta bancaria"
            value={form.cc}
            onChange={e => !readOnly && onChange({ ...form, cc: e.target.value })}
            className={`input${formErrors.cc ? ' p-invalid' : ''}`}
            autoComplete="on"
            style={{ borderRadius: 8, fontSize: 15, background: '#f8f9fa' }}
            icon="pi pi-credit-card"
            disabled={readOnly}
          />
          {formErrors.cc && <div className="error new-input-error">{formErrors.cc}</div>}
        </div>
        <div style={{ flex: 1, minWidth: 180, maxWidth: '100%' }}>
          <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>CCI: Cuenta interbancaria <span className="new-input-required" style={{ color: '#e53935' }}>*</span></label>
            <InputText
              id="cci-create"
              placeholder="Ingresa número de cuenta interbancaria"
              value={form.cci}
              onChange={e => !readOnly && onChange({ ...form, cci: e.target.value })}
              className={`input${formErrors.cci ? ' p-invalid' : ''}`}
              autoComplete="on"
              style={{ borderRadius: 8, fontSize: 15, background: '#f8f9fa', width: '100%' }}
              icon="pi pi-hashtag"
              disabled={readOnly}
            />
            {formErrors.cci && <div className="error new-input-error">{formErrors.cci}</div>}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          width: '100%'
        }}
      >
        <div style={{ flex: 1, minWidth: 180, maxWidth: '100%' }}>
          <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Alias de la cuenta <span className="new-input-required" style={{ color: '#e53935' }}>*</span></label>
            <InputText
              placeholder="Ingresa un alias"
              value={form.alias}
              onChange={e => !readOnly && onChange({ ...form, alias: e.target.value })}
              className={`input${formErrors.alias ? ' p-invalid' : ''}`}
              style={{ borderRadius: 8, fontSize: 15, background: '#f8f9fa', width: '100%' }}
              icon="pi pi-user"
              disabled={readOnly}
            />
            {formErrors.alias && <div className="error new-input-error">{formErrors.alias}</div>}
        </div>
      </div>
      {!readOnly && (
        <div style={{ marginTop: 24, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button label="Guardar" icon="pi pi-save" className="p-button p-component" style={{ borderRadius: 8, fontWeight: 600, fontSize: 15, padding: '8px 24px' }} type="submit" />
          <Button label="Cancelar" icon="pi pi-times" className="p-button p-component p-button-secondary" style={{ borderRadius: 8, fontWeight: 600, fontSize: 15, padding: '8px 24px' }} onClick={onClose} type="button" />
        </div>
      )}
    </div>
  </form>
);

export default CuentaBancariaForm;
