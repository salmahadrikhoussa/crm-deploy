"use client";

import { useState } from "react";

interface TitanCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export default function TitanCredentialsModal({ isOpen, onClose, initialEmail }: TitanCredentialsModalProps) {
  const [email, setEmail] = useState(initialEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/email/login-titan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        // @ts-ignore
        if (window?.toast) window.toast("Titan credentials saved!", { type: "success" });
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save credentials");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className="fixed inset-y-0 right-0 z-[9999] w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto transition-transform duration-300 transform translate-x-0 flex flex-col justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titan-credentials-modal-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="titan-credentials-modal-title" className="text-lg font-semibold">Titan Email Credentials</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
            aria-label="Close modal"
            disabled={loading}
          >
            &times;
          </button>
        </div>
        <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium">Titan Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
              autoFocus
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-medium">Titan Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 border rounded pr-10"
                required
                placeholder="Password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 