import { NextResponse } from "next/server";
import { createTicketRequest, findBookableEvent } from "@/lib/cms/store";
import type { TicketRequest } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<TicketRequest>;
  const event = await findBookableEvent(String(body.eventId ?? ""));

  if (!event) {
    return NextResponse.json({ error: "Diese Veranstaltung ist nicht reservierbar." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const quantity = Number(body.quantity ?? 1);

  if (!name || !email || !Number.isFinite(quantity) || quantity < 1 || quantity > 20) {
    return NextResponse.json({ error: "Bitte Name, E-Mail und Anzahl prüfen." }, { status: 400 });
  }

  await createTicketRequest({
    eventId: event.id,
    eventTitle: event.title,
    name,
    email,
    phone: String(body.phone ?? "").trim(),
    quantity,
    note: String(body.note ?? "").trim(),
  });

  return NextResponse.json({ ok: true });
}
