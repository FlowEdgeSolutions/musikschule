"use client";

import { motion } from "motion/react";
import { tokens } from "./theme";

export const FloatingNotes = () => {
  const notes = ["♪", "♫", "♩", "♬", "𝄞"];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {notes.map((n, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "100%", x: `${15 + i * 18}%` }}
          animate={{
            opacity: [0, 0.15, 0.1, 0],
            y: ["100%", "-10%"],
            rotate: [0, 20, -15, 10],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            delay: i * 2.5,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            fontSize: `${28 + i * 8}px`,
            color: tokens.color.gold,
            fontFamily: "serif",
          }}
        >
          {n}
        </motion.span>
      ))}
    </div>
  );
};

