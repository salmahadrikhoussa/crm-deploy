import React from "react";

interface Props {
  params: { id: string };
}

const TaskDetailsPage = ({ params }: Props) => {
  return (
    <div>
      <h1>Détails de la tâche</h1>
      <p>ID : {params.id}</p>
    </div>
  );
};

export default TaskDetailsPage;