import { Envelope, MapPin, MusicNotes, Phone } from "./icons";
import { fonts, tokens } from "./theme";

export const Footer = () => (
  <footer
    id="kontakt"
    style={{
      background: tokens.color.ink,
      padding: "80px 8% 40px",
      borderTop: `1px solid rgba(196,163,90,0.1)`,
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 48,
        marginBottom: 60,
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `1px solid ${tokens.color.gold}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MusicNotes size={16} color={tokens.color.gold} />
          </div>
          <span style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 600, color: tokens.color.warmWhite }}>
            Schnittke Akademie
          </span>
        </div>
        <p
          style={{
            fontFamily: fonts.accent,
            fontSize: 15,
            lineHeight: 1.8,
            color: "rgba(245,240,232,0.4)",
            fontStyle: "italic",
            fontWeight: 300,
            maxWidth: 280,
          }}
        >
          Von der Kulturbehörde anerkannte private Musikakademie für zeitgenössische und klassische Musik.
        </p>
      </div>

      <div>
        <h4 style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: tokens.color.gold, marginBottom: 20 }}>
          Kontakt
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: <MapPin size={16} color={tokens.color.mist} />, text: "Max-Brauer-Allee 24, 22765 Hamburg" },
            { icon: <Phone size={16} color={tokens.color.mist} />, text: "(040) 447531" },
            { icon: <Envelope size={16} color={tokens.color.mist} />, text: "kontakt@schnittke-akademie.de" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {item.icon}
              <span style={{ fontFamily: fonts.body, fontSize: 14, color: "rgba(245,240,232,0.5)" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: tokens.color.gold, marginBottom: 20 }}>
          Navigation
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {["Akademie", "Studium", "Dozenten", "Veranstaltungen", "Räume mieten", "Impressum", "Datenschutz"].map((l) => (
            <a key={l} href="#" className="footer-link" style={{ fontFamily: fonts.body, fontSize: 14 }}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </div>

    <div
      style={{
        borderTop: `1px solid rgba(196,163,90,0.08)`,
        paddingTop: 24,
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <span style={{ fontFamily: fonts.body, fontSize: 12, color: "rgba(245,240,232,0.2)" }}>
        © 2026 Alfred Schnittke Akademie International. Alle Rechte vorbehalten.
      </span>
      <span style={{ fontFamily: fonts.body, fontSize: 12, color: "rgba(245,240,232,0.15)" }}>
        Max-Brauer-Allee 24 · Hamburg-Altona
      </span>
    </div>
  </footer>
);

