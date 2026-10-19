// Redireciona a rota legada /rnds para a landing page única em "/".
import { redirect } from "next/navigation";

export default function RndsPage() {
  redirect("/");
}
