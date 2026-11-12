"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function Login() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <main className="wrap admin narrow">
      <h1>Entrar</h1>
      <form action={action} className="form">
        <label className="field">
          <span>Contraseña</span>
          <input type="password" name="password" autoFocus />
        </label>
        {state?.error && <p className="error">{state.error}</p>}
        <button className="btn primary" disabled={pending}>
          Entrar
        </button>
      </form>
    </main>
  );
}
