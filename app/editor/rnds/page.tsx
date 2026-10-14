// Rota restrita: gestão das etapas e anexos da seção RNDS (área /editor).
// Autorização aplicada NO SERVIDOR via exigirPermissao("editar_pagina").
// Requirements 2.4, 8.2, 8.5.

import Link from "next/link";
import { exigirPermissao } from "@/lib/services/auth";
import { listarEtapas } from "@/lib/services/rnds";
import { listarAnexos } from "@/lib/services/anexos-rnds";
import GerenciadorEtapasRnds from "@/app/components/GerenciadorEtapasRnds";
import GerenciadorAnexosRnds from "@/app/components/GerenciadorAnexosRnds";

export const dynamic = "force-dynamic";

export default async function EditorRndsPage() {
  await exigirPermissao("editar_pagina");

  const [etapas, anexos] = await Promise.all([listarEtapas(), listarAnexos()]);

  return (
    <main>
      <div className="page-header">
        <h1>Gerenciar seção pública da RNDS</h1>
        <p className="page-header__lead">
          Etapas e anexos orientados a dados: atualize sem alterar código.
        </p>
      </div>
      <p className="notice">
        Mantenha os valores alinhados ao documento oficial de adesão da SES-MS/DATASUS. Enquanto não
        houver cronograma confirmado, trate as etapas de exemplo como ilustrativas.
      </p>
      <p>
        <Link href="/rnds">Ver seção pública da RNDS</Link>
      </p>

      <GerenciadorEtapasRnds etapas={etapas} />

      <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e4edf2" }} />

      <GerenciadorAnexosRnds anexos={anexos} />
    </main>
  );
}
