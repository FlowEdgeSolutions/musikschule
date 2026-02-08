import Image from "next/image";
import { Envelope, MapPin, Phone } from "./icons";
import { fonts, tokens } from "./theme";

export const Footer = () => (
  <footer
    id="kontakt"
    style={{
      background: tokens.color.ink,
      padding: "80px 8% 40px",
      borderTop: `1px solid rgba(208,0,0,0.20)`,
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
          <Image
            src="/Images/Logo/ASAI_Logo_web_navi.jpg"
            alt="Alfred Schnittke Akademie International"
            width={140}
            height={52}
            style={{ height: 52, width: "auto" }}
          />
        </div>
        <p
          style={{
            fontFamily: fonts.accent,
            fontSize: 15,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.65)",
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
              <span style={{ fontFamily: fonts.body, fontSize: 14, color: "rgba(255,255,255,0.70)" }}>
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
        borderTop: `1px solid rgba(255,255,255,0.08)`,
        paddingTop: 24,
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <span style={{ fontFamily: fonts.body, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
        © 2026 Alfred Schnittke Akademie International. Alle Rechte vorbehalten.
      </span>
      <span style={{ fontFamily: fonts.body, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
        Max-Brauer-Allee 24 · Hamburg-Altona
      </span>
    </div>
  </footer>
);
