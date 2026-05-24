import type { Metadata } from "next";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin Login | Alfred Schnittke Akademie",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main className="admin-login">
      <form action={loginAction} className="admin-login__panel">
        <div>
          <p className="admin-login__eyebrow">Admin</p>
          <h1>Inhalte verwalten</h1>
          <p className="admin-login__copy">
            Geschützter Bereich für Veranstaltungen, Beiträge, Bilder und
            Ticketanfragen.
          </p>
        </div>

        <label>
          Passwort
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
          />
        </label>

        {hasError ? (
          <p className="admin-login__error">Das Passwort ist nicht korrekt.</p>
        ) : null}

        <button type="submit">Einloggen</button>
      </form>
    </main>
  );
}
