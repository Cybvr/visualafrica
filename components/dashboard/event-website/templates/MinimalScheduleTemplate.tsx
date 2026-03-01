import React from "react";
import { WebsiteTemplateProps } from "./types";

const MinimalScheduleTemplate: React.FC<WebsiteTemplateProps> = ({ event }) => {
  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        background: "#f5f0e8",
        minHeight: "100%",
        padding: "0",
        position: "relative",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "8px", letterSpacing: "3px", color: "#888", textTransform: "uppercase" }}>
          Event Schedule
        </span>
        <span style={{ fontSize: "8px", letterSpacing: "2px", color: "#555", textTransform: "uppercase" }}>
          {event.date}
        </span>
      </div>

      {/* Big number accent */}
      <div style={{ position: "relative", padding: "28px 20px 0", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            fontSize: "120px",
            fontWeight: "900",
            color: "#e8e1d4",
            lineHeight: 1,
            letterSpacing: "-6px",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {new Date().getFullYear()}
        </div>

        {/* Event name */}
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "900",
            lineHeight: "1.0",
            letterSpacing: "-1.5px",
            margin: "0 0 4px",
            color: "#1a1a1a",
            textTransform: "uppercase",
            position: "relative",
            zIndex: 1,
            maxWidth: "75%",
          }}
        >
          {event.eventName}
        </h1>

        {/* Thick underline accent */}
        <div style={{ display: "flex", gap: "3px", marginBottom: "24px" }}>
          <div style={{ height: "4px", width: "40px", background: "#1a1a1a" }} />
          <div style={{ height: "4px", width: "10px", background: "#d4a843" }} />
        </div>
      </div>

      {/* Info strips */}
      <div style={{ padding: "0 20px", marginBottom: "20px" }}>
        {[
          { label: "Location", value: event.location },
          { label: "Guests", value: `${event.guestCount} attending` },
          { label: "Theme", value: event.themes?.[0] || "Event Experience" },
        ].map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "stretch",
              borderBottom: "1px solid #c8bfaf",
              paddingBottom: "12px",
              marginBottom: "12px",
            }}
          >
            {/* Left index */}
            <div
              style={{
                width: "24px",
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-start",
                paddingTop: "2px",
              }}
            >
              <span
                style={{
                  fontSize: "8px",
                  fontWeight: "700",
                  color: "#d4a843",
                  letterSpacing: "1px",
                }}
              >
                0{i + 1}
              </span>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "8px",
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: "#9c9080",
                  margin: "0 0 2px",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  margin: 0,
                  letterSpacing: "-0.3px",
                }}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule block */}
      <div
        style={{
          margin: "0 20px 20px",
          background: "#1a1a1a",
          padding: "16px 18px",
        }}
      >
        <p
          style={{
            fontSize: "8px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#d4a843",
            margin: "0 0 14px",
          }}
        >
          Run of Show
        </p>

        {[
          { time: "3:00", label: "Guest Arrival" },
          { time: "4:30", label: "Main Program" },
          { time: "7:00", label: "Reception" },
        ].map(({ time, label }, i, arr) => (
          <div
            key={time}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              paddingBottom: i < arr.length - 1 ? "10px" : 0,
              marginBottom: i < arr.length - 1 ? "10px" : 0,
              borderBottom: i < arr.length - 1 ? "1px solid #2e2e2e" : "none",
            }}
          >
            <span
              style={{
                fontWeight: "900",
                fontSize: "13px",
                color: "#f5f0e8",
                fontVariantNumeric: "tabular-nums",
                minWidth: "36px",
                letterSpacing: "-0.5px",
              }}
            >
              {time}
            </span>
            <span style={{ fontSize: "8px", color: "#555", letterSpacing: "1px" }}>PM</span>
            <span
              style={{
                fontSize: "11px",
                color: "#a09880",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom strip */}
      <div
        style={{
          margin: "0 20px 24px",
          display: "flex",
          gap: "8px",
        }}
      >
        <div style={{ flex: 1, background: "#1a1a1a", height: "4px" }} />
        <div style={{ width: "24px", background: "#d4a843", height: "4px" }} />
        <div style={{ width: "8px", background: "#1a1a1a", height: "4px" }} />
      </div>
    </div>
  );
};

export default MinimalScheduleTemplate;