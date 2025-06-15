
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Search, Settings, X, Factory, FactoryIcon } from "lucide-react"
import { ItemPedidoExpandido } from "@/lib/validations"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useOrdensProducao } from "@/contexts/OrdensProducaoContext"

interface ItemPedidoManagerProps {
  itens: ItemPedidoExpandido[]
  onItensChange: (itens: ItemPedidoExpandido[]) => void
  onTotalChange: (total: number) => void
}

// Mock de produtos centralizado - ÚNICA FONTE DA VERDADE
const PRODUTOS_DATABASE = [
  { id: 1, nome: "Chapa de Aço 1mm", codigo: "CH001", precoVenda: 120.00 },
  { id: 2, nome: "Perfil L 50x50x3", codigo: "PF002", precoVenda: 45.50 },
  { id: 3, nome: "Tubo Redondo 2\"", codigo: "TR003", precoVenda: 89.90 },
  { id: 4, nome: "Solda Eletrodo 3,25mm", codigo: "SO004", precoVenda: 25.80 },
  { id: 5, nome: "Tinta Anticorrosiva", codigo: "TI005", precoVenda: 67.30 },
  { id: 6, nome: "Parafuso M8x25", codigo: "PA006", precoVenda: 1.20 },
  { id: 7, nome: "Porca M8", codigo: "PO007", precoVenda: 0.80 },
  { id: 8, nome: "Arruela Lisa M8", codigo: "AR008", precoVenda: 0.25 },
  { id: 9, nome: "Chapa Galvanizada 2mm", codigo: "CG009", precoVenda: 180.00 },
  { id: 10, nome: "Barra Redonda 12mm", codigo: "BR010", precoVenda: 35.60 }
] as const

// Gerador de ID único para itens do pedido
let nextItemId = Date.now()

export function ItemPedidoManager({ itens, onItensChange, onTotalChange }: ItemPedidoManagerProps) {
  const { toast } = useToast()
  const { adicionarOrdem, removerOrdem, ordens } = useOrdensProducao()
  const [novoItem, setNovoItem] = useState<Partial<ItemPedidoExpandido>>({
    produtoId: undefined,
    quantidade: 1,
    precoUnitario: 0,
    desconto: 0
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  // Função para buscar produto com garantia de dados corretos
  const buscarProdutoPorId = (produtoId: number) => {
    const produto = PRODUTOS_DATABASE.find(p => p.id === produtoId)
    if (!produto) {
      console.error(`❌ Produto ID ${produtoId} não encontrado no banco de dados`)
      return null
    }
    return { ...produto } // Retorna uma cópia para evitar mutação
  }

  const calcularSubtotal = (item: ItemPedidoExpandido) => {
    const subtotal = item.quantidade * item.precoUnitario
    const desconto = (subtotal * (item.desconto || 0)) / 100
    return subtotal - desconto
  }

  const calcularTotal = (itensAtuais: ItemPedidoExpandido[]) => {
    return itensAtuais.reduce((total, item) => total + calcularSubtotal(item), 0)
  }

  const adicionarItem = () => {
    console.log('=== ADICIONANDO NOVO ITEM ===')
    console.log('Dados do novo item:', novoItem)
    
    if (!novoItem.produtoId || novoItem.produtoId === 0 || !novoItem.quantidade || novoItem.quantidade <= 0 || !novoItem.precoUnitario || novoItem.precoUnitario <= 0) {
      console.log('❌ Validação falhou:', novoItem)
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }

    const produto = buscarProdutoPorId(novoItem.produtoId)
    if (!produto) {
      toast({
        title: "Erro",
        description: "Produto selecionado não é válido.",
        variant: "destructive"
      })
      return
    }

    const itemId = ++nextItemId

    const itemCompleto: ItemPedidoExpandido = {
      id: itemId,
      produtoId: produto.id,
      quantidade: novoItem.quantidade || 1,
      precoUnitario: novoItem.precoUnitario || 0,
      desconto: novoItem.desconto || 0,
      produto: produto,
      subtotal: 0
    }

    itemCompleto.subtotal = calcularSubtotal(itemCompleto)

    console.log('✅ Item criado com sucesso:', {
      itemId: itemCompleto.id,
      produtoId: itemCompleto.produtoId,
      produtoNome: itemCompleto.produto.nome,
      verificacaoIntegridade: itemCompleto.produtoId === itemCompleto.produto.id
    })

    const novosItens = [...itens, itemCompleto]
    onItensChange(novosItens)
    onTotalChange(calcularTotal(novosItens))

    // Reset form
    setNovoItem({
      produtoId: undefined,
      quantidade: 1,
      precoUnitario: 0,
      desconto: 0
    })
    setSearchTerm("")
    setShowDropdown(false)
    
    toast({
      title: "Item adicionado",
      description: `${produto.nome} foi adicionado ao pedido.`,
    })
  }

  const removerItem = (id: number) => {
    console.log('=== REMOVENDO ITEM ===')
    console.log('ID do item a remover:', id)
    
    const item = itens.find(item => item.id === id)
    if (!item) {
      console.log('❌ Item não encontrado para remoção')
      return
    }
    
    const novosItens = itens.filter(item => item.id !== id)
    onItensChange(novosItens)
    onTotalChange(calcularTotal(novosItens))
    
    // Remove a ordem de produção se existir
    const ordemExistente = ordens.find(ordem => ordem.produtoId === item.produtoId)
    if (ordemExistente) {
      console.log('Removendo ordem de produção:', ordemExistente.id)
      removerOrdem(ordemExistente.id)
    }
    
    toast({
      title: "Item removido",
      description: `${item.produto?.nome || 'Item'} foi removido do pedido.`,
    })
  }

  const atualizarItem = (id: number, campo: keyof ItemPedidoExpandido, valor: any) => {
    console.log('=== ATUALIZANDO ITEM ===')
    console.log('Item ID:', id, 'Campo:', campo, 'Novo valor:', valor)
    
    const novosItens = itens.map(item => {
      if (item.id === id) {
        const itemAtualizado = { ...item, [campo]: valor }
        
        // Se o produto foi alterado, garantir integridade total
        if (campo === 'produtoId') {
          const produto = buscarProdutoPorId(valor)
          if (produto) {
            itemAtualizado.produto = produto
            itemAtualizado.precoUnitario = produto.precoVenda
            console.log('✅ Produto alterado com integridade garantida:', {
              produtoId: itemAtualizado.produtoId,
              produtoNome: itemAtualizado.produto.nome,
              verificacao: itemAtualizado.produtoId === itemAtualizado.produto.id
            })
          } else {
            console.error('❌ Erro ao alterar produto - produto não encontrado')
            return item // Retorna item sem alteração
          }
        }
        
        itemAtualizado.subtotal = calcularSubtotal(itemAtualizado)
        return itemAtualizado
      }
      return item
    })
    onItensChange(novosItens)
    onTotalChange(calcularTotal(novosItens))
  }

  const selecionarProduto = (produto: typeof PRODUTOS_DATABASE[number]) => {
    console.log('✅ Produto selecionado:', produto.nome)
    setNovoItem({
      ...novoItem,
      produtoId: produto.id,
      precoUnitario: produto.precoVenda
    })
    setSearchTerm(`${produto.codigo} - ${produto.nome}`)
    setShowDropdown(false)
  }

  const limparSelecao = () => {
    setNovoItem({
      ...novoItem,
      produtoId: undefined,
      precoUnitario: 0
    })
    setSearchTerm("")
    setShowDropdown(false)
  }

  const gerarOrdemProducao = (item: ItemPedidoExpandido) => {
    console.log('Gerando ordem de produção para item:', item.id)
    
    if (!item || !item.produto) {
      console.error('❌ Item ou produto inválido:', item)
      toast({
        title: "Erro",
        description: "Item inválido para gerar ordem de produção.",
        variant: "destructive"
      })
      return
    }

    // Verifica se já existe uma ordem para este produto
    const ordemExistente = ordens.find(ordem => ordem.produtoId === item.produtoId)
    if (ordemExistente) {
      console.log('⚠️ Ordem já existe:', ordemExistente.numero)
      toast({
        title: "Ordem já existe",
        description: `Já existe uma ordem de produção para ${item.produto.nome}.`,
        variant: "destructive"
      })
      return
    }

    try {
      const novaOrdem = adicionarOrdem({
        numero: `OP-${Date.now()}`,
        produtoId: item.produtoId,
        produto: item.produto.nome,
        codigo: item.produto.codigo,
        quantidade: item.quantidade,
        status: 'Pendente',
        dataCriacao: new Date().toISOString().split('T')[0],
        dataPrevisao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        observacoes: `Ordem gerada automaticamente do pedido de venda para ${item.produto.nome}`
      })
      
      console.log('✅ Ordem de Produção criada:', novaOrdem.numero)
      
      toast({
        title: "Ordem de Produção Criada",
        description: `Ordem ${novaOrdem.numero} criada com sucesso para ${novaOrdem.produto}!`,
      })
    } catch (error) {
      console.error('❌ Erro ao criar ordem de produção:', error)
      toast({
        title: "Erro",
        description: "Erro ao criar ordem de produção.",
        variant: "destructive"
      })
    }
  }

  const cancelarOrdemProducao = (item: ItemPedidoExpandido) => {
    console.log('Cancelando ordem de produção para item:', item.id)
    
    const ordemExistente = ordens.find(ordem => ordem.produtoId === item.produtoId)
    if (ordemExistente) {
      console.log('✅ Removendo ordem existente:', ordemExistente.numero)
      removerOrdem(ordemExistente.id)
      
      toast({
        title: "Ordem de Produção Cancelada",
        description: `Ordem de produção cancelada para ${item.produto?.nome}!`,
      })
    } else {
      console.log('⚠️ Nenhuma ordem encontrada para cancelar')
      toast({
        title: "Aviso",
        description: "Nenhuma ordem de produção encontrada para este item.",
        variant: "destructive"
      })
    }
  }

  const produtosFiltrados = PRODUTOS_DATABASE.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const produtoSelecionado = novoItem.produtoId ? PRODUTOS_DATABASE.find(p => p.id === novoItem.produtoId) : null

  // Verifica se um item tem ordem de produção
  const itemTemOrdemProducao = (item: ItemPedidoExpandido) => {
    return ordens.some(ordem => ordem.produtoId === item.produtoId)
  }

  // Função para garantir que o produto está correto
  const obterProdutoSeguro = (item: ItemPedidoExpandido) => {
    // Sempre buscar o produto atual do banco de dados para garantir consistência
    const produtoAtual = buscarProdutoPorId(item.produtoId)
    
    if (produtoAtual) {
      console.log(`✅ Produto correto obtido para item ${item.id}:`, produtoAtual.nome)
      return produtoAtual
    }
    
    // Fallback - usar dados salvos se disponível
    if (item.produto) {
      console.warn(`⚠️ Usando produto salvo para item ${item.id}:`, item.produto.nome)
      return item.produto
    }
    
    // Último recurso
    console.error(`❌ Nenhum produto encontrado para item ${item.id}`)
    return {
      id: item.produtoId,
      nome: `Produto ID ${item.produtoId}`,
      codigo: 'N/A',
      precoVenda: item.precoUnitario || 0
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulário para adicionar novo item */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 p-4 border rounded-lg">
          <div className="relative">
            <div className="flex">
              <Input
                placeholder="Buscar produto por nome ou código..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
                className="pr-8"
              />
              {produtoSelecionado && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limparSelecao}
                  className="ml-1 h-10 w-10 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {showDropdown && searchTerm && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map((produto) => (
                    <div
                      key={produto.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => selecionarProduto(produto)}
                    >
                      <div className="font-medium">{produto.nome}</div>
                      <div className="text-sm text-gray-500">
                        {produto.codigo} - R$ {produto.precoVenda.toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500 text-center">
                    Nenhum produto encontrado
                  </div>
                )}
              </div>
            )}
            
            {produtoSelecionado && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <strong>Selecionado:</strong> {produtoSelecionado.nome} ({produtoSelecionado.codigo})
              </div>
            )}
          </div>
          
          <div>
            <Input
              type="number"
              placeholder="Qtd"
              min="1"
              value={novoItem.quantidade || ''}
              onChange={(e) => setNovoItem({...novoItem, quantidade: Number(e.target.value)})}
            />
          </div>
          <div>
            <Input
              type="number"
              step="0.01"
              placeholder="Preço"
              min="0"
              value={novoItem.precoUnitario || ''}
              onChange={(e) => setNovoItem({...novoItem, precoUnitario: Number(e.target.value)})}
            />
          </div>
          <div>
            <Input
              type="number"
              step="0.01"
              placeholder="Desc %"
              min="0"
              max="100"
              value={novoItem.desconto || ''}
              onChange={(e) => setNovoItem({...novoItem, desconto: Number(e.target.value)})}
            />
          </div>
          <div className="md:col-span-2">
            <Button 
              onClick={adicionarItem} 
              className="w-full"
              disabled={!novoItem.produtoId || !novoItem.quantidade || !novoItem.precoUnitario}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Tabela de itens */}
        {itens.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead>Preço Unit.</TableHead>
                <TableHead>Desc %</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Status OP</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.map((item) => {
                const produtoSeguro = obterProdutoSeguro(item)
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{produtoSeguro.nome}</div>
                        <div className="text-sm text-muted-foreground">{produtoSeguro.codigo}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => atualizarItem(item.id!, 'quantidade', Number(e.target.value))}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.precoUnitario}
                        onChange={(e) => atualizarItem(item.id!, 'precoUnitario', Number(e.target.value))}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.desconto || 0}
                        onChange={(e) => atualizarItem(item.id!, 'desconto', Number(e.target.value))}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      R$ {calcularSubtotal(item).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {itemTemOrdemProducao(item) ? (
                        <Badge className="bg-green-100 text-green-800">OP Gerada</Badge>
                      ) : (
                        <Badge variant="secondary">Sem OP</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {!itemTemOrdemProducao(item) ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Gerar Ordem de Produção"
                            onClick={() => gerarOrdemProducao(item)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Cancelar Ordem de Produção"
                            onClick={() => cancelarOrdemProducao(item)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Remover"
                          onClick={() => removerItem(item.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={5} className="font-semibold">Total Geral:</TableCell>
                <TableCell className="font-bold">R$ {calcularTotal(itens).toFixed(2)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {itens.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum item adicionado ao pedido
          </div>
        )}
      </CardContent>
    </Card>
  )
}
