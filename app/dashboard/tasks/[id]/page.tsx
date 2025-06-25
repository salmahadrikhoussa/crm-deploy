import React from "react";

type TaskDetailsPageProps = {
  params: {
    id: string;
  };
};

const TaskDetailsPage = ({ params }: TaskDetailsPageProps) => {
  return (
    <div>
      <h1>Détails de la tâche</h1>
      <p>ID : {params.id}</p>
    </div>
  );
};

export default TaskDetailsPage;
