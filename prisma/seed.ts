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

  console.log("Seed: criando etapas de federalização de exemplo...");

  // --- Etapas de federalização (dados de exemplo, editáveis depois) ---
  const etapas = [
    {
      nome: "Adesão e formalização com o DATASUS",
      ordem: 0,
      status: StatusEtapa.concluida,
      descricao:
        "Assinatura do termo de adesão da SES-MS ao modelo federado da RNDS junto ao DATASUS.",
    },
    {
      nome: "Provisionamento da instância estadual",
      ordem: 1,
      status: StatusEtapa.em_andamento,
      descricao:
        "Configuração da infraestrutura e da instância federada da RNDS para o estado de MS.",
    },
    {
      nome: "Integração dos sistemas locais",
      ordem: 2,
      status: StatusEtapa.nao_iniciada,
      descricao:
        "Conexão dos sistemas municipais e estaduais à instância federada, com envio de dados no padrão HL7 FHIR.",
    },
    {
      nome: "Homologação e sincronização com a base nacional",
      ordem: 3,
      status: StatusEtapa.nao_iniciada,
      descricao:
        "Validação da interoperabilidade e sincronização contínua com a base nacional da RNDS.",
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
