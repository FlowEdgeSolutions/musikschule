export type PublishStatus = "draft" | "published";

export type TicketStatus = "new" | "confirmed" | "cancelled" | "done";

export type SiteContent = {
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleAccent: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  aboutKicker: string;
  aboutTitleLine1: string;
  aboutTitleAccent: string;
  aboutLead: string;
};

export type CmsEvent = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  seatsLabel: string;
  color: string;
  status: PublishStatus;
  ticketEnabled: boolean;
};

export type CmsPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
  status: PublishStatus;
};

export type TicketRequest = {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  note: string;
  status: TicketStatus;
  createdAt: string;
};

export type CmsData = {
  site: SiteContent;
  events: CmsEvent[];
  posts: CmsPost[];
  tickets: TicketRequest[];
  updatedAt: string;
};
