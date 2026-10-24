"use client";

import { useState } from "react";

export function AdminLogin({ onOk }: { onOk: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Špatné heslo");
        return;
      }
      onOk();
    } catch {
      setError("Špatné heslo");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-login" onSubmit={submit}>
      <h1 className="sprava__title">Přihlášení</h1>
      <p className="muted">Zadejte heslo pro správu termínů.</p>
      <label className="booking-field">
        <span>Heslo</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <p className="booking-error">{error}</p>}
      <button type="submit" className="btn btn--primary" disabled={busy}>
        {busy ? "Kontroluji…" : "Vstoupit"}
      </button>
    </form>
  );
}
