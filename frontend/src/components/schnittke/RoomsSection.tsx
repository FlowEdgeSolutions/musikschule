"use client";

import Image from "next/image";
import { ArrowRight } from "./icons";
import { Section, StaggerContainer, StaggerItem } from "./motion-wrappers";
import { fonts, tokens } from "./theme";

const rooms = [
  {
    title: "Konzertsaal",
    desc: "Moderner Konzertsaal mit klarer Akustik für Konzerte, Vorträge und festliche Abende.",
    image: "/Images/WebsiteBilder/ASAI_Saal_5-980x408.jpg",
    alt: "Konzertsaal der Alfred Schnittke Akademie",
  },
  {
    title: "Kammermusikraum",
    desc: "Intimer Raum für Ensembles, Seminare, Unterricht und konzentrierte Probenarbeit.",
    image: "/Images/WebsiteBilder/Ausbildung.jpg",
    alt: "Unterrichtssituation in der Alfred Schnittke Akademie",
  },
  {
    title: "Historische Villa",
    desc: "Die Stadtvilla als Rahmen für Empfänge, Lesungen, Kulturabende und private Anlässe.",
    image: "/Images/WebsiteBilder/Vermietung.jpg",
    alt: "Räume der historischen Stadtvilla",
  },
];

export const RoomsSection = () => (
  <section
    id="raeume"
    style={{
      background: tokens.color.deep,
      padding: "100px 8%",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "55%",
        height: "100%",
        opacity: 0.05,
        background: `radial-gradient(circle at 25% 30%, rgba(208,0,0,0.35), transparent 70%)`,
        pointerEvents: "none",
      }}
    />
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
            color: tokens.color.warmWhite,
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
      {rooms.map((room) => (
        <StaggerItem key={room.title}>
          <div
            className="room-card"
            style={{
              background: `linear-gradient(180deg, ${tokens.color.warmWhite} 0%, ${tokens.color.parchment} 100%)`,
              border: `1px solid rgba(208,0,0,0.18)`,
              height: "100%",
              overflow: "hidden",
              boxShadow: "0 26px 80px rgba(0,0,0,0.28)",
            }}
          >
            <div style={{ position: "relative", aspectRatio: "16 / 10", background: tokens.color.slate }}>
              <Image
                src={room.image}
                alt={room.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: 32 }}>
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
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  </section>
);
