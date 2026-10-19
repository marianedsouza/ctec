import { PrismaClient, TipoCategoria, StatusEtapa } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../lib/slug";

const prisma = new PrismaClient();

/**
 * Cria (ou atualiza) o usuário administrador inicial usando as variáveis de
 * ambiente ADMIN_EMAIL/ADMIN_SENHA. Sem esse usuário não é possível entrar na
 * área restrita (login por credenciais contra a tabela `usuarios`).
 */
async function upsertAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@saude.ms.gov.br").trim().toLowerCase();
  const senha = process.env.ADMIN_SENHA ?? "Ses@2026";
  const senhaHash = await bcrypt.hash(senha, 10);

  await prisma.usuario.upsert({
    where: { email },
    update: { nome: "Administrador SES-MS", perfil: "admin", senhaHash },
    create: {
      nome: "Administrador SES-MS",
      email,
      senhaHash,
      perfil: "admin",
    },
  });

  console.log(`Seed: usuário administrador garantido -> ${email}`);
}

/**
 * Cria (ou atualiza) uma categoria de forma idempotente usando o slug único.
 */
async function upsertCategoria(dados: {
  nome: string;
  tipo: TipoCategoria;
  categoriaPaiId: string | null;
  ordem: number;
}) {
  const slug = slugify(dados.nome);
  return prisma.categoria.upsert({
    where: { slug },
    update: {
      nome: dados.nome,
      tipo: dados.tipo,
      categoriaPaiId: dados.categoriaPaiId,
      ordem: dados.ordem,
    },
    create: {
      nome: dados.nome,
      slug,
      tipo: dados.tipo,
      categoriaPaiId: dados.categoriaPaiId,
      ordem: dados.ordem,
    },
  });
}

async function main() {
  console.log("Seed: garantindo usuário administrador...");
  await upsertAdmin();

  console.log("Seed: criando árvore de categorias...");

  // --- Dimensão "área": áreas de atuação da SES-MS ---
  const areasRaiz = await upsertCategoria({
    nome: "Áreas de Atuação",
    tipo: TipoCategoria.area,
    categoriaPaiId: null,
    ordem: 0,
  });

  const areas = [
    "Atenção Primária à Saúde",
    "Vigilância em Saúde",
    "Assistência Farmacêutica",
    "Gestão e Planejamento",
    "Tecnologia da Informação em Saúde",
  ];

  for (const [indice, nome] of areas.entries()) {
    await upsertCategoria({
      nome,
      tipo: TipoCategoria.area,
      categoriaPaiId: areasRaiz.id,
      ordem: indice,
    });
  }

  // --- Dimensão "tema": temas transversais, incluindo a RNDS ---
  const temasRaiz = await upsertCategoria({
    nome: "Temas",
    tipo: TipoCategoria.tema,
    categoriaPaiId: null,
    ordem: 1,
  });

  const temaRnds = await upsertCategoria({
    nome: "RNDS",
    tipo: TipoCategoria.tema,
    categoriaPaiId: temasRaiz.id,
    ordem: 0,
  });

  // Subtemas da RNDS
  const subtemasRnds = [
    "O que é a RNDS",
    "Federalização da RNDS",
    "Etapas da Federalização em MS",
  ];

  for (const [indice, nome] of subtemasRnds.entries()) {
    await upsertCategoria({
      nome,
      tipo: TipoCategoria.tema,
      categoriaPaiId: temaRnds.id,
      ordem: indice,
    });
  }

  console.log("Seed: criando etapas da federalização (Plano de Trabalho V.2)...");

  // --- Etapas estaduais conforme o Plano de Trabalho da Federalização da RNDS
  // --- (V.2 — Estado: Mato Grosso do Sul, 2026). Continuam editáveis via
  // --- /editor/rnds sem necessidade de alterar código.
  const etapas = [
    {
      nome: "Acesso e extração de dados (Bucket S3)",
      ordem: 1,
      status: StatusEtapa.em_andamento,
      descricao:
        "Fase de preparação e homologação (2026-2027), seguida da integração e carga histórica (até 2028), com acesso ao bucket S3 de extração de dados da RNDS.",
    },
    {
      nome: "Tratamento dos dados da RNDS",
      ordem: 2,
      status: StatusEtapa.nao_iniciada,
      descricao:
        "Padronização, qualidade e segurança dos dados extraídos, preparando-os para a geração de indicadores.",
    },
    {
      nome: "Disseminação e uso dos dados da RNDS",
      ordem: 3,
      status: StatusEtapa.nao_iniciada,
      descricao:
        "Ampliação de parcerias e uso estratégico dos dados para gestão e vigilância em saúde em Mato Grosso do Sul.",
    },
  ];

  for (const etapa of etapas) {
    // Idempotência: evita duplicar etapas com o mesmo nome ao rodar o seed novamente.
    const existente = await prisma.etapaFederalizacao.findFirst({
      where: { nome: etapa.nome },
    });

    if (existente) {
      await prisma.etapaFederalizacao.update({
        where: { id: existente.id },
        data: etapa,
      });
    } else {
      await prisma.etapaFederalizacao.create({ data: etapa });
    }
  }

  console.log("Seed concluído com sucesso.");
}

main()
  .catch((erro) => {
    console.error("Erro ao executar o seed:", erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
