"use server";

import { redirect } from "next/navigation";
import { clearAdminSession } from "@/lib/admin-auth";

export const logoutAction = async () => {
  await clearAdminSession();
  redirect("/admin/login");
};
