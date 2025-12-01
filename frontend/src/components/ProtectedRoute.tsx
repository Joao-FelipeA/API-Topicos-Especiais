import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

/**
 * ProtectedRoute: permite acesso apenas quando existir token no localStorage
 * Se não estiver autenticado, redireciona para /login
 */
export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    // redireciona para login e guarda a localização atual para redirecionar após login (opcional)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
