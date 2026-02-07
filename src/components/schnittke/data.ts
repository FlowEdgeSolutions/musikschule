import { tokens } from "./theme";

export const events = [
  {
    id: 1,
    date: "15. März 2026",
    time: "19:30 Uhr",
    title: "Schnittke: Streichquartett Nr. 3",
    category: "Konzert",
    seats: "42 Plätze frei",
    color: tokens.color.accent,
  },
  {
    id: 2,
    date: "22. März 2026",
    time: "10:00 Uhr",
    title: "Meisterkurs Violine mit Prof. Kopatchinskaja",
    category: "Meisterkurs",
    seats: "8 Plätze frei",
    color: tokens.color.gold,
  },
  {
    id: 3,
    date: "05. April 2026",
    time: "19:00 Uhr",
    title: "Viktor Shenderovich – Lesung",
    category: "Lesung",
    seats: "35 Plätze frei",
    color: tokens.color.ink,
  },
  {
    id: 4,
    date: "18. April 2026",
    time: "18:00 Uhr",
    title: "Polystilistik – Workshop für junge Komponisten",
    category: "Workshop",
    seats: "12 Plätze frei",
    color: tokens.color.slate,
  },
] as const;

export const navLinks = [
  { label: "Akademie", href: "#akademie" },
  { label: "Veranstaltungen", href: "#veranstaltungen" },
  { label: "Räume", href: "#raeume" },
  { label: "Kontakt", href: "#kontakt" },
] as const;
