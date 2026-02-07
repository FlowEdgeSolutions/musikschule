import { AboutStrip } from "./AboutStrip";
import { EventsSection } from "./EventsSection";
import { Footer } from "./Footer";
import { GrainOverlay } from "./GrainOverlay";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { NewsletterCTA } from "./NewsletterCTA";
import { RoomsSection } from "./RoomsSection";
import { ScrollProgress } from "./ScrollProgress";
import { fonts, tokens } from "./theme";

export default function SchnittkeAkademie() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }

        ::selection {
          background: ${tokens.color.goldMuted};
          color: ${tokens.color.ink};
        }

        .nav-link {
          position: relative;
          text-decoration: none;
          color: inherit;
          font-family: ${fonts.body};
          font-weight: 400;
          font-size: 13px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: ${tokens.color.gold};
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-link:hover::after { width: 100%; }

        .desktop-nav { display: flex; gap: 36px; align-items: center; }
        .mobile-toggle { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-toggle { display: inline-flex; }
        }

        .mobile-menu-link {
          transition: background 0.2s ease;
        }
        .mobile-menu-link:hover {
          background: rgba(208,0,0,0.10);
        }

        .event-row {
          border-bottom: 1px solid rgba(0,0,0,0.10);
          transition: background 0.3s ease;
          cursor: pointer;
        }
        .event-row:hover {
          background: ${tokens.color.goldMuted};
        }
        .event-grid {
          display: grid;
          grid-template-columns: 140px 1fr auto;
          gap: 24px;
          align-items: center;
          position: relative;
        }
        .event-actions { text-align: right; }
        @media (max-width: 768px) {
          .event-grid { grid-template-columns: 1fr; gap: 12px; }
          .event-actions { text-align: left; }
          .event-actions .event-reserve { justify-content: flex-start; }
        }

        .gold-line {
          width: 60px;
          height: 1px;
          background: ${tokens.color.gold};
        }

        .shimmer {
          background: linear-gradient(110deg, transparent 33%, rgba(208,0,0,0.10) 50%, transparent 67%);
          background-size: 300% 100%;
          animation: shimmer 4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: ${tokens.color.gold} !important;
        }

        .room-card {
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
        }
        .room-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        }

        .footer-link {
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-link:hover {
          color: ${tokens.color.gold};
        }
      `}</style>

      <GrainOverlay />
      <ScrollProgress />

      <Header />
      <Hero />
      <AboutStrip />
      <EventsSection />
      <RoomsSection />
      <NewsletterCTA />
      <Footer />
    </>
  );
}
