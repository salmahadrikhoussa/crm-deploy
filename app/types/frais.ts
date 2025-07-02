export interface Frais {
  _id?: string; // MongoDB ID
  montant: number;
  motif: string;
  description?: string;
  justificatifUrl?: string; // path to file
  status: "en_attente" | "approuve" | "refuse";
  date: string; // ISO format
  submittedBy: {
    id: string;
    name: string;
  };
  createdAt: string; // submission date
}
