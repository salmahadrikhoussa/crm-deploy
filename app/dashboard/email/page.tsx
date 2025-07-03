"use client";

import { useState, useEffect } from "react";
import NewEmailModal from "../../components/NewEmailModal";
import TitanCredentialsModal from "../../components/TitanCredentialsModal";

export default function EmailPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [credsModalOpen, setCredsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setApiError(null);
    fetch("/api/email/inbox")
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          setApiError(data.error || "Unknown error");
          setEmails([]);
        } else {
          setEmails(data.emails || []);
          if (data.emails && data.emails.length > 0) {
            setSelectedId("0");
          }
        }
      })
      .catch(err => setApiError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  const selected = selectedId !== null ? emails[Number(selectedId)] : null;

  return (
    <main className="flex flex-col p-0 bg-gray-50 min-h-screen h-full w-full">
      <div className="p-8">
        <div className="text-xl font-semibold mb-4">Email Client</div>
        <div className="bg-white rounded-lg shadow border flex h-[80vh] w-full overflow-hidden">
          {/* Email List */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b flex flex-col gap-2">
              <button
                onClick={() => setCredsModalOpen(true)}
                className="w-full bg-gray-200 text-gray-800 font-medium py-2 rounded hover:bg-gray-300 transition"
              >
                Set Titan Mail Credentials
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-black text-white font-medium py-2 rounded hover:bg-gray-800 transition"
              >
                + New Email
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-gray-400">Loading emails...</div>
              ) : apiError ? (
                <div className="p-4 text-red-600">{apiError}</div>
              ) : emails.length === 0 ? (
                <div className="p-4 text-gray-400">No emails found.</div>
              ) : (
                emails.map((email, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedId(String(idx))}
                    className={`px-4 py-3 border-b cursor-pointer transition bg-white hover:bg-gray-50 ${
                      selectedId === String(idx) ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{email.from}</span>
                    </div>
                    <div className="font-semibold text-gray-900 text-base truncate">
                      {email.subject}
                    </div>
                    <div className="text-gray-500 text-xs truncate">{email.bodyPreview}</div>
                    <div className="text-gray-400 text-xs mt-1">{email.date ? new Date(email.date).toLocaleString() : ''}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Email Detail */}
          <div className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
            ) : apiError ? (
              <div className="flex-1 flex items-center justify-center text-red-600">{apiError}</div>
            ) : selected ? (
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-xl font-semibold">{selected.subject}</div>
                    <div className="text-gray-700 text-sm mt-1">
                      From: <span className="font-medium">{selected.from}</span>
                      <span className="ml-4 text-gray-400">{selected.date ? new Date(selected.date).toLocaleString() : ''}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="border px-3 py-1 rounded text-sm hover:bg-gray-100">Reply</button>
                    <button className="border px-3 py-1 rounded text-sm hover:bg-gray-100">Reply All</button>
                    <button className="border px-3 py-1 rounded text-sm hover:bg-gray-100">Forward</button>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <button className="border px-3 py-1 rounded text-sm hover:bg-gray-100">Archive</button>
                  <button className="border px-3 py-1 rounded text-sm hover:bg-gray-100">Delete</button>
                </div>
                <div className="text-gray-800 text-base whitespace-pre-line flex-1">
                  {selected.bodyPreview}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">Select an email to view</div>
            )}
          </div>
        </div>
      </div>
      <NewEmailModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <TitanCredentialsModal isOpen={credsModalOpen} onClose={() => setCredsModalOpen(false)} />
    </main>
  );
}
