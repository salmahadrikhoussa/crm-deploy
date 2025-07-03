"use client";

import { useState } from "react";
import NewEmailModal from "../../components/NewEmailModal";

const emails = [
  {
    id: 1,
    from: "john.doe@example.com",
    subject: "Project Update",
    body: "Here's the latest update on our project...",
    preview: "Here's the latest update on our project...",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    from: "sarah.wilson@company.com",
    subject: "Meeting Tomorrow",
    body:
      "Don't forget about our meeting scheduled for tomorrow at 10 AM. We'll be discussing the quarterly reports and planning for the next phase of development. Please bring any relevant documents and be prepared to discuss your current workload.",
    preview: "Don't forget about our meeting sched...",
    time: "4 hours ago",
    unread: false,
  },
  {
    id: 3,
    from: "support@service.com",
    subject: "Your Account Status",
    body: "Your account has been successfully updated.",
    preview: "Your account has been successfully upda...",
    time: "1 day ago",
    unread: false,
  },
];

export default function EmailPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(2);
  const selected = emails.find((e) => e.id === selectedId);

  return (
    <main className="flex flex-col p-0 bg-gray-50 min-h-screen h-full w-full">
      <div className="p-8">
        <div className="text-xl font-semibold mb-4">Email Client</div>
        <div className="bg-white rounded-lg shadow border flex h-[80vh] w-full overflow-hidden">
          {/* Email List */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-black text-white font-medium py-2 rounded hover:bg-gray-800 transition"
              >
                + New Email
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setSelectedId(email.id)}
                  className={`px-4 py-3 border-b cursor-pointer transition bg-white hover:bg-gray-50 ${
                    selectedId === email.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{email.from}</span>
                    {email.unread && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block ml-2" />}
                  </div>
                  <div className="font-semibold text-gray-900 text-base truncate">
                    {email.subject}
                  </div>
                  <div className="text-gray-500 text-xs truncate">{email.preview}</div>
                  <div className="text-gray-400 text-xs mt-1">{email.time}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Email Detail */}
          <div className="flex-1 flex flex-col">
            {selected ? (
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-xl font-semibold">{selected.subject}</div>
                    <div className="text-gray-700 text-sm mt-1">
                      From: <span className="font-medium">{selected.from}</span>
                      <span className="ml-4 text-gray-400">{selected.time}</span>
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
                  {selected.body}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">Select an email to view</div>
            )}
          </div>
        </div>
      </div>
      <NewEmailModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
