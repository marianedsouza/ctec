"use server";

// Server Actions do Serviço de Categorias.
// Aplicam autorização NO SERVIDOR (ação "gerenciar_categoria") antes de
// delegar às operações de mutação do serviço, conforme design.md e
// Requirements 2.4 / 3.1..3.3.

import { revalidatePath } from "next/cache";
import { exigirPermissao } from "@/lib/services/auth";
import {
  criar,
  atualizar,
  remover,
  type Categoria,
} from "@/lib/services/categorias";

export async function criarCategoria(
  dados: Omit<Categoria, "id">
): Promise<Categoria> {
  await exigirPermissao("gerenciar_categoria");
  const categoria = await criar(dados);
  revalidatePath("/categorias");
  return categoria;
}

export async function atualizarCategoria(
  id: string,
  dados: Partial<Categoria>
): Promise<Categoria> {
  await exigirPermissao("gerenciar_categoria");
  const categoria = await atualizar(id, dados);
  revalidatePath("/categorias");
  return categoria;
}

export async function removerCategoria(id: string): Promise<void> {
  await exigirPermissao("gerenciar_categoria");
  await remover(id);
  revalidatePath("/categorias");
}
