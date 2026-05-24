import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getCmsData, saveCmsData } from "@/lib/cms/store";
import type { TicketRequest } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<TicketRequest>;
  const data = await getCmsData();
  const event = data.events.find(
    (item) => item.id === body.eventId && item.status === "published" && item.ticketEnabled,
  );

  if (!event) {
    return NextResponse.json({ error: "Diese Veranstaltung ist nicht reservierbar." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const quantity = Number(body.quantity ?? 1);

  if (!name || !email || !Number.isFinite(quantity) || quantity < 1 || quantity > 20) {
    return NextResponse.json({ error: "Bitte Name, E-Mail und Anzahl prüfen." }, { status: 400 });
  }

  const ticket: TicketRequest = {
    id: crypto.randomUUID(),
    eventId: event.id,
    eventTitle: event.title,
    name,
    email,
    phone: String(body.phone ?? "").trim(),
    quantity,
    note: String(body.note ?? "").trim(),
    status: "new",
    createdAt: new Date().toISOString(),
  };

  await saveCmsData({
    ...data,
    tickets: [ticket, ...data.tickets],
  });

  return NextResponse.json({ ok: true });
}
