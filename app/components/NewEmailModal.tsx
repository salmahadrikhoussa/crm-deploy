"use client";

import { useState, useRef } from "react";

interface NewEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewEmailModal({ isOpen, onClose }: NewEmailModalProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateEmail(to)) {
      setError("Destinataire invalide");
      return;
    }
    if (!subject.trim()) {
      setError("Le sujet est obligatoire");
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("message", message);
    if (attachment) formData.append("attachment", attachment);
    const res = await fetch("/api/emails/send", {
      method: "POST",
      body: formData,
    });
    setSubmitting(false);
    if (res.ok) {
      // @ts-ignore
      if (window?.toast) window.toast("Email envoyé !", { type: "success" });
      onClose();
      setTo("");
      setSubject("");
      setMessage("");
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setError("Erreur lors de l'envoi de l'email.");
    }
  };

  return (
    <>
      <div
        className="fixed inset-y-0 right-0 z-[9999] w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto transition-transform duration-300 transform translate-x-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-email-modal-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="new-email-modal-title" className="text-lg font-semibold">Nouveau message</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
            aria-label="Fermer le modal"
          >
            &times;
          </button>
        </div>
        <form
          className="space-y-4 text-sm"
          onSubmit={e => {
            e.preventDefault();
            if (!submitting) handleSubmit();
          }}
        >
          <div>
            <label className="block font-medium">À *</label>
            <input
              type="email"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full p-2 border rounded"
              required
              autoFocus
              placeholder="destinataire@email.com"
            />
          </div>
          <div>
            <label className="block font-medium">Sujet *</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full p-2 border rounded"
              required
              placeholder="Sujet du message"
            />
          </div>
          <div>
            <label className="block font-medium">Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full p-2 border rounded min-h-[120px]"
              placeholder="Votre message..."
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Pièce jointe</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => setAttachment(e.target.files?.[0] || null)}
              className="block"
            />
            {attachment && <p className="mt-2 text-sm">{attachment.name}</p>}
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded"
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {submitting ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
        aria-hidden="true"
      />
    </>
  );
} 