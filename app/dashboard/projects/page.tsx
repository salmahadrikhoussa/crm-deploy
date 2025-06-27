import { useEffect, useState } from "react";
import Link from "next/link";
import NewProjectForm, { ProjectInput } from "../../components/NewProjectForm";
import ProjectDetailsModal from "../../components/ProjectDetailsModal";

interface Project {
  id: string;
  name: string;
  clientId: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface Client {
  id: string;
  name: string;
}

interface User {
  id: string;
  name?: string;
  email: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then(res => res.json()),
      fetch("/api/clients").then(res => res.json()),
      fetch("/api/users").then(res => res.json()),
    ])
      .then(([projData, clientData, userData]) => {
        setProjects(projData);
        setClients(clientData);
        setUsers(userData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleNew = (newProj: ProjectInput & { id: string }) => {
    setProjects(prev => [...prev, newProj]);
    setShowForm(false);
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || id;
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id;

  if (loading) return <p>Loading projects…</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          New Project
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              {["Name", "Client", "Owner", "Start Date", "End Date", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{getClientName(p.clientId)}</td>
                <td className="px-4 py-2">{getUserName(p.owner)}</td>
                <td className="px-4 py-2">{new Date(p.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(p.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{p.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedId(p.id)}
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

      {showForm && (
        <NewProjectForm
          onSuccess={handleNew}
          onClose={() => setShowForm(false)}
        />
      )}

      {selectedId && (
        <ProjectDetailsModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
