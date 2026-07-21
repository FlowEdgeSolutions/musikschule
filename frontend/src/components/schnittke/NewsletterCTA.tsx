"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Envelope } from "./icons";
import { Section } from "./motion-wrappers";
import { fonts, tokens } from "./theme";

export const NewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Section
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
          left: "-10%",
          top: "-30%",
          width: "50%",
          height: "160%",
          opacity: 0.10,
          background: `radial-gradient(circle, rgba(208,0,0,0.28), transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-15%",
          bottom: "-35%",
          width: "55%",
          height: "180%",
          opacity: 0.06,
          background: `radial-gradient(circle at 60% 60%, rgba(0,0,0,0.22), transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <Envelope size={32} color={tokens.color.gold} />
        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(26px, 3vw, 40px)",
            fontWeight: 500,
            color: tokens.color.ink,
            lineHeight: 1.2,
            margin: "24px 0",
          }}
        >
          Bleiben Sie <span style={{ fontStyle: "italic", color: tokens.color.gold }}>informiert</span>
        </h2>
        <p
          style={{
            fontFamily: fonts.accent,
            fontSize: 17,
            color: "rgba(0,0,0,0.62)",
            fontStyle: "italic",
            marginBottom: 40,
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Erhalten Sie Einladungen zu Konzerten, Meisterkursen und besonderen Veranstaltungen direkt in Ihr Postfach.
        </p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: "flex", gap: 0, maxWidth: 460, margin: "0 auto" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ihre E-Mail-Adresse"
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  background: "rgba(255,255,255,0.85)",
                  border: `1px solid rgba(0,0,0,0.16)`,
                  borderRight: "none",
                  color: tokens.color.ink,
                  fontFamily: fonts.body,
                  fontSize: 14,
                }}
              />
              <button
                type="button"
                onClick={() => email && setSubmitted(true)}
                style={{
                  padding: "16px 28px",
                  background: tokens.color.gold,
                  border: "none",
                  color: tokens.color.warmWhite,
                  fontFamily: fonts.body,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Anmelden
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                padding: "20px 32px",
                border: `1px solid rgba(208,0,0,0.22)`,
                background: "rgba(208,0,0,0.08)",
              }}
            >
              <p style={{ fontFamily: fonts.accent, fontSize: 17, color: tokens.color.accent, fontStyle: "italic" }}>
                ✓ Bitte bestätigen Sie Ihre Anmeldung über den Link in der E-Mail.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ fontFamily: fonts.body, fontSize: 11, color: "rgba(0,0,0,0.45)", marginTop: 16 }}>
          Kein Spam. Jederzeit abmeldbar. Datenschutzkonform (DSGVO).
        </p>
      </div>
    </Section>
  );
};
