import React from "react";

type Props = {
  params: {
    id: string;
  };
};

// ✅ il faut rendre la fonction `async`, même si tu ne fais pas d'appel réseau
const TaskDetailsPage = async ({ params }: Props) => {
  return (
    <div>
      <h1>Détails de la tâche</h1>
      <p>ID : {params.id}</p>
    </div>
  );
};

export default TaskDetailsPage;
