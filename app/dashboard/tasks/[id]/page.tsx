import React from "react";

export default async function TaskDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Détails de la tâche</h1>
      <p>ID : {params.id}</p>
    </div>
  );
}
