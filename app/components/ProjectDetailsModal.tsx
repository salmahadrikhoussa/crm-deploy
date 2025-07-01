"use client";

import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string; // ✅ included from API
  owner: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface Props {
  projectId: string;
  onClose: () => void;
}

export default function ProjectDetailsModal({ projectId, onClose }: Props) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow">Loading...</div>
    </div>
  );

  if (!project) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow">Project not found</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Project Details</h2>
        <ul className="space-y-2">
          <li><strong>Name:</strong> {project.name}</li>
          <li><strong>Client:</strong> {project.clientName}</li>
          <li><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</li>
          <li><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</li>
          <li><strong>Status:</strong> {project.status}</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
