"use client";

import { useState, useEffect } from "react";
import TitanCredentialsModal from "../../components/TitanCredentialsModal";

interface Email {
  from: string;
  subject: string;
  bodyPreview: string;
  date: string;
  unread?: boolean;
}

export default function EmailPage() {
  const [connected, setConnected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Compose form state
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Add a notification state for fallback toasts
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Add state for selected email
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // Fetch emails after connecting
  useEffect(() => {
    if (connected) {
      setLoading(true);
      setError(null);
      fetch("/api/email/inbox")
        .then(async res => {
          const data = await res.json();
          if (!res.ok) {
            setError(data.error || "Unknown error");
            setEmails([]);
          } else {
            setEmails(data.emails || []);
          }
        })
        .catch(err => setError(String(err)))
        .finally(() => setLoading(false));
    }
  }, [connected]);

  // Check if user has Titan credentials on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(user => {
        if (user.titanEmail && user.titanPassword) {
          setConnected(true);
        }
      });
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);
    setSendSuccess(false);
    setSending(true);
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendSuccess(true);
        setTo("");
        setSubject("");
        setMessage("");
        setComposeOpen(false);
        if ((window as any)?.toast) {
          (window as any).toast("Email sent!", { type: "success" });
        } else {
          setNotification({ type: 'success', message: 'Email sent!' });
          setTimeout(() => setNotification(null), 3000);
        }
      } else {
        setSendError(data.error || "Failed to send email");
        if ((window as any)?.toast) {
          (window as any).toast(data.error || "Failed to send email", { type: "error" });
        } else {
          setNotification({ type: 'error', message: data.error || 'Failed to send email' });
          setTimeout(() => setNotification(null), 3000);
        }
      }
    } catch (err) {
      setSendError("Network error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafd] w-full">
      <div>
        <div className="flex items-center justify-between mb-6 w-full px-0">
          <div>
            <h1 className="text-3xl font-extrabold mb-1 flex items-center gap-2 text-gray-900">Good morning! <span className="text-3xl">👋</span></h1>
            <p className="text-gray-600 text-base font-medium">{connected ? `You have ${emails.filter(e => e.unread).length} new messages waiting for your attention` : "Connect your email to view your inbox"}</p>
          </div>
          <button
            className="bg-[#6c63ff] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#554ee1] transition hidden sm:block"
            onClick={() => setComposeOpen(true)}
            disabled={!connected}
          >
            + Compose Email
          </button>
        </div>
        <div className="flex items-center gap-4 mb-6 w-full px-0">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow text-base font-semibold text-gray-800">
            <span className="bg-[#6c63ff] text-white rounded-full p-2">📧</span>
            <span>EmailCRM</span>
          </div>
          {connected ? (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
              Connected <span className="font-semibold">(Titan)</span>
            </div>
          ) : (
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition"
              onClick={() => setModalOpen(true)}
            >
              Connect your email
            </button>
          )}
          <div className="bg-white px-4 py-2 rounded shadow flex flex-col items-center min-w-[80px]">
            <span className="text-xs text-gray-500 font-semibold">Unread</span>
            <span className="font-bold text-xl text-gray-900">{emails.filter(e => e.unread).length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded shadow flex flex-col items-center min-w-[80px]">
            <span className="text-xs text-gray-500 font-semibold">This Week</span>
            <span className="font-bold text-xl text-gray-900">{emails.length}</span>
          </div>
          <button
            className="bg-[#6c63ff] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#554ee1] transition sm:hidden"
            onClick={() => setComposeOpen(true)}
            disabled={!connected}
          >
            + Compose Email
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 w-full">
          <div className="flex gap-6 border-b mb-4 text-base font-semibold">
            <button className="pb-2 border-b-2 border-[#6c63ff] text-[#6c63ff]">Inbox</button>
            <button className="pb-2 text-gray-400">Sent</button>
            <button className="pb-2 text-gray-400">Drafts</button>
          </div>
          {!connected ? (
            <div className="flex flex-col items-center justify-center py-16">
              <button
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded font-semibold hover:bg-gray-300 transition text-lg"
                onClick={() => setModalOpen(true)}
              >
                Connect your email
              </button>
              <p className="text-gray-400 mt-4">Connect your Titan email to view your inbox.</p>
            </div>
          ) : loading ? (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-[#f7fafd] rounded-lg p-4 flex items-center gap-4 border border-transparent shadow-sm animate-pulse">
                  <div className="bg-gray-200 rounded-full w-10 h-10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-300 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[90px]">
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-red-600 gap-4">
              <span>{error}</span>
              <button
                className="bg-red-100 text-red-700 px-4 py-2 rounded font-semibold hover:bg-red-200 transition"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetch("/api/email/inbox")
                    .then(async res => {
                      const data = await res.json();
                      if (!res.ok) {
                        setError(data.error || "Unknown error");
                        setEmails([]);
                      } else {
                        setEmails(data.emails || []);
                      }
                    })
                    .catch(err => setError(String(err)))
                    .finally(() => setLoading(false));
                }}
              >
                Retry
              </button>
            </div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">No emails found.</div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              {emails.map((email, idx) => (
                <div
                  key={idx}
                  className={`bg-[#f7fafd] rounded-lg p-4 flex items-center gap-4 border ${idx === 0 ? 'border-[#6c63ff]' : 'border-transparent'} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-xl text-gray-500">👤</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{email.from}</div>
                    <div className="font-bold text-lg text-gray-800">{email.subject}</div>
                    <div className="text-gray-500 text-sm truncate">{email.bodyPreview}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[90px]">
                    <span className="text-xs text-gray-400 font-medium">{email.date ? new Date(email.date).toLocaleString() : ''}</span>
                    {email.unread && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <TitanCredentialsModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setConnected(true);
          if ((window as any)?.toast) {
            (window as any).toast("Titan credentials saved!", { type: "success" });
          } else {
            setNotification({ type: 'success', message: 'Titan credentials saved!' });
            setTimeout(() => setNotification(null), 3000);
          }
        }}
      />
      {/* Compose Email Modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-black"
              onClick={() => setComposeOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Compose Email</h2>
            <form className="space-y-4" onSubmit={handleSend}>
              <div>
                <label className="block font-medium mb-1">To *</label>
                <input
                  type="email"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="recipient@email.com"
                  disabled={sending}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Subject"
                  disabled={sending}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Message *</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-2 border rounded min-h-[120px]"
                  required
                  placeholder="Your message..."
                  disabled={sending}
                />
              </div>
              {sendError && <div className="text-red-600 text-sm">{sendError}</div>}
              {sendSuccess && <div className="text-green-600 text-sm">Email sent successfully!</div>}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Email"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Render notification if present */}
      {notification && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
        </div>
      )}
      {/* Render modal if selectedEmail */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-black"
              onClick={() => setSelectedEmail(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">From:</div>
              <div className="font-semibold text-gray-900 mb-2">{selectedEmail.from}</div>
              <div className="text-xs text-gray-500 mb-1">Subject:</div>
              <div className="font-bold text-lg text-gray-800 mb-2">{selectedEmail.subject}</div>
              <div className="text-xs text-gray-500 mb-1">Date:</div>
              <div className="text-xs text-gray-700 mb-4">{selectedEmail.date ? new Date(selectedEmail.date).toLocaleString() : ''}</div>
              <div className="border-t pt-4 text-gray-800 whitespace-pre-line break-words">
                {selectedEmail.bodyPreview}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
