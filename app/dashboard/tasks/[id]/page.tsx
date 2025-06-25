import React from "react";

type Props = {
  params: {
    id: string;
  };
};

// ← ajout de "async"
const TaskDetailsPage = async ({ params }: Props) => {
  return (
    <div>
      <h1>Détails de la tâche</h1>
      <p>ID : {params.id}</p>
    </div>
  );
};

export default TaskDetailsPage;
