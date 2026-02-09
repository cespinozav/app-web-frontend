
import React, { useEffect, useState } from 'react';
import PerfilService from 'services/Perfil';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import './style.scss';

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PerfilService.getPerfil().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="perfil-loading">Cargando perfil...</div>;
  if (!user) return <div className="perfil-error">No se pudo cargar el perfil.</div>;

  return (
    <div className="perfil-container">
      <Card className="perfil-card">
        <div className="perfil-header">
          <Avatar label={user.names?.[0] || ''} size="xlarge" shape="circle" className="perfil-avatar" />
          <div>
            <h2 className="perfil-nombre">{user.names} {user.lastname_p} {user.lastname_m}</h2>
            <div className="perfil-rol">{user.cat_person?.name}</div>
          </div>
        </div>
        <div className="perfil-info">
          <div><strong>DNI:</strong> {user.dni}</div>
          <div><strong>Email:</strong> {user.email}</div>
        </div>
        <div className="perfil-extra">
          <div><strong>Usuario creado por:</strong> {user.user_created?.username || '-'} ({user.user_created?.email || '-'})</div>
        </div>
      </Card>
    </div>
  );
};

export default Perfil;
