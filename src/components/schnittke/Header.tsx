"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { navLinks } from "./data";
import { List, MapPin, Phone, X } from "./icons";
import { fonts, tokens } from "./theme";

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: scrolled ? "14px 40px" : "24px 40px",
          background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "none",
          transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href="/"
          aria-label="Alfred Schnittke Akademie International"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            textDecoration: "none",
          }}
        >
          <Image
            src="/Images/Logo/ASAI_Logo_web_navi.jpg"
            alt="Alfred Schnittke Akademie International"
            width={110}
            height={40}
            priority
            style={{ height: 40, width: "auto" }}
          />
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <nav className="desktop-nav" aria-label="Hauptnavigation">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="nav-link"
                style={{
                  color: scrolled ? tokens.color.slate : tokens.color.ink,
                  transition: "color 0.5s",
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="mobile-toggle"
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              border: `1px solid rgba(208,0,0,0.30)`,
              background: scrolled
                ? "rgba(255,255,255,0.92)"
                : "rgba(255,255,255,0.70)",
              backdropFilter: "blur(10px)",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {mobileOpen ? (
              <X
                size={22}
                color={tokens.color.ink}
              />
            ) : (
              <List
                size={22}
                color={tokens.color.ink}
              />
            )}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(10,10,10,0.35)",
              backdropFilter: "blur(14px)",
            }}
          >
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 30, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: "100%",
                width: "min(420px, 92vw)",
                background: `linear-gradient(180deg, rgba(10,10,10,0.92) 0%, rgba(0,0,0,0.92) 100%)`,
                borderLeft: `1px solid rgba(208,0,0,0.18)`,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    minWidth: 0,
                  }}
                >
                  <Image
                    src="/Images/Logo/ASAI_Logo_web_navi.jpg"
                    alt="Alfred Schnittke Akademie International"
                    width={110}
                    height={40}
                    style={{ height: 40, width: "auto" }}
                  />
                </div>

                <button
                  type="button"
                  aria-label="Menü schließen"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    border: `1px solid rgba(255,255,255,0.12)`,
                    background: "rgba(255,255,255,0.02)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} color={tokens.color.warmWhite} />
                </button>
              </div>

              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.10)",
                  marginTop: 4,
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {navLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="mobile-menu-link"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 22,
                      color: tokens.color.warmWhite,
                      textDecoration: "none",
                      letterSpacing: -0.2,
                      padding: "10px 6px",
                      borderRadius: 10,
                    }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>

              <div style={{ flex: 1 }} />

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.10)",
                  paddingTop: 16,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <MapPin size={16} color={tokens.color.mist} />
                    <span
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 13,
                        color: "rgba(255,255,255,0.75)",
                      }}
                    >
                      Max-Brauer-Allee 24, 22765 Hamburg
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Phone size={16} color={tokens.color.mist} />
                    <span
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 13,
                        color: "rgba(255,255,255,0.75)",
                      }}
                    >
                      (040) 447531
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};
