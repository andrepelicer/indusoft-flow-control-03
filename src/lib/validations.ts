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

// Validação para Vendedor
export const vendedorSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().min(11, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  comissao: z.number().min(0).max(100, "Comissão deve estar entre 0% e 100%"),
  status: z.enum(["Ativo", "Inativo"]),
  dataAdmissao: z.string().min(1, "Data de admissão é obrigatória")
})

// Validação para Tabela de Preços
export const tabelaPrecoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().optional(),
  ativa: z.boolean(),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataFim: z.string().optional()
})

// Validação para Item da Tabela de Preços
export const itemTabelaPrecoSchema = z.object({
  produtoId: z.number().min(1, "Produto é obrigatório"),
  preco: z.number().min(0, "Preço deve ser positivo"),
  desconto: z.number().min(0).max(100, "Desconto deve estar entre 0% e 100%").optional()
})

// Validação para Pedido
export const pedidoSchema = z.object({
  numero: z.string().min(1, "Número do pedido é obrigatório"),
  clienteId: z.number().min(1, "Cliente é obrigatório"),
  vendedorId: z.number().min(1, "Vendedor é obrigatório"),
  dataPedido: z.string().min(1, "Data do pedido é obrigatória"),
  dataEntrega: z.string().optional(),
  status: z.enum(["Pendente", "Aprovado", "Faturado", "Cancelado"]),
  observacoes: z.string().optional(),
  desconto: z.number().min(0).max(100, "Desconto deve estar entre 0% e 100%").optional(),
  valorTotal: z.number().min(0, "Valor total deve ser positivo")
})

// Validação para Item do Pedido
export const itemPedidoSchema = z.object({
  produtoId: z.number().min(1, "Produto é obrigatório"),
  quantidade: z.number().min(1, "Quantidade deve ser positiva"),
  precoUnitario: z.number().min(0, "Preço unitário deve ser positivo"),
  desconto: z.number().min(0).max(100, "Desconto deve estar entre 0% e 100%").optional()
})

// Validação para Orçamento
export const orcamentoSchema = z.object({
  numero: z.string().min(1, "Número do orçamento é obrigatório"),
  clienteId: z.number().min(1, "Cliente é obrigatório"),
  vendedorId: z.number().min(1, "Vendedor é obrigatório"),
  dataOrcamento: z.string().min(1, "Data do orçamento é obrigatória"),
  validadeOrcamento: z.string().min(1, "Data de validade é obrigatória"),
  status: z.enum(["Pendente", "Aprovado", "Rejeitado", "Expirado"]),
  observacoes: z.string().optional(),
  desconto: z.number().min(0).max(100, "Desconto deve estar entre 0% e 100%").optional(),
  valorTotal: z.number().min(0, "Valor total deve ser positivo")
})

// Validação para Item do Orçamento
export const itemOrcamentoSchema = z.object({
  produtoId: z.number().min(1, "Produto é obrigatório"),
  quantidade: z.number().min(1, "Quantidade deve ser positiva"),
  precoUnitario: z.number().min(0, "Preço unitário deve ser positivo"),
  desconto: z.number().min(0).max(100, "Desconto deve estar entre 0% e 100%").optional()
})

// Adicionando tipos para itens com dados expandidos
export type ItemPedidoExpandido = ItemPedido & {
  id?: number
  produto?: {
    id: number
    nome: string
    codigo: string
    precoVenda: number
  }
  subtotal?: number
}

export type ItemOrcamentoExpandido = ItemOrcamento & {
  id?: number
  produto?: {
    id: number
    nome: string
    codigo: string
    precoVenda: number
  }
  subtotal?: number
}

export type Cliente = z.infer<typeof clienteSchema>
export type Fornecedor = z.infer<typeof fornecedorSchema>
export type Produto = z.infer<typeof produtoSchema>
export type Vendedor = z.infer<typeof vendedorSchema>
export type TabelaPreco = z.infer<typeof tabelaPrecoSchema>
export type ItemTabelaPreco = z.infer<typeof itemTabelaPrecoSchema>
export type Pedido = z.infer<typeof pedidoSchema>
export type ItemPedido = z.infer<typeof itemPedidoSchema>
export type Orcamento = z.infer<typeof orcamentoSchema>
export type ItemOrcamento = z.infer<typeof itemOrcamentoSchema>
