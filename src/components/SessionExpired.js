import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'routing/routes';

const SessionExpired = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.removeItem('EXPIRED');
      navigate(ROUTES.LOGIN, { replace: true });
    }, 1500);
    return () => clearTimeout(timeout);
  }, [navigate]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
      <span>Sesión expirada. Por favor, vuelve a iniciar sesión.</span>
    </div>
  );
};

export default SessionExpired;
