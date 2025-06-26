// app/dashboard/notifications/page.tsx

"use client";

import { useEffect, useState } from "react";

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des notifications…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul className="space-y-4">
        {notifications.map((notif) => (
          <li key={notif._id} className="bg-white shadow p-4 rounded">
            <p>{notif.message}</p>
            <p className="text-sm text-gray-500">{new Date(notif.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
