"use client";

import { useMemo, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import type { CmsData, CmsEvent, CmsPost, TicketRequest } from "@/lib/cms/types";

type Tab = "site" | "events" | "posts" | "tickets";

const makeId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const makeSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

const emptyEvent = (): CmsEvent => ({
  id: makeId("event"),
  title: "Neue Veranstaltung",
  category: "Konzert",
  date: "",
  time: "",
  location: "",
  description: "",
  seatsLabel: "Plätze verfügbar",
  color: "#D00000",
  status: "draft",
  ticketEnabled: true,
});

const emptyPost = (): CmsPost => ({
  id: makeId("post"),
  title: "Neuer Beitrag",
  slug: "neuer-beitrag",
  category: "Aktuelles",
  excerpt: "",
  body: "",
  imageUrl: "",
  imageAlt: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  status: "draft",
});

export function AdminDashboard({ initialData }: { initialData: CmsData }) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState<Tab>("events");
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const stats = useMemo(
    () => ({
      publishedEvents: data.events.filter((item) => item.status === "published").length,
      drafts: data.events.filter((item) => item.status === "draft").length + data.posts.filter((item) => item.status === "draft").length,
      openTickets: data.tickets.filter((item) => item.status === "new").length,
    }),
    [data],
  );

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Speichern fehlgeschlagen.");

      setData(await response.json());
      setMessage("Gespeichert.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (postId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId(postId);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Upload fehlgeschlagen.");

      setData((current) => ({
        ...current,
        posts: current.posts.map((post) =>
          post.id === postId ? { ...post, imageUrl: payload.url, imageAlt: post.imageAlt || post.title } : post,
        ),
      }));
      setMessage("Bild hochgeladen. Bitte danach speichern.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload fehlgeschlagen.");
    } finally {
      setUploadingId(null);
      event.target.value = "";
    }
  };

  return (
    <section className="admin-dashboard">
      <div className="admin-stats">
        <div>
          <span>{stats.publishedEvents}</span>
          Veröffentlichte Termine
        </div>
        <div>
          <span>{stats.drafts}</span>
          Entwürfe
        </div>
        <div>
          <span>{stats.openTickets}</span>
          Neue Anfragen
        </div>
      </div>

      <div className="admin-toolbar">
        <nav aria-label="Adminbereiche">
          {[
            ["events", "Veranstaltungen"],
            ["posts", "Beiträge"],
            ["tickets", "Tickets"],
            ["site", "Startseite"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={tab === key ? "is-active" : ""}
              type="button"
              onClick={() => setTab(key as Tab)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="admin-toolbar__actions">
          {message ? <p>{message}</p> : null}
          <button type="button" onClick={save} disabled={saving}>
            {saving ? "Speichert..." : "Änderungen speichern"}
          </button>
        </div>
      </div>

      {tab === "events" ? (
        <EventsEditor data={data} setData={setData} />
      ) : tab === "posts" ? (
        <PostsEditor data={data} setData={setData} uploadImage={uploadImage} uploadingId={uploadingId} />
      ) : tab === "tickets" ? (
        <TicketsEditor data={data} setData={setData} />
      ) : (
        <SiteEditor data={data} setData={setData} />
      )}
    </section>
  );
}

function SiteEditor({
  data,
  setData,
}: {
  data: CmsData;
  setData: Dispatch<SetStateAction<CmsData>>;
}) {
  const updateSite = (key: keyof CmsData["site"], value: string) =>
    setData((current) => ({
      ...current,
      site: { ...current.site, [key]: value },
    }));

  return (
    <div className="admin-panel">
      <h2>Startseiten-Texte</h2>
      <div className="admin-grid admin-grid--two">
        <Field label="Hero-Eyebrow" value={data.site.heroEyebrow} onChange={(value) => updateSite("heroEyebrow", value)} />
        <Field label="Titel Zeile 1" value={data.site.heroTitleLine1} onChange={(value) => updateSite("heroTitleLine1", value)} />
        <Field label="Titel Akzent" value={data.site.heroTitleAccent} onChange={(value) => updateSite("heroTitleAccent", value)} />
        <Field label="Titel Zeile 2" value={data.site.heroTitleLine2} onChange={(value) => updateSite("heroTitleLine2", value)} />
      </div>
      <Field textarea label="Hero-Text" value={data.site.heroSubtitle} onChange={(value) => updateSite("heroSubtitle", value)} />
      <div className="admin-grid admin-grid--two">
        <Field label="Über-Kicker" value={data.site.aboutKicker} onChange={(value) => updateSite("aboutKicker", value)} />
        <Field label="Über-Titel" value={data.site.aboutTitleLine1} onChange={(value) => updateSite("aboutTitleLine1", value)} />
      </div>
      <Field label="Über-Akzent" value={data.site.aboutTitleAccent} onChange={(value) => updateSite("aboutTitleAccent", value)} />
      <Field textarea label="Über-Text" value={data.site.aboutLead} onChange={(value) => updateSite("aboutLead", value)} />
    </div>
  );
}

function EventsEditor({
  data,
  setData,
}: {
  data: CmsData;
  setData: Dispatch<SetStateAction<CmsData>>;
}) {
  const updateEvent = (id: string, patch: Partial<CmsEvent>) =>
    setData((current) => ({
      ...current,
      events: current.events.map((event) => (event.id === id ? { ...event, ...patch } : event)),
    }));

  const removeEvent = (id: string) =>
    setData((current) => ({
      ...current,
      events: current.events.filter((event) => event.id !== id),
    }));

  return (
    <div className="admin-panel">
      <div className="admin-panel__heading">
        <h2>Veranstaltungen und Meisterkurse</h2>
        <button type="button" onClick={() => setData((current) => ({ ...current, events: [emptyEvent(), ...current.events] }))}>
          Neuer Termin
        </button>
      </div>

      <div className="admin-list">
        {data.events.map((event) => (
          <article className="admin-item" key={event.id}>
            <div className="admin-grid admin-grid--two">
              <Field label="Titel" value={event.title} onChange={(value) => updateEvent(event.id, { title: value })} />
              <Field label="Kategorie" value={event.category} onChange={(value) => updateEvent(event.id, { category: value })} />
              <Field label="Datum" value={event.date} onChange={(value) => updateEvent(event.id, { date: value })} />
              <Field label="Uhrzeit" value={event.time} onChange={(value) => updateEvent(event.id, { time: value })} />
              <Field label="Ort" value={event.location} onChange={(value) => updateEvent(event.id, { location: value })} />
              <Field label="Platzanzeige" value={event.seatsLabel} onChange={(value) => updateEvent(event.id, { seatsLabel: value })} />
            </div>
            <Field textarea label="Beschreibung" value={event.description} onChange={(value) => updateEvent(event.id, { description: value })} />
            <div className="admin-row">
              <label>
                Status
                <select value={event.status} onChange={(e) => updateEvent(event.id, { status: e.target.value as CmsEvent["status"] })}>
                  <option value="published">Veröffentlicht</option>
                  <option value="draft">Entwurf</option>
                </select>
              </label>
              <label>
                Akzentfarbe
                <input type="color" value={event.color} onChange={(e) => updateEvent(event.id, { color: e.target.value })} />
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={event.ticketEnabled}
                  onChange={(e) => updateEvent(event.id, { ticketEnabled: e.target.checked })}
                />
                Reservierung erlauben
              </label>
              <button className="admin-danger" type="button" onClick={() => removeEvent(event.id)}>
                Löschen
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PostsEditor({
  data,
  setData,
  uploadImage,
  uploadingId,
}: {
  data: CmsData;
  setData: Dispatch<SetStateAction<CmsData>>;
  uploadImage: (postId: string, event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploadingId: string | null;
}) {
  const updatePost = (id: string, patch: Partial<CmsPost>) =>
    setData((current) => ({
      ...current,
      posts: current.posts.map((post) => (post.id === id ? { ...post, ...patch } : post)),
    }));

  const removePost = (id: string) =>
    setData((current) => ({
      ...current,
      posts: current.posts.filter((post) => post.id !== id),
    }));

  return (
    <div className="admin-panel">
      <div className="admin-panel__heading">
        <h2>Beiträge und Meldungen</h2>
        <button type="button" onClick={() => setData((current) => ({ ...current, posts: [emptyPost(), ...current.posts] }))}>
          Neuer Beitrag
        </button>
      </div>

      <div className="admin-list">
        {data.posts.map((post) => (
          <article className="admin-item" key={post.id}>
            <div className="admin-grid admin-grid--two">
              <Field
                label="Titel"
                value={post.title}
                onChange={(value) => updatePost(post.id, { title: value, slug: post.slug || makeSlug(value) })}
              />
              <Field label="Slug" value={post.slug} onChange={(value) => updatePost(post.id, { slug: makeSlug(value) })} />
              <Field label="Kategorie" value={post.category} onChange={(value) => updatePost(post.id, { category: value })} />
              <Field label="Datum" value={post.publishedAt} onChange={(value) => updatePost(post.id, { publishedAt: value })} />
            </div>
            <Field textarea label="Kurztext" value={post.excerpt} onChange={(value) => updatePost(post.id, { excerpt: value })} />
            <Field textarea label="Text" value={post.body} onChange={(value) => updatePost(post.id, { body: value })} />
            <div className="admin-row">
              <label>
                Status
                <select value={post.status} onChange={(e) => updatePost(post.id, { status: e.target.value as CmsPost["status"] })}>
                  <option value="published">Veröffentlicht</option>
                  <option value="draft">Entwurf</option>
                </select>
              </label>
              <label>
                Bild hochladen
                <input type="file" accept="image/*" onChange={(event) => uploadImage(post.id, event)} />
              </label>
              <span>{uploadingId === post.id ? "Upload läuft..." : post.imageUrl || "Kein Bild"}</span>
              <button className="admin-danger" type="button" onClick={() => removePost(post.id)}>
                Löschen
              </button>
            </div>
            <Field label="Bild-Alt-Text" value={post.imageAlt} onChange={(value) => updatePost(post.id, { imageAlt: value })} />
          </article>
        ))}
      </div>
    </div>
  );
}

function TicketsEditor({
  data,
  setData,
}: {
  data: CmsData;
  setData: Dispatch<SetStateAction<CmsData>>;
}) {
  const updateTicket = (id: string, patch: Partial<TicketRequest>) =>
    setData((current) => ({
      ...current,
      tickets: current.tickets.map((ticket) => (ticket.id === id ? { ...ticket, ...patch } : ticket)),
    }));

  return (
    <div className="admin-panel">
      <h2>Ticket- und Reservierungsanfragen</h2>
      <div className="admin-table">
        {data.tickets.length === 0 ? (
          <p className="admin-empty">Noch keine Anfragen.</p>
        ) : (
          data.tickets.map((ticket) => (
            <article className="admin-ticket" key={ticket.id}>
              <div>
                <strong>{ticket.eventTitle}</strong>
                <span>{new Date(ticket.createdAt).toLocaleString("de-DE")}</span>
              </div>
              <div>
                <strong>{ticket.name}</strong>
                <a href={`mailto:${ticket.email}`}>{ticket.email}</a>
                {ticket.phone ? <a href={`tel:${ticket.phone}`}>{ticket.phone}</a> : null}
              </div>
              <div>
                <span>{ticket.quantity} Plätze</span>
                {ticket.note ? <small>{ticket.note}</small> : null}
              </div>
              <label>
                Status
                <select value={ticket.status} onChange={(e) => updateTicket(ticket.id, { status: e.target.value as TicketRequest["status"] })}>
                  <option value="new">Neu</option>
                  <option value="confirmed">Bestätigt</option>
                  <option value="cancelled">Abgesagt</option>
                  <option value="done">Erledigt</option>
                </select>
              </label>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label>
      {label}
      {textarea ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}
