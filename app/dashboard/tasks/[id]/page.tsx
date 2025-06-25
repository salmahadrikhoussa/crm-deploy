import React from "react";

// 👇 aucun typage personnalisé ici, tout est inline comme le veut Next.js
export default function TaskDetailsPage({
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
