-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('admin', 'editor', 'leitor');

-- CreateEnum
CREATE TYPE "TipoCategoria" AS ENUM ('area', 'tema');

-- CreateEnum
CREATE TYPE "Visibilidade" AS ENUM ('publico', 'restrito');

-- CreateEnum
CREATE TYPE "StatusEtapa" AS ENUM ('nao_iniciada', 'em_andamento', 'concluida');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL DEFAULT 'leitor',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tipo" "TipoCategoria" NOT NULL,
    "categoriaPaiId" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paginas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "visibilidade" "Visibilidade" NOT NULL DEFAULT 'restrito',
    "categoriaId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "paginas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versoes_pagina" (
    "id" TEXT NOT NULL,
    "paginaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "versoes_pagina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etapas_federalizacao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "status" "StatusEtapa" NOT NULL DEFAULT 'nao_iniciada',
    "descricao" TEXT NOT NULL,
    CONSTRAINT "etapas_federalizacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "categorias_categoriaPaiId_idx" ON "categorias"("categoriaPaiId");

-- CreateIndex
CREATE INDEX "categorias_tipo_idx" ON "categorias"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "paginas_slug_key" ON "paginas"("slug");

-- CreateIndex
CREATE INDEX "paginas_categoriaId_idx" ON "paginas"("categoriaId");

-- CreateIndex
CREATE INDEX "paginas_autorId_idx" ON "paginas"("autorId");

-- CreateIndex
CREATE INDEX "paginas_visibilidade_idx" ON "paginas"("visibilidade");

-- CreateIndex
CREATE INDEX "versoes_pagina_paginaId_idx" ON "versoes_pagina"("paginaId");

-- CreateIndex
CREATE INDEX "versoes_pagina_autorId_idx" ON "versoes_pagina"("autorId");

-- CreateIndex
CREATE INDEX "etapas_federalizacao_ordem_idx" ON "etapas_federalizacao"("ordem");

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_categoriaPaiId_fkey" FOREIGN KEY ("categoriaPaiId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paginas" ADD CONSTRAINT "paginas_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paginas" ADD CONSTRAINT "paginas_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versoes_pagina" ADD CONSTRAINT "versoes_pagina_paginaId_fkey" FOREIGN KEY ("paginaId") REFERENCES "paginas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versoes_pagina" ADD CONSTRAINT "versoes_pagina_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
