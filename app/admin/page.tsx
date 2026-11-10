"use client";

import { useEffect } from "react";

export default function AdminRedirectPage() {
  useEffect(() => {
    window.location.replace("/#admin");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1d3a",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans, sans-serif)",
        fontSize: "14px",
        letterSpacing: "1px",
      }}
    >
      Loading OZ Park Hotel Management Portal...
    </div>
  );
}
