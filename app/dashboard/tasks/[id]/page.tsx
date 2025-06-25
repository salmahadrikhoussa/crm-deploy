import React from "react";

// ✅ Step 2: Add this line at the top of the file
export const dynamic = "force-dynamic";

// ✅ Step 3: Make sure this function is correctly typed
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
