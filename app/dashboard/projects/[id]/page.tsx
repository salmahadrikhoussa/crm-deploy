// ✅ app/dashboard/projects/[id]/page.tsx (Details View as a Popup)
"use client";

import { useParams } from "next/navigation";
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

export default function ProjectDetailPopup() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(() => setError("Failed to load project."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!project) return <p className="text-red-600">Project not found</p>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Project Details</h1>
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-2">
        <li><strong>Name:</strong> {project.name}</li>
        <li><strong>Client ID:</strong> {project.clientId}</li>
        <li><strong>Owner:</strong> {project.owner}</li>
        <li><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</li>
        <li><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</li>
        <li><strong>Status:</strong> {project.status}</li>
      </ul>
    </div>
  );
}
