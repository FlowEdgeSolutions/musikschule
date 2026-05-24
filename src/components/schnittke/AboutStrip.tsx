"use client";

import type { SiteContent } from "@/lib/cms/types";
import { Section } from "./motion-wrappers";
import { fonts, tokens } from "./theme";

export const AboutStrip = ({ site }: { site: SiteContent }) => (
  <Section
    style={{
      background: tokens.color.deep,
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
        {site.aboutKicker}
      </p>
      <h2
        style={{
          fontFamily: fonts.display,
          fontSize: "clamp(28px, 3.5vw, 46px)",
          fontWeight: 500,
          color: tokens.color.warmWhite,
          lineHeight: 1.15,
          marginBottom: 24,
        }}
      >
        {site.aboutTitleLine1}
        <br />
        <span style={{ fontStyle: "italic", color: tokens.color.gold }}>
          {site.aboutTitleAccent}
        </span>
      </h2>
      <p
        style={{
          fontFamily: fonts.accent,
          fontSize: 19,
          lineHeight: 1.75,
          color: "rgba(255,255,255,0.75)",
          maxWidth: 520,
          fontWeight: 300,
          fontStyle: "italic",
        }}
      >
        {site.aboutLead}
      </p>
    </div>

    <div
      style={{
        flex: "1 1 320px",
        minHeight: 380,
        background: `linear-gradient(135deg, ${tokens.color.warmWhite}, ${tokens.color.parchment})`,
        border: "1px solid rgba(208,0,0,0.22)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
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
          background: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(208,0,0,0.05) 35px, rgba(208,0,0,0.05) 36px)`,
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
            color: "rgba(0,0,0,0.55)",
            marginTop: 16,
          }}
        >
          Bild der Stadtvilla
        </p>
      </div>
    </div>
  </Section>
);
