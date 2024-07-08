import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AutenticacionUsuario';

export default function RutaProtegida({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}