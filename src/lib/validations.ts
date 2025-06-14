
import { z } from "zod"

// Validação para Cliente
export const clienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  tipo: z.enum(["PF", "PJ"]),
  documento: z.string().min(11, "Documento inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  limiteCredito: z.number().min(0, "Limite deve ser positivo"),
  status: z.enum(["Ativo", "Inativo"])
})

// Validação para Fornecedor
export const fornecedorSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  categoria: z.string().min(2, "Categoria é obrigatória"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  avaliacao: z.number().min(1).max(5),
  status: z.enum(["Ativo", "Inativo"])
})

// Validação para Produto
export const produtoSchema = z.object({
  codigo: z.string().min(3, "Código deve ter pelo menos 3 caracteres"),
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  categoria: z.string().min(2, "Categoria é obrigatória"),
  unidade: z.string().min(1, "Unidade é obrigatória"),
  precoVenda: z.number().min(0, "Preço deve ser positivo"),
  custoProducao: z.number().min(0, "Custo deve ser positivo"),
  estoque: z.number().min(0, "Estoque deve ser positivo"),
  estoqueMinimo: z.number().min(0, "Estoque mínimo deve ser positivo"),
  status: z.enum(["Ativo", "Inativo"]),
  temFichaTecnica: z.boolean()
})

export type Cliente = z.infer<typeof clienteSchema>
export type Fornecedor = z.infer<typeof fornecedorSchema>
export type Produto = z.infer<typeof produtoSchema>
