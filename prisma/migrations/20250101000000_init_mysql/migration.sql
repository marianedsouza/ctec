-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senhaHash` VARCHAR(191) NOT NULL,
    `perfil` ENUM('admin', 'editor', 'leitor') NOT NULL DEFAULT 'leitor',
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `tipo` ENUM('area', 'tema') NOT NULL,
    `categoriaPaiId` VARCHAR(191) NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `categorias_slug_key`(`slug`),
    INDEX `categorias_categoriaPaiId_idx`(`categoriaPaiId`),
    INDEX `categorias_tipo_idx`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paginas` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `conteudo` LONGTEXT NOT NULL,
    `visibilidade` ENUM('publico', 'restrito') NOT NULL DEFAULT 'restrito',
    `categoriaId` VARCHAR(191) NOT NULL,
    `autorId` VARCHAR(191) NOT NULL,
    `atualizadoEm` DATETIME(3) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `paginas_slug_key`(`slug`),
    INDEX `paginas_categoriaId_idx`(`categoriaId`),
    INDEX `paginas_autorId_idx`(`autorId`),
    INDEX `paginas_visibilidade_idx`(`visibilidade`),
    FULLTEXT INDEX `paginas_titulo_conteudo_idx`(`titulo`, `conteudo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `versoes_pagina` (
    `id` VARCHAR(191) NOT NULL,
    `paginaId` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `conteudo` LONGTEXT NOT NULL,
    `autorId` VARCHAR(191) NOT NULL,
    `criadaEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `versoes_pagina_paginaId_idx`(`paginaId`),
    INDEX `versoes_pagina_autorId_idx`(`autorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etapas_federalizacao` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `status` ENUM('nao_iniciada', 'em_andamento', 'concluida') NOT NULL DEFAULT 'nao_iniciada',
    `descricao` TEXT NOT NULL,

    INDEX `etapas_federalizacao_ordem_idx`(`ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anexos_rnds` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `nomeOriginal` VARCHAR(191) NOT NULL,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `tamanho` INTEGER NOT NULL,
    `descricao` VARCHAR(191) NOT NULL DEFAULT '',
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `criadoPorId` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `anexos_rnds_ordem_idx`(`ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categorias` ADD CONSTRAINT `categorias_categoriaPaiId_fkey` FOREIGN KEY (`categoriaPaiId`) REFERENCES `categorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paginas` ADD CONSTRAINT `paginas_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paginas` ADD CONSTRAINT `paginas_autorId_fkey` FOREIGN KEY (`autorId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `versoes_pagina` ADD CONSTRAINT `versoes_pagina_paginaId_fkey` FOREIGN KEY (`paginaId`) REFERENCES `paginas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `versoes_pagina` ADD CONSTRAINT `versoes_pagina_autorId_fkey` FOREIGN KEY (`autorId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anexos_rnds` ADD CONSTRAINT `anexos_rnds_criadoPorId_fkey` FOREIGN KEY (`criadoPorId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

