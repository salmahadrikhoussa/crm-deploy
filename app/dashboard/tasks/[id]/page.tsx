import React from "react";

const TaskDetailsPage = async ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1>Détails de la tâche</h1>
      <p>ID : {params.id}</p>
    </div>
  );
};

export default TaskDetailsPage;
