import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect default dashboard route to products
    navigate('/admin/products', { replace: true });
  }, [navigate]);

  return null;
};
