"use client";

import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  clientId: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface Props {
  id: string;
  onClose: () => void;
}

export default function ProjectDetailsModal({ id, onClose }: Props) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">Loading…</div>;
  if (!project) return <div>Error loading project</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl">&times;</button>
        <h2 className="text-xl font-bold mb-4">Project Details</h2>
        <ul className="space-y-2">
          <li><strong>Name:</strong> {project.name}</li>
          <li><strong>Client ID:</strong> {project.clientId}</li>
          <li><strong>Owner:</strong> {project.owner}</li>
          <li><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</li>
          <li><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</li>
          <li><strong>Status:</strong> {project.status}</li>
        </ul>
      </div>
    </div>
  );
}

