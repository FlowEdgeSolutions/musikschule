"use client";

import { motion, useScroll } from "motion/react";
import { tokens } from "./theme";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: tokens.color.gold,
        transformOrigin: "0%",
        zIndex: 100,
      }}
    />
  );
};

