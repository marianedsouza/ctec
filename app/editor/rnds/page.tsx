// Rota restrita: gestão das etapas de federalização da RNDS (área /editor).
// Autorização aplicada NO SERVIDOR via exigirPermissao("editar_pagina").
// Requirements 2.4, 8.2, 8.5.

import Link from "next/link";
import { exigirPermissao } from "@/lib/services/auth";
import { listarEtapas } from "@/lib/services/rnds";
import GerenciadorEtapasRnds from "@/app/components/GerenciadorEtapasRnds";

export const dynamic = "force-dynamic";

export default async function EditorRndsPage() {
  await exigirPermissao("editar_pagina");

  const etapas = await listarEtapas();

  return (
    <main>
      <h1>Gerenciar etapas da federalização da RNDS</h1>
      <p style={{ fontStyle: "italic", color: "#555" }}>
        As etapas são orientadas a dados: crie, edite ou remova sem alterar
        código. Mantenha os valores alinhados ao documento oficial de adesão da
        SES-MS/DATASUS. Enquanto não houver cronograma confirmado, trate as
        etapas de exemplo como ilustrativas.
      </p>
      <p>
        <Link href="/rnds">Ver seção pública da RNDS</Link>
      </p>

      <GerenciadorEtapasRnds etapas={etapas} />
    </main>
  );
}
