"use client";

import { ArrowRight } from "./icons";
import { Section, StaggerContainer, StaggerItem } from "./motion-wrappers";
import { fonts, tokens } from "./theme";

export const RoomsSection = () => (
  <section id="raeume" style={{ background: tokens.color.warmWhite, padding: "100px 8%" }}>
    <Section>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div className="gold-line" style={{ margin: "0 auto 24px" }} />
        <p style={{ fontFamily: fonts.body, fontSize: 12, letterSpacing: 3.5, textTransform: "uppercase", color: tokens.color.mist, marginBottom: 12 }}>
          Vermietung
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
          Ihre Veranstaltung in
          <br />
          <span style={{ fontStyle: "italic", color: tokens.color.gold }}>unserer Stadtvilla</span>
        </h2>
      </div>
    </Section>

    <StaggerContainer
      stagger={0.12}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
      }}
    >
      {[
        { title: "Konzertsaal", desc: "Moderner Konzertsaal mit hervorragender Akustik für bis zu 120 Gäste.", icon: "♪" },
        { title: "Kammermusikraum", desc: "Intimer Raum für kleinere Ensembles, Lesungen und Seminare bis 40 Personen.", icon: "♫" },
        { title: "Historische Villa", desc: "Die gesamte Stadtvilla aus dem 18. Jh. für Hochzeiten, Empfänge und besondere Anlässe.", icon: "🏛" },
      ].map((room) => (
        <StaggerItem key={room.title}>
          <div
            className="room-card"
            style={{
              background: tokens.color.warmWhite,
              border: `1px solid rgba(0,0,0,0.12)`,
              padding: 40,
              height: "100%",
            }}
          >
            <div style={{ fontFamily: fonts.display, fontSize: 36, color: tokens.color.gold, opacity: 0.4, marginBottom: 20 }}>
              {room.icon}
            </div>
            <h3 style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: 600, color: tokens.color.ink, marginBottom: 12 }}>
              {room.title}
            </h3>
            <p style={{ fontFamily: fonts.accent, fontSize: 16, lineHeight: 1.7, color: tokens.color.slate, fontWeight: 300, fontStyle: "italic" }}>
              {room.desc}
            </p>
            <div
              style={{
                marginTop: 24,
                fontFamily: fonts.body,
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: tokens.color.gold,
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              Anfragen <ArrowRight size={14} color={tokens.color.gold} />
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  </section>
);
