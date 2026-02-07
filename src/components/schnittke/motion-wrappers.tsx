"use client";

import type { PropsWithChildren } from "react";
import { useRef, useState } from "react";
import type { HTMLMotionProps } from "motion/react";
import { motion, useInView } from "motion/react";

type SectionProps = PropsWithChildren<{ delay?: number } & HTMLMotionProps<"section">>;

export const Section = ({
  children,
  delay = 0,
  ...rest
}: SectionProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.section>
  );
};

type StaggerContainerProps = PropsWithChildren<
  { stagger?: number } & HTMLMotionProps<"div">
>;

export const StaggerContainer = ({
  children,
  stagger = 0.08,
  ...rest
}: StaggerContainerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

type StaggerItemProps = PropsWithChildren<{ className?: string }>;

export const StaggerItem = ({ children, className = "" }: StaggerItemProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

type MagneticButtonProps = PropsWithChildren<
  HTMLMotionProps<"button">
>;

export const MagneticButton = ({
  children,
  className = "",
  onMouseMove,
  onMouseLeave,
  type,
  ...rest
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type={type ?? "button"}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
          setPos({ x, y });
        }
        onMouseMove?.(e);
      }}
      onMouseLeave={(e) => {
        setPos({ x: 0, y: 0 });
        onMouseLeave?.(e);
      }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
};
