"use client";

import { useEffect, useState, FormEvent } from "react";

export interface ProjectInput {
  name: string;
  clientId: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface User {
  id: string;
  name?: string;
  email: string;
}

interface Client {
  id: string;
  name: string;
}

interface NewProjectFormProps {
  onSuccess: (proj: ProjectInput & { id: string }) => void;
  onClose: () => void;
}

export default function NewProjectForm({ onSuccess, onClose }: NewProjectFormProps) {
  const [form, setForm] = useState<ProjectInput>({
    name: "",
    clientId: "",
    owner: "",
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/clients")
      .then(res => res.json())
      .then(setClients)
      .catch(err => console.error("Clients error", err));

    fetch("/api/users")
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error("Users error", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}));
        setError(msg || "Failed to create project");
      } else {
        const created = await res.json();
        onSuccess(created);
        setLoading(false);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl space-y-4"
      >
        <h2 className="text-xl font-semibold">New Project</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            className="mt-1 block w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Client */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <select
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            required
            disabled={loading}
            className="mt-1 block w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        {/* Owner */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Owner</label>
          <select
            name="owner"
            value={form.owner}
            onChange={handleChange}
            required
            disabled={loading}
            className="mt-1 block w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              disabled={loading}
              className="mt-1 block w-full border border-gray-200 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              disabled={loading}
              className="mt-1 block w-full border border-gray-200 rounded-lg p-2"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={loading}
            className="mt-1 block w-full border border-gray-200 rounded-lg p-2"
          >
            {["Active", "Completed", "On Hold", "Cancelled"].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={() => { setLoading(false); onClose(); }}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
