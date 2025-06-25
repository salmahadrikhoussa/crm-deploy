// app/dashboard/tasks/[id]/page.tsx

import { notFound } from "next/navigation";

export default async function TaskDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const res = await fetch(`${process.env.API_URL}/api/tasks/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const task = await res.json();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Détails de la tâche</h1>
      <p>ID : {task.id}</p>
      <p>Titre : {task.title}</p>
      <p>Description : {task.description}</p>
    </div>
  );
}
