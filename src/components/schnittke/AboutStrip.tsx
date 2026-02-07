"use client";

import { Section } from "./motion-wrappers";
import { fonts, tokens } from "./theme";

export const AboutStrip = () => (
  <Section
    style={{
      background: tokens.color.warmWhite,
      padding: "100px 8%",
      display: "flex",
      flexWrap: "wrap",
      gap: 60,
      alignItems: "center",
    }}
  >
    <div style={{ flex: "1 1 400px" }} id="akademie">
      <div className="gold-line" style={{ marginBottom: 24 }} />
      <p
        style={{
          fontFamily: fonts.body,
          fontSize: 12,
          letterSpacing: 3.5,
          textTransform: "uppercase",
          color: tokens.color.mist,
          marginBottom: 16,
          fontWeight: 500,
        }}
      >
        Über die Akademie
      </p>
      <h2
        style={{
          fontFamily: fonts.display,
          fontSize: "clamp(28px, 3.5vw, 46px)",
          fontWeight: 500,
          color: tokens.color.ink,
          lineHeight: 1.15,
          marginBottom: 24,
        }}
      >
        Musik studieren
        <br />
        <span style={{ fontStyle: "italic", color: tokens.color.gold }}>
          unter einem neuen Akzent
        </span>
      </h2>
      <p
        style={{
          fontFamily: fonts.accent,
          fontSize: 19,
          lineHeight: 1.75,
          color: tokens.color.slate,
          maxWidth: 520,
          fontWeight: 300,
          fontStyle: "italic",
        }}
      >
        Die Alfred Schnittke Akademie International ist eine von der
        Kulturbehörde anerkannte private Musikakademie in Hamburg-Altona. Seit
        1987 bilden wir junge Musiker in Gesang und Instrumentalspiel aus – mit
        dem Schwerpunkt auf zeitgenössischer Musik und einem individuellen
        Studienplan für jeden Studierenden.
      </p>
    </div>

    <div
      style={{
        flex: "1 1 320px",
        minHeight: 380,
        background: `linear-gradient(135deg, ${tokens.color.parchment}, #EDE5D8)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(196,163,90,0.04) 35px, rgba(196,163,90,0.04) 36px)`,
        }}
      />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 72,
            color: tokens.color.gold,
            opacity: 0.25,
          }}
        >
          𝄞
        </div>
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: 12,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: tokens.color.mist,
            marginTop: 16,
          }}
        >
          Bild der Stadtvilla
        </p>
      </div>
    </div>
  </Section>
);

