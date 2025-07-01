// app/components/TaskDetailsModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { Task } from '../types/task';

interface Props {
  taskId: string;
  onClose: () => void;
}

export default function TaskDetailsModal({ taskId, onClose }: Props) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;
    console.log("🔍 [TaskDetailsModal] Fetching details for taskId:", taskId);

    setLoading(true);
    fetch(`/api/tasks/${taskId}`)
      .then(res => {
        console.log("[TaskDetailsModal] Fetch response status:", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("[TaskDetailsModal] Received data:", data);
        setTask(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("🚨 [TaskDetailsModal] Error fetching task", taskId, err);
        setError("Erreur de chargement");
        setLoading(false);
      });
  }, [taskId]);

  if (!taskId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black">&times;</button>
        <h2 className="text-xl font-bold mb-4">Détails de la tâche</h2>
        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {task && (
          <div className="space-y-2">
            <p><strong>Titre :</strong> {task.title}</p>
            <p><strong>Description :</strong> {task.description}</p>
            <p><strong>Assignée à :</strong> {task.assignedTo}</p>
            <p><strong>Date limite :</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            <p><strong>Priorité :</strong> {task.priority}</p>
            <p><strong>Statut :</strong> {task.status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
