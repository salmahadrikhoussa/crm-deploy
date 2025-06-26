"use client";

import { useEffect, useState, FormEvent } from "react";

export interface TaskInput {
  projectId: string; // maintenant contient le nom du projet
  title: string;
  description: string;
  assignedTo: string; // maintenant contient le nom de l'utilisateur
  dueDate: string;
  priority: string;
  status: string;
}

interface Project {
  id: string;
  name?: string;
}

interface User {
  id: string;
  name?: string;
  email: string;
}

interface NewTaskFormProps {
  onSuccess: (task: TaskInput & { id: string }) => void;
  onClose: () => void;
}

export default function NewTaskForm({ onSuccess, onClose }: NewTaskFormProps) {
  const today = new Date().toISOString().substring(0, 10);
  const [form, setForm] = useState<TaskInput>({
    projectId: "",
    title: "",
    description: "",
    assignedTo: "",
    dueDate: today,
    priority: "Normal",
    status: "Open",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) =>
        setProjects(
          data.map((p: any) => ({
            id: p.id,
            name: p.name ?? p.id,
          }))
        )
      )
      .catch(console.error);

    fetch("/api/users")
      .then((res) => res.json())
      .then((data) =>
        setUsers(
          data.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
          }))
        )
      )
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}));
        setError(msg || "Failed to create task");
      } else {
        const created = await res.json();
        onSuccess(created);
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
        <h2 className="text-xl font-semibold">New Task</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Project */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Project</label>
          <select
            name="projectId"
            required
            value={form.projectId}
            onChange={handleChange}
            disabled={loading}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="">-- Select a project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            disabled={loading}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Assigned To */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Assigned To</label>
          <select
            name="assignedTo"
            required
            value={form.assignedTo}
            onChange={handleChange}
            disabled={loading}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="">-- Select a user --</option>
            {users.map((u) => (
              <option key={u.id} value={u.name || u.email}>
                {u.name || u.email}
              </option>
            ))}
          </select>
        </div>

        {/* Dates & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              disabled={loading}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              disabled={loading}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            >
              {["Low", "Normal", "High", "Urgent"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
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
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          >
            {["Open", "In Progress", "Completed", "Blocked"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={() => {
              setLoading(false);
              onClose();
            }}
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
