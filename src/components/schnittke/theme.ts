export const tokens = {
  color: {
    ink: "#0A0A0A",
    anthracite: "#2D2D2D",
    parchment: "#F7F7F7",
    warmWhite: "#FFFFFF",
    // Historical name in this prototype: used as the brand accent color.
    gold: "#D00000",
    // Used for light text on dark backgrounds.
    goldLight: "#FFFFFF",
    goldMuted: "rgba(208,0,0,0.12)",
    slate: "#262626",
    mist: "#BDBDBD",
    deep: "#2D2D2D",
    accent: "#7A0000",
  },
} as const;

export const fonts = {
  display: "'Playfair Display', 'Georgia', serif",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  accent: "'Cormorant Garamond', 'Georgia', serif",
} as const;
