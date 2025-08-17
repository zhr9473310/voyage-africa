import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RequireVerified({ children }:{children:React.ReactElement}) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="p-6 text-muted">加载中…</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (!user.email_verified) return <Navigate to="/verify" state={{ from: loc, reason: 'need-verify' }} replace />;
  return children;
}
