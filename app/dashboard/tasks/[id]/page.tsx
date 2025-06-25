// app/dashboard/tasks/[id]/page.tsx

import React from "react";

// 👇 Ceci indique à Next.js de ne PAS faire du static rendering
export const dynamic = "force-dynamic";

// ✅ Typage correct, et rien d'async ici
export default function TaskDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Détails de la tâche</h1>
      <p>ID : {params.id}</p>
    </div>
  );
}
