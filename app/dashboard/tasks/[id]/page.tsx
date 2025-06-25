import { notFound } from "next/navigation";

interface TaskDetailsPageProps {
  params: { id: string };
}

async function getTask(id: string) {
  const res = await fetch(`${process.env.API_URL}/api/tasks/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function TaskDetailsPage({ params }: TaskDetailsPageProps) {
  const task = await getTask(params.id);

  if (!task) return notFound();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Détails de la tâche</h1>
      <p>ID : {task.id}</p>
      <p>Titre : {task.title}</p>
      <p>Description : {task.description}</p>
    </div>
  );
}
