"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  async function handleSubscribe() {
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="w-full md:w-auto">
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubscribe();
          }}
          placeholder="Enter your email"
          className="flex-1 md:w-80 px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={status === "sending"}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <Send size={18} aria-hidden="true" />
          {status === "sending" ? "Sending" : "Subscribe"}
        </button>
      </div>

      <p aria-live="polite" className="mt-3 text-sm">
        {status === "done" ? (
          <span className="text-green-400 font-semibold">
            Thank you for subscribing.
          </span>
        ) : null}
        {status === "error" ? (
          <span className="text-red-400 font-semibold">
            Something went wrong. Please email us instead.
          </span>
        ) : null}
      </p>
    </div>
  );
}
