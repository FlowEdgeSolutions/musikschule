"use client";

import { motion } from "motion/react";
import { events } from "./data";
import { ArrowRight } from "./icons";
import { MagneticButton, Section, StaggerContainer, StaggerItem } from "./motion-wrappers";
import { fonts, tokens } from "./theme";

export const EventsSection = () => (
  <section id="veranstaltungen" style={{ background: tokens.color.deep, padding: "100px 8%", position: "relative" }}>
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "40%",
        height: "100%",
        opacity: 0.03,
        background: `radial-gradient(circle at 70% 30%, ${tokens.color.gold}, transparent 70%)`,
      }}
    />

    <Section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 60,
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <div className="gold-line" style={{ marginBottom: 24 }} />
          <p style={{ fontFamily: fonts.body, fontSize: 12, letterSpacing: 3.5, textTransform: "uppercase", color: tokens.color.mist, marginBottom: 12 }}>
            Kalender
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
            Kommende <span style={{ fontStyle: "italic", color: tokens.color.gold }}>Veranstaltungen</span>
          </h2>
        </div>

        <MagneticButton
          onClick={() => {
            // placeholder action
          }}
          style={{
            padding: "12px 28px",
            background: "transparent",
            border: `1px solid rgba(196,163,90,0.25)`,
            color: tokens.color.goldLight,
            fontFamily: fonts.body,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Alle ansehen <ArrowRight size={14} color={tokens.color.goldLight} />
        </MagneticButton>
      </div>
    </Section>

    <StaggerContainer stagger={0.1}>
      {events.map((ev) => (
        <StaggerItem key={ev.id}>
          <motion.div
            className="event-row"
            whileHover={{ x: 8 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "28px 0" }}
          >
            <div className="event-grid">
              <div>
                <div style={{ fontFamily: fonts.body, fontSize: 14, fontWeight: 500, color: tokens.color.goldLight }}>
                  {ev.date}
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 12, color: tokens.color.mist, marginTop: 4 }}>
                  {ev.time}
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 10,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: ev.color,
                      padding: "3px 10px",
                      border: `1px solid ${ev.color}40`,
                      fontWeight: 500,
                    }}
                  >
                    {ev.category}
                  </span>
                </div>
                <div style={{ fontFamily: fonts.display, fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 500, color: tokens.color.warmWhite }}>
                  {ev.title}
                </div>
              </div>

              <div className="event-actions">
                <div style={{ fontFamily: fonts.body, fontSize: 12, color: tokens.color.mist }}>{ev.seats}</div>
                <div
                  className="event-reserve"
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: tokens.color.gold,
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "flex-end",
                  }}
                >
                  Reservieren <ArrowRight size={12} color={tokens.color.gold} />
                </div>
              </div>
            </div>
          </motion.div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  </section>
);

