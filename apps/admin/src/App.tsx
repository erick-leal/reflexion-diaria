import { useQuery } from "@tanstack/react-query";
import { Navigate, NavLink, Outlet, Route, Routes } from "react-router-dom";

import { api, ApiError } from "./lib/api.ts";
import { useAuth } from "./lib/authContext.ts";
import Dashboard from "./pages/Dashboard.tsx";
import Login from "./pages/Login.tsx";
import Reflections from "./pages/Reflections.tsx";
import Schedule from "./pages/Schedule.tsx";

/**
 * Rutas protegidas: exige sesion de Firebase Y que el backend acepte la cuenta
 * (/admin/me). Una sesion valida de OTRA cuenta del proyecto recibe 403 y ve
 * un mensaje, no el panel vacio.
 */
function ProtectedLayout() {
  const { user, loading, signOut } = useAuth();
  const me = useQuery({ queryKey: ["me", user?.uid], queryFn: api.me, enabled: Boolean(user), retry: false });

  if (loading) return <p className="login muted">Cargando…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (me.isPending) return <p className="login muted">Verificando acceso…</p>;
  if (me.isError) {
    const status = me.error instanceof ApiError ? me.error.status : 0;
    return (
      <div className="login">
        <div className="card">
          <h2>{status === 403 ? "Esta cuenta no tiene acceso" : "No se pudo verificar el acceso"}</h2>
          <p className="muted">{me.error.message}</p>
          <button onClick={() => signOut()}>Cerrar sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="brand">Un paso a la vez</div>
        <NavLink to="/" end>
          Resumen
        </NavLink>
        <NavLink to="/reflexiones">Reflexiones</NavLink>
        <NavLink to="/calendario">Calendario</NavLink>
        <div className="spacer" />
        <div className="who">{me.data.email}</div>
        <button onClick={() => signOut()}>Cerrar sesión</button>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/reflexiones" element={<Reflections />} />
        <Route path="/calendario" element={<Schedule />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
