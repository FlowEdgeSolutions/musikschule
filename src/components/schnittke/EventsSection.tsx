"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { CmsEvent } from "@/lib/cms/types";
import { ArrowRight } from "./icons";
import { MagneticButton, Section, StaggerContainer, StaggerItem } from "./motion-wrappers";
import { fonts, tokens } from "./theme";

type TicketForm = {
  name: string;
  email: string;
  phone: string;
  quantity: string;
  note: string;
};

const emptyTicketForm: TicketForm = {
  name: "",
  email: "",
  phone: "",
  quantity: "1",
  note: "",
};

export const EventsSection = ({ events }: { events: CmsEvent[] }) => {
  const [selectedEvent, setSelectedEvent] = useState<CmsEvent | null>(null);
  const [form, setForm] = useState(emptyTicketForm);
  const [status, setStatus] = useState("");
  const publishedEvents = useMemo(
    () => events.filter((event) => event.status === "published"),
    [events],
  );

  const submitTicket = async () => {
    if (!selectedEvent) return;
    setStatus("Sendet...");

    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...form,
        eventId: selectedEvent.id,
        quantity: Number(form.quantity),
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.error ?? "Die Anfrage konnte nicht gesendet werden.");
      return;
    }

    setStatus("Anfrage gesendet. Wir melden uns per E-Mail.");
    setForm(emptyTicketForm);
  };

  return (
    <section
      id="veranstaltungen"
      style={{
        background: `linear-gradient(180deg, ${tokens.color.warmWhite} 0%, ${tokens.color.parchment} 55%, ${tokens.color.warmWhite} 100%)`,
        padding: "100px 8%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "40%",
          height: "100%",
          opacity: 0.08,
          background: `radial-gradient(circle at 70% 30%, rgba(208,0,0,0.28), transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-10%",
          bottom: "-35%",
          width: "55%",
          height: "180%",
          opacity: 0.05,
          background: `radial-gradient(circle at 30% 70%, rgba(0,0,0,0.22), transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 60,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <div className="gold-line" style={{ marginBottom: 24 }} />
            <p
              style={{
                fontFamily: fonts.body,
                fontSize: 12,
                letterSpacing: 3.5,
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.55)",
                marginBottom: 12,
              }}
            >
              Kalender
            </p>
            <h2
              style={{
                fontFamily: fonts.display,
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 500,
                color: tokens.color.ink,
                lineHeight: 1.15,
              }}
            >
              Kommende <span style={{ fontStyle: "italic", color: tokens.color.gold }}>Veranstaltungen</span>
            </h2>
          </div>

          <MagneticButton
            onClick={() => {
              document.getElementById("aktuelles")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              padding: "12px 28px",
              background: "transparent",
              border: `1px solid rgba(0,0,0,0.16)`,
              color: tokens.color.ink,
              fontFamily: fonts.body,
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Aktuelles <ArrowRight size={14} color={tokens.color.gold} />
          </MagneticButton>
        </div>
      </Section>

      <StaggerContainer stagger={0.1}>
        {publishedEvents.map((event) => (
          <StaggerItem key={event.id}>
            <motion.div
              className="event-row"
              whileHover={{ x: 8 }}
              transition={{ duration: 0.3 }}
              style={{ padding: "28px 0" }}
            >
              <div className="event-grid">
                <div>
                  <div
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 14,
                      fontWeight: 500,
                      color: tokens.color.ink,
                    }}
                  >
                    {event.date}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 12,
                      color: "rgba(0,0,0,0.55)",
                      marginTop: 4,
                    }}
                  >
                    {event.time}
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <span
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 10,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: event.color,
                        padding: "3px 10px",
                        border: `1px solid ${event.color}40`,
                        fontWeight: 500,
                      }}
                    >
                      {event.category}
                    </span>
                    {event.location ? (
                      <span style={{ fontFamily: fonts.body, fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                        {event.location}
                      </span>
                    ) : null}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.display,
                      fontSize: "clamp(18px, 2vw, 24px)",
                      fontWeight: 500,
                      color: tokens.color.ink,
                    }}
                  >
                    {event.title}
                  </div>
                  {event.description ? (
                    <p
                      style={{
                        fontFamily: fonts.accent,
                        fontSize: 15,
                        color: "rgba(0,0,0,0.58)",
                        fontStyle: "italic",
                        lineHeight: 1.6,
                        marginTop: 8,
                      }}
                    >
                      {event.description}
                    </p>
                  ) : null}
                </div>

                <div className="event-actions">
                  <div style={{ fontFamily: fonts.body, fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                    {event.seatsLabel}
                  </div>
                  {event.ticketEnabled ? (
                    <button
                      type="button"
                      className="event-reserve"
                      onClick={() => {
                        setSelectedEvent(event);
                        setStatus("");
                      }}
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 11,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: tokens.color.gold,
                        marginTop: 8,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        justifyContent: "flex-end",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Reservieren <ArrowRight size={12} color={tokens.color.gold} />
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {selectedEvent ? (
        <div className="ticket-modal" role="dialog" aria-modal="true" aria-label="Reservierungsanfrage">
          <div className="ticket-modal__panel">
            <div>
              <p>Reservierung</p>
              <h3>{selectedEvent.title}</h3>
            </div>
            <div className="ticket-modal__grid">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
              <input
                placeholder="E-Mail"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              />
              <input
                placeholder="Telefon"
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              />
              <input
                placeholder="Anzahl"
                type="number"
                min={1}
                max={20}
                value={form.quantity}
                onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
              />
            </div>
            <textarea
              placeholder="Nachricht"
              rows={4}
              value={form.note}
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
            />
            {status ? <p className="ticket-modal__status">{status}</p> : null}
            <div className="ticket-modal__actions">
              <button type="button" onClick={() => setSelectedEvent(null)}>
                Schließen
              </button>
              <button type="button" onClick={submitTicket}>
                Anfrage senden
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};
