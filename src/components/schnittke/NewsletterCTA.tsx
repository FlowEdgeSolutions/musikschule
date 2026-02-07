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
        background: `linear-gradient(135deg, ${tokens.color.deep}, #2A2218)`,
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
          opacity: 0.04,
          background: `radial-gradient(circle, ${tokens.color.gold}, transparent 70%)`,
        }}
      />

      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <Envelope size={32} color={tokens.color.gold} />
        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(26px, 3vw, 40px)",
            fontWeight: 500,
            color: tokens.color.warmWhite,
            lineHeight: 1.2,
            margin: "24px 0",
          }}
        >
          Bleiben Sie <span style={{ fontStyle: "italic", color: tokens.color.goldLight }}>informiert</span>
        </h2>
        <p
          style={{
            fontFamily: fonts.accent,
            fontSize: 17,
            color: "rgba(245,240,232,0.5)",
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
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid rgba(196,163,90,0.2)`,
                  borderRight: "none",
                  color: tokens.color.warmWhite,
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
                  color: tokens.color.deep,
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
                border: `1px solid rgba(196,163,90,0.3)`,
                background: "rgba(196,163,90,0.08)",
              }}
            >
              <p style={{ fontFamily: fonts.accent, fontSize: 17, color: tokens.color.goldLight, fontStyle: "italic" }}>
                ✓ Bitte bestätigen Sie Ihre Anmeldung über den Link in der E-Mail.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ fontFamily: fonts.body, fontSize: 11, color: "rgba(245,240,232,0.25)", marginTop: 16 }}>
          Kein Spam. Jederzeit abmeldbar. Datenschutzkonform (DSGVO).
        </p>
      </div>
    </Section>
  );
};

