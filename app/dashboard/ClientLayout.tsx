/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Clients", href: "/dashboard/clients" },
  { label: "Prospects", href: "/dashboard/prospects" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Tasks", href: "/dashboard/tasks" },
  { label: "Users", href: "/dashboard/users" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Emails", href: "/dashboard/email" },
];

const financeSubItems = [
  { label: "Dashboard", href: "/dashboard/finance" },
  { label: "Dépenses", href: "/dashboard/finance/depenses" },
  { label: "Entrée d'argent", href: "/dashboard/finance/entree" },
];

interface User {
  id: string;
  name?: string;
  email: string;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(path.startsWith("/dashboard/finance"));
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then((u: User) => setUser(u))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (badgeRef.current && !badgeRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const rawInitial = user?.name?.trim().charAt(0) || user?.email?.trim().charAt(0) || "U";
  const initial = rawInitial.toUpperCase();

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error", err);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <img src="/logo.png" alt="Suzalink" className="h-8" />
          </div>
          <nav className="space-y-2">
            {navItems.map(item => {
              const isActive = path === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg font-medium transition ${
                    isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Finance Group */}
            <div>
              <button
                onClick={() => setFinanceOpen(prev => !prev)}
                className="w-full text-left px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
              >
                Finance {financeOpen ? "▲" : "▼"}
              </button>
              {financeOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {financeSubItems.map(sub => {
                    const isActive = path === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`block px-3 py-1 rounded-lg text-sm font-medium transition ${
                          isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Profile Badge */}
        <div ref={badgeRef} className="relative mt-8">
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
          >
            <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
              {initial}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{user?.name || user?.email || "User"}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute left-0 bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <button
                onClick={() => router.push("/dashboard/profile")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-2xl p-6 shadow">{children}</div>
      </main>
    </div>
  );
}
