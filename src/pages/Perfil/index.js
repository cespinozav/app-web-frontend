import React, { useEffect, useMemo, useState } from 'react'
import PerfilService from 'services/Perfil'
import PersonaSedeClienteService from 'services/PersonaSedeCliente'
import { Card } from 'primereact/card'
import { Avatar } from 'primereact/avatar'
import EstadoBadge from 'components/styles/EstadoBadge'
import { formatDate, formatDateMin } from 'utils/dates'
import './style.scss'

const Perfil = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sedes, setSedes] = useState([])
  const [loadingSedes, setLoadingSedes] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState('')

  const fullName = useMemo(() => {
    const nameParts = [user?.names, user?.lastname_p, user?.lastname_m].filter(Boolean)
    return nameParts.join(' ') || '-'
  }, [user])

  const firstCapital = useMemo(() => {
    const source = user?.names || user?.nombres || ''
    return source.charAt(0).toUpperCase() || '?'
  }, [user])

  const clientData = useMemo(() => {
    const client = user?.cliente || user?.client || null
    return {
      nombre: client?.description || client?.nombre || client?.name || '-',
      abreviatura: client?.abreviatura || client?.abrev || '-',
      ruc: client?.ruc || client?.cod_ruc || '-',
      categoria: client?.category_name || client?.categoria || client?.category || '-',
      estado: client?.state || client?.estado || '-'
    }
  }, [user])

  const renderValue = value => value || '-'

  const renderSedesRows = () => {
    if (loadingSedes) {
      return (
        <tr>
          <td colSpan={6} className="perfil-empty-row">
            Cargando sedes...
          </td>
        </tr>
      )
    }

    if (sedes.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="perfil-empty-row">
            No hay sedes asignadas
          </td>
        </tr>
      )
    }

    return sedes.map(sede => (
      <tr key={sede.id}>
        <td>{sede.id}</td>
        <td>{renderValue(sede.cliente_name)}</td>
        <td>{renderValue(sede.sede_cliente_name)}</td>
        <td>{renderValue(sede.rol_name)}</td>
        <td>
          <EstadoBadge estado={sede.state} />
        </td>
        <td>{formatDateMin(sede.date_joined)}</td>
      </tr>
    ))
  }

  const handleAvatarChange = event => {
    const file = event.target.files?.[0]
    if (!file) {
      setAvatarPreview('')
      return
    }
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
  }

  useEffect(() => {
    PerfilService.getPerfil().then(data => {
      setUser(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!user?.id) return

    setLoadingSedes(true)
    PersonaSedeClienteService.get({ person: user.id, page: 1, page_size: 100 })
      .then(response => {
        setSedes(response?.results || [])
      })
      .catch(() => {
        setSedes([])
      })
      .finally(() => {
        setLoadingSedes(false)
      })
  }, [user?.id])

  if (loading) return <div className="perfil-loading">Cargando perfil...</div>
  if (!user) return <div className="perfil-error">No se pudo cargar el perfil.</div>

  return (
    <div className="perfil-container">
      <Card className="perfil-card">
        <div className="perfil-header">
          <div className="perfil-image-wrapper">
            <div
              className="perfil-image default-image"
              style={avatarPreview ? { backgroundImage: `url(${avatarPreview})` } : undefined}
            >
              {!avatarPreview && <div className="default-image-capital">{firstCapital}</div>}
            </div>
            <label className="perfil-file-label" aria-label="Subir imagen de perfil">
              <input
                type="file"
                accept="image/x-png,image/gif,image/jpeg"
                className="perfil-file-input"
                onChange={handleAvatarChange}
              />
              Subir imagen
            </label>
          </div>
          <div className="perfil-header-info">
            <h2 className="perfil-nombre">{fullName.toUpperCase()}</h2>
            <div className="perfil-document">DNI: {renderValue(user.dni)}</div>
            <div className="perfil-rol">{renderValue(user.cat_person?.description || user.cat_person?.name)}</div>
          </div>
        </div>

        <div className="perfil-grid">
          <section className="perfil-section-card">
            <h3 className="perfil-subtitle">Información personal</h3>
            <div className="perfil-form-row">
              <div className="perfil-item">
                <span className="perfil-label">Fecha de nacimiento</span>
                <div className="perfil-input-disabled">{formatDate(user.birthdate || user.fecha_nacimiento)}</div>
              </div>
              <div className="perfil-item">
                <span className="perfil-label">Profesión</span>
                <div className="perfil-input-disabled">
                  {renderValue(user.occupation || user.profesion || user.profession)}
                </div>
              </div>
            </div>

            <div className="perfil-form-row">
              <div className="perfil-item">
                <span className="perfil-label">Email</span>
                <div className="perfil-input-disabled">{renderValue(user.email)}</div>
              </div>
              <div className="perfil-item">
                <span className="perfil-label">Teléfono</span>
                <div className="perfil-input-disabled">{renderValue(user.phone_number || user.telefono)}</div>
              </div>
            </div>

            <h3 className="perfil-subtitle">Ubicación</h3>
            <div className="perfil-form-row">
              <div className="perfil-item">
                <span className="perfil-label">Departamento</span>
                <div className="perfil-input-disabled">{renderValue(user.department || user.departamento)}</div>
              </div>
              <div className="perfil-item">
                <span className="perfil-label">Provincia</span>
                <div className="perfil-input-disabled">{renderValue(user.province || user.provincia)}</div>
              </div>
            </div>
            <div className="perfil-form-row">
              <div className="perfil-item">
                <span className="perfil-label">Distrito</span>
                <div className="perfil-input-disabled">{renderValue(user.district || user.distrito)}</div>
              </div>
              <div className="perfil-item">
                <span className="perfil-label">Domicilio</span>
                <div className="perfil-input-disabled">{renderValue(user.address || user.domicilio)}</div>
              </div>
            </div>
          </section>
        </div>

        <section className="perfil-section-card perfil-client-section">
          <h3 className="perfil-subtitle">Información de cliente</h3>
          <div className="perfil-form-row">
            <div className="perfil-item">
              <span className="perfil-label">Nombre</span>
              <div className="perfil-input-disabled">{clientData.nombre}</div>
            </div>
            <div className="perfil-item">
              <span className="perfil-label">Abreviatura</span>
              <div className="perfil-input-disabled">{clientData.abreviatura}</div>
            </div>
          </div>
          <div className="perfil-form-row">
            <div className="perfil-item">
              <span className="perfil-label">RUC</span>
              <div className="perfil-input-disabled">{clientData.ruc}</div>
            </div>
            <div className="perfil-item">
              <span className="perfil-label">Categoría</span>
              <div className="perfil-input-disabled">{clientData.categoria}</div>
            </div>
          </div>
        </section>

        <section className="perfil-section-card perfil-sedes-section">
          <h3 className="perfil-subtitle">Sedes asignadas</h3>
          <div className="perfil-table-wrap">
            <table className="p-datatable table perfil-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Sede</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha asignación</th>
                </tr>
              </thead>
              <tbody>{renderSedesRows()}</tbody>
            </table>
          </div>
        </section>

        <div className="perfil-avatar-preview-helper" aria-hidden="true">
          <Avatar label={firstCapital} size="xlarge" shape="circle" className="perfil-avatar-fallback" />
        </div>
      </Card>
    </div>
  )
}

export default Perfil
