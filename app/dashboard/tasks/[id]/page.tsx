'use client';
import { use } from 'react';
import { notFound } from 'next/navigation';

export default function TaskDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const task = use(fetch(`${process.env.API_URL}/api/tasks/${id}`, { cache: 'no-store' }).then(res => {
    if (!res.ok) return notFound();
    return res.json();
  }));

  return (
    <div className="p-4">
      <h1>Détails de {task.title}</h1>
      <p>ID : {task.id}</p>
    </div>
  );
}
