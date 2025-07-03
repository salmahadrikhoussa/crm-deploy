// app/dashboard/finance/depenses/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddDepense() {
  const router = useRouter();
  const [form, setForm] = useState({ label: "", amount: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // 👉 call your API to save the expense (add logic later)
    console.log("Depense enregistrée:", form);
    router.push("/dashboard/finance");
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Ajouter une dépense</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="label"
          placeholder="Intitulé"
          value={form.label}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <input
          type="number"
          name="amount"
          placeholder="Montant en DZD"
          value={form.amount}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
