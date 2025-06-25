import { FC } from "react";

// ✅ Ceci est requis par Next.js pour comprendre que c'est une page dynamique
export const dynamicParams = true;

interface TaskDetailsPageProps {
  params: {
    id: string;
  };
}

const TaskDetailsPage: FC<TaskDetailsPageProps> = ({ params }) => {
  return (
    <div>
      <h1>Détails de la tâche</h1>
      <p>ID : {params.id}</p>
    </div>
  );
};

export default TaskDetailsPage;
