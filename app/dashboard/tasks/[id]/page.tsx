import { Metadata } from "next";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

export const metadata: Metadata = {
  title: "Détails de la tâche",
};

const TaskDetailsPage = ({ params }: Props) => {
  return (
    <div>
      <h1>Détails de la tâche</h1>
      <p>ID : {params.id}</p>
    </div>
  );
};

export default TaskDetailsPage;
