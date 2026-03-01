import React from "react";
import { WebsiteTemplateProps } from "./types";

const ClassicInviteTemplate: React.FC<WebsiteTemplateProps> = ({ event }) => {
  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        background: "#0d0d0d",
        color: "#f0ead6",
        minHeight: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Hero image */}
      <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
        <img
          src={event.image || "/placeholder.png"}
          alt={event.eventName}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
        />
        {/* Gradient fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 40%, #0d0d0d 100%)",
          }}
        />
        {/* Top fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, #0d0d0d 0%, transparent 25%)",
          }}
        />
        {/* Eyebrow on image */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#c9a96e",
              fontFamily: "'Georgia', serif",
            }}
          >
            You&apos;re Invited
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 24px 32px" }}>
        {/* Title block */}
        <div style={{ marginTop: "-8px", marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "400",
              lineHeight: "1.15",
              letterSpacing: "-0.5px",
              margin: "0 0 10px",
              color: "#f0ead6",
            }}
          >
            {event.eventName}
          </h1>

          {/* Ornamental divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, #c9a96e44, #c9a96e)" }} />
            <span style={{ color: "#c9a96e", fontSize: "10px" }}>✦</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, #c9a96e44, #c9a96e)" }} />
          </div>

          <p
            style={{
              fontSize: "11px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#c9a96e",
              margin: 0,
            }}
          >
            {event.date}&nbsp;&nbsp;·&nbsp;&nbsp;{event.location}
          </p>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "13px",
            lineHeight: "1.8",
            color: "#b8b09a",
            marginBottom: "28px",
            borderLeft: "2px solid #c9a96e33",
            paddingLeft: "14px",
          }}
        >
          {event.description}
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          {[
            { label: "Guests", value: event.guestCount },
            { label: "Budget", value: `₦${(event.budget || 0).toLocaleString("en-NG")}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                padding: "14px 16px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Corner accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "16px",
                  height: "16px",
                  borderTop: "1px solid #c9a96e",
                  borderRight: "1px solid #c9a96e",
                }}
              />
              <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#666", margin: "0 0 6px" }}>
                {label}
              </p>
              <p style={{ fontSize: "15px", fontWeight: "400", color: "#f0ead6", margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Event Highlights */}
        <div
          style={{
            background: "#111",
            border: "1px solid #222",
            padding: "18px 20px",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#c9a96e",
              margin: "0 0 14px",
            }}
          >
            Event Highlights
          </p>
          {[
            ["Theme", event.themes?.[0] || "Celebration Experience"],
            ["Host", event.hostName || "Waddi Host"],
            ["Vendors", `${event.bookedVendors?.length || 0} booked`],
          ].map(([key, val]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                paddingBottom: "8px",
                marginBottom: "8px",
                borderBottom: "1px solid #1e1e1e",
              }}
            >
              <span style={{ fontSize: "11px", color: "#666", letterSpacing: "0.5px" }}>{key}</span>
              <span style={{ fontSize: "12px", color: "#d4c9b0" }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <div
          style={{
            background: "#111",
            border: "1px solid #222",
            padding: "18px 20px",
            marginBottom: "28px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#c9a96e",
              margin: "0 0 14px",
            }}
          >
            Schedule
          </p>
          {[
            ["3:00 PM", "Guest Arrival"],
            ["4:30 PM", "Main Program"],
            ["7:00 PM", "Reception"],
          ].map(([time, label]) => (
            <div
              key={time}
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#c9a96e",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "52px",
                  letterSpacing: "0.5px",
                }}
              >
                {time}
              </span>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#333", flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: "#b8b09a" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          style={{
            width: "100%",
            height: "48px",
            background: "transparent",
            border: "1px solid #c9a96e",
            color: "#c9a96e",
            fontSize: "10px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontFamily: "'Georgia', serif",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#c9a96e";
            (e.currentTarget as HTMLButtonElement).style.color = "#0d0d0d";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#c9a96e";
          }}
        >
          RSVP Now
        </button>
      </div>
    </div>
  );
};

export default ClassicInviteTemplate;