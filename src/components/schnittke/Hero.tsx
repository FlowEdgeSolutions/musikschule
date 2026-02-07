"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "./icons";
import { MagneticButton } from "./motion-wrappers";
import { FloatingNotes } from "./FloatingNotes";
import { fonts, tokens } from "./theme";

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div ref={heroRef} style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <motion.div style={{ opacity: heroOpacity, scale: heroScale, position: "absolute", inset: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(26,22,18,0.75) 0%, transparent 70%),
              radial-gradient(ellipse at 80% 20%, rgba(139,37,0,0.15) 0%, transparent 50%),
              linear-gradient(180deg, #1A1612 0%, #2A2420 40%, #1A1612 100%)
            `,
          }}
        />

        <FloatingNotes />

        {/* Decorative staff lines */}
        <div style={{ position: "absolute", left: "5%", top: "30%", opacity: 0.04 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: 300, height: 1, background: tokens.color.gold, marginBottom: 12 }} />
          ))}
        </div>
        <div style={{ position: "absolute", right: "8%", bottom: "20%", opacity: 0.04 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: 200, height: 1, background: tokens.color.gold, marginBottom: 12 }} />
          ))}
        </div>
      </motion.div>

      <motion.div
        style={{
          y: heroY,
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 8%",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 1, background: tokens.color.gold, marginBottom: 32 }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: tokens.color.gold,
            marginBottom: 20,
            fontWeight: 400,
          }}
        >
          Private Musikakademie · Hamburg-Altona · Seit 1987
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: fonts.display,
            fontSize: "clamp(38px, 6vw, 82px)",
            fontWeight: 500,
            color: tokens.color.warmWhite,
            lineHeight: 1.08,
            maxWidth: 800,
            letterSpacing: -1,
          }}
        >
          Alfred Schnittke
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 400, color: tokens.color.goldLight }}>
            Akademie
          </span>{" "}
          International
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          style={{
            fontFamily: fonts.accent,
            fontSize: "clamp(18px, 2vw, 24px)",
            fontStyle: "italic",
            color: "rgba(245,240,232,0.6)",
            marginTop: 28,
            maxWidth: 520,
            lineHeight: 1.6,
            fontWeight: 300,
          }}
        >
          Wo zeitgenössische Musik auf Tradition trifft – Studium, Konzerte und Meisterkurse in einer hanseatischen Villa
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          style={{ display: "flex", gap: 16, marginTop: 48, flexWrap: "wrap" }}
        >
          <MagneticButton
            className="shimmer"
            onClick={() =>
              document.getElementById("veranstaltungen")?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              padding: "16px 36px",
              background: tokens.color.gold,
              color: tokens.color.deep,
              fontFamily: fonts.body,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Veranstaltungen <ArrowRight size={16} color={tokens.color.deep} />
          </MagneticButton>

          <MagneticButton
            onClick={() => document.getElementById("raeume")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              padding: "16px 36px",
              background: "transparent",
              color: tokens.color.goldLight,
              fontFamily: fonts.body,
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: 2,
              textTransform: "uppercase",
              border: `1px solid rgba(196,163,90,0.3)`,
              cursor: "pointer",
            }}
          >
            Räume mieten
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 10,
            letterSpacing: 3,
            color: "rgba(245,240,232,0.3)",
            textTransform: "uppercase",
          }}
        >
          Entdecken
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 40,
            background: `linear-gradient(to bottom, ${tokens.color.gold}, transparent)`,
          }}
        />
      </motion.div>
    </div>
  );
};

