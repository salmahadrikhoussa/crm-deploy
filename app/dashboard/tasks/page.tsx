// app/dashboard/tasks/page.tsx
"use client";

import { useEffect, useState } from "react";
import TaskDetailsModal from "../../components/TaskDetailsModal";
import NewTaskForm from "../../components/NewTaskForm";
import { Task } from "../../types/task";

export default function TasksPage() {
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm]       = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter]     = useState("All");

  useEffect(() => {
    fetch("/api/tasks")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Task[]) => setTasks(data))
      .catch(() => setError("Erreur lors du chargement des tâches."))
      .finally(() => setLoading(false));
  }, []);

  const handleNew = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
    setShowForm(false);
  };

  const openModal = (id: string) => {
    setSelectedTaskId(id);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedTaskId(null);
  };

  if (loading) return <p>Chargement des tâches…</p>;

  const displayed = tasks
    .filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(t => priorityFilter === "All" ? true : t.priority === priorityFilter)
    .filter(t => statusFilter === "All" ? true : t.status === statusFilter);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          New Task
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Filters omitted for brevity */}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              {["Title","Project","Assignee","Due","Priority","Status","Actions"].map(h => (
                <th key={h} className="px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map(t => (
              <tr key={t._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{t.title}</td>
                <td className="px-4 py-2">{t.projectId}</td>
                <td className="px-4 py-2">{t.assignedTo}</td>
                <td className="px-4 py-2">{new Date(t.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{t.priority}</td>
                <td className="px-4 py-2">{t.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openModal(t._id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <NewTaskForm onSuccess={handleNew} onClose={() => setShowForm(false)} />}

      {showModal && selectedTaskId && (
        <TaskDetailsModal taskId={selectedTaskId} onClose={closeModal} />
      )}
    </div>
  );
}
