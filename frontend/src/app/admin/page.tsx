import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getCmsData } from "@/lib/cms/store";
import { logoutAction } from "./actions";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Alfred Schnittke Akademie",
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const data = await getCmsData();

  return (
    <main className="admin-shell">
      <header className="admin-shell__header">
        <div>
          <p className="admin-shell__eyebrow">Schnittke Akademie</p>
          <h1>Admin-Bereich</h1>
        </div>
        <form action={logoutAction}>
          <button className="admin-shell__logout" type="submit">
            Ausloggen
          </button>
        </form>
      </header>
      <AdminDashboard initialData={data} />
    </main>
  );
}
