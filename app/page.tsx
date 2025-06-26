import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // Mets ici le chemin exact si différent
}
