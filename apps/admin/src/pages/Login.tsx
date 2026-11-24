import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";

import { signInErrorMessage, useAuth } from "../lib/authContext.ts";

export default function Login() {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(signInErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login">
      <form className="card" onSubmit={onSubmit}>
        <h1>Un paso a la vez</h1>
        <p className="muted">Panel de administración</p>
        <div className="field">
          <label htmlFor="email">Correo</label>
          <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error ? <p className="error">{error}</p> : null}
        <button className="primary" type="submit" disabled={submitting} style={{ width: "100%" }}>
          {submitting ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
