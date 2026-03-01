import React, { useState } from "react";
import { WebsiteTemplateProps } from "./types";

const VibrantSpotlightTemplate: React.FC<WebsiteTemplateProps> = ({ event }) => {
  const [rsvpDone, setRsvpDone] = useState(false);

  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        background: "#0a0a0a",
        color: "#fff",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden" }}>
        <img
          src={event.image || "/placeholder.png"}
          alt={event.eventName}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #0a0a0a 100%)" }} />

        {/* Nav */}
        <nav
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "28px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
            Waddi Events
          </span>
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              background: "#ff3c00",
              color: "#fff",
              padding: "6px 14px",
            }}
          >
            {event.status || "Open"}
          </span>
        </nav>

        {/* Hero text */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "40px",
            right: "40px",
            zIndex: 10,
          }}
        >
          <p style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#ff3c00", marginBottom: "16px" }}>
            {event.date}
          </p>
          <h1
            style={{
              fontSize: "clamp(40px, 8vw, 72px)",
              fontWeight: "900",
              lineHeight: "1.0",
              letterSpacing: "-2px",
              textTransform: "uppercase",
              margin: "0 0 20px",
              maxWidth: "700px",
            }}
          >
            {event.eventName}
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>
            {event.location}
          </p>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            zIndex: 10,
            opacity: 0.35,
          }}
        >
          <div style={{ width: "1px", height: "36px", background: "#fff" }} />
          <span style={{ fontSize: "7px", letterSpacing: "2px", textTransform: "uppercase" }}>Scroll</span>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ padding: "100px 40px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "60px", alignItems: "start" }}>
          <div>
            <p style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#ff3c00", marginBottom: "16px" }}>
              About
            </p>
            <div style={{ width: "40px", height: "3px", background: "#ff3c00" }} />
          </div>
          <div>
            <p style={{ fontSize: "17px", lineHeight: "1.85", color: "rgba(255,255,255,0.7)", margin: "0 0 40px" }}>
              {event.description || "An unforgettable experience awaits. Join us for an evening of celebration, connection, and memories that will last a lifetime."}
            </p>
            <div style={{ display: "flex", gap: "40px" }}>
              {[
                { label: "Guests", value: event.guestCount },
                { label: "Vendors", value: event.bookedVendors?.length || 0 },
                { label: "Theme", value: event.themes?.[0] || "Celebration" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: "28px", fontWeight: "900", color: "#fff", margin: "0 0 4px", letterSpacing: "-1px" }}>{value}</p>
                  <p style={{ fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div style={{ borderTop: "1px solid #181818", margin: "0 40px" }} />

      {/* ── SCHEDULE ── */}
      <section style={{ padding: "100px 40px", maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#ff3c00", marginBottom: "60px" }}>
          Run of Show
        </p>
        {[
          { time: "3:00 PM", title: "Guest Arrival", desc: "Doors open, welcome drinks served" },
          { time: "4:30 PM", title: "Main Program", desc: "The evening's central experience begins" },
          { time: "7:00 PM", title: "Reception", desc: "Dinner, dancing, and celebration" },
        ].map(({ time, title, desc }, i) => (
          <div
            key={time}
            style={{
              display: "grid",
              gridTemplateColumns: "130px 1fr",
              gap: "40px",
              paddingBottom: "48px",
              marginBottom: "48px",
              borderBottom: "1px solid #141414",
            }}
          >
            <div style={{ paddingTop: "4px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "#ff3c00", margin: "0 0 6px", letterSpacing: "1px" }}>{time}</p>
              <p style={{ fontSize: "8px", color: "#2a2a2a", letterSpacing: "1px", margin: 0 }}>0{i + 1}</p>
            </div>
            <div>
              <p style={{ fontSize: "20px", fontWeight: "800", color: "#fff", margin: "0 0 8px", letterSpacing: "-0.5px", textTransform: "uppercase" }}>{title}</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: "1.7" }}>{desc}</p>
            </div>
          </div>
        ))}
      </section>

      <div style={{ borderTop: "1px solid #181818", margin: "0 40px" }} />

      {/* ── HOST & DETAILS ── */}
      <section style={{ padding: "100px 40px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: "36px" }}>
            <p style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#ff3c00", margin: "0 0 24px" }}>Hosted By</p>
            <p style={{ fontSize: "24px", fontWeight: "800", color: "#fff", margin: "0 0 10px", letterSpacing: "-0.5px" }}>{event.hostName || "Waddi Host"}</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: "1.7" }}>
              Bringing this experience to life with care and intention.
            </p>
          </div>
          <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: "36px" }}>
            <p style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#ff3c00", margin: "0 0 24px" }}>Details</p>
            {[
              ["Date", event.date],
              ["Location", event.location],
              ["Budget", `₦${(event.budget || 0).toLocaleString("en-NG")}`],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  paddingBottom: "12px",
                  marginBottom: "12px",
                  borderBottom: "1px solid #1a1a1a",
                }}
              >
                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "1px" }}>{k}</span>
                <span style={{ fontSize: "13px", color: "#fff", fontWeight: "600" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RSVP SECTION ── */}
      <section style={{ background: "#ff3c00", padding: "120px 40px", textAlign: "center" }}>
        <p style={{ fontSize: "9px", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "24px" }}>
          Secure Your Spot
        </p>
        <h2
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: "900",
            letterSpacing: "-2px",
            textTransform: "uppercase",
            margin: "0 0 48px",
            lineHeight: 1,
          }}
        >
          Will You Be There?
        </h2>
        {rsvpDone ? (
          <p style={{ fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
            ✓ You&apos;re on the list
          </p>
        ) : (
          <button
            onClick={() => setRsvpDone(true)}
            style={{
              background: "#fff",
              color: "#ff3c00",
              border: "none",
              padding: "20px 64px",
              fontSize: "10px",
              fontWeight: "900",
              letterSpacing: "4px",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Helvetica Neue', sans-serif",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
          >
            RSVP Now
          </button>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #141414",
        }}
      >
        <span style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#2a2a2a" }}>Waddi Events</span>
        <span style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#2a2a2a" }}>{event.eventName}</span>
      </footer>
    </div>
  );
};

export default VibrantSpotlightTemplate;