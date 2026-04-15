import { useState } from "react";
import s from "./ShareButton.module.css";

export function ShareButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS) — fall back to prompt
      window.prompt("Copy your results:", text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button className={s.btn} data-copied={copied ? "true" : "false"} onClick={handleShare}>
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
