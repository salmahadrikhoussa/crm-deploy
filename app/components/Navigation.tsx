"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function Navigation() {
  const [role, setRole] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);

    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        const unread = data.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      })
      .catch(console.error);
  }, []);

  const links = [
    { href: "/dashboard", label: "Dashboard", roles: ["admin", "bizdev", "developer"] },
    { href: "/dashboard/clients", label: "Clients", roles: ["admin", "bizdev"] },
    { href: "/dashboard/prospects", label: "Prospects", roles: ["admin", "bizdev", "developer"] },
    { href: "/dashboard/tasks", label: "Tasks", roles: ["admin", "bizdev", "developer"] },
    { href: "/dashboard/projects", label: "Projects", roles: ["admin", "bizdev", "developer"] },
    { href: "/dashboard/users", label: "Users", roles: ["admin"] },
    { href: "/dashboard/frais", label: "Frais" }, // ✅ No more role restriction

  ];

  if (!role) return null;

  return (
    <nav className="px-4 py-2 bg-white shadow h-full">
  <ul className="flex flex-col space-y-2">
    {links
      .filter((link) => !link.roles || link.roles.includes(role))
      .map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="block hover:text-blue-600">
            {link.label}
          </Link>
        </li>
      ))}
    <li>
      <Link href="/dashboard/notifications" className="relative">
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </Link>
    </li>
  </ul>
</nav>
  );
}
