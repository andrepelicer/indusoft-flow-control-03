import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Search, Settings, X } from "lucide-react"
import { ItemPedidoExpandido } from "@/lib/validations"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface ItemPedidoManagerProps {
  itens: ItemPedidoExpandido[]
  onItensChange: (itens: ItemPedidoExpandido[]) => void
  onTotalChange: (total: number) => void
}

// Mock de produtos - em um sistema real viria da API
const produtosMock = [
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
]

export function ItemPedidoManager({ itens, onItensChange, onTotalChange }: ItemPedidoManagerProps) {
  const { toast } = useToast()
  const [novoItem, setNovoItem] = useState<Partial<ItemPedidoExpandido>>({
    produtoId: undefined,
    quantidade: 1,
    precoUnitario: 0,
    desconto: 0
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [ordemProducaoDialog, setOrdemProducaoDialog] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState<ItemPedidoExpandido | null>(null)
  const [dataPrevisao, setDataPrevisao] = useState("")
  const [observacoesOP, setObservacoesOP] = useState("")

  const calcularSubtotal = (item: ItemPedidoExpandido) => {
    const subtotal = item.quantidade * item.precoUnitario
    const desconto = (subtotal * (item.desconto || 0)) / 100
    return subtotal - desconto
  }

  const calcularTotal = (itensAtuais: ItemPedidoExpandido[]) => {
    return itensAtuais.reduce((total, item) => total + calcularSubtotal(item), 0)
  }

  const adicionarItem = () => {
    if (!novoItem.produtoId || novoItem.produtoId === 0 || !novoItem.quantidade || novoItem.quantidade <= 0 || !novoItem.precoUnitario || novoItem.precoUnitario <= 0) {
      console.log('Validação falhou:', novoItem)
      return
    }

    const produto = produtosMock.find(p => p.id === novoItem.produtoId)
    if (!produto) {
      console.log('Produto não encontrado:', novoItem.produtoId)
      return
    }

    const itemCompleto: ItemPedidoExpandido = {
      id: Date.now(),
      produtoId: novoItem.produtoId,
      quantidade: novoItem.quantidade || 1,
      precoUnitario: novoItem.precoUnitario || 0,
      desconto: novoItem.desconto || 0,
      produto,
      subtotal: 0
    }

    itemCompleto.subtotal = calcularSubtotal(itemCompleto)

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
  }

  const removerItem = (id: number) => {
    const novosItens = itens.filter(item => item.id !== id)
    onItensChange(novosItens)
    onTotalChange(calcularTotal(novosItens))
  }

  const atualizarItem = (id: number, campo: keyof ItemPedidoExpandido, valor: any) => {
    const novosItens = itens.map(item => {
      if (item.id === id) {
        const itemAtualizado = { ...item, [campo]: valor }
        itemAtualizado.subtotal = calcularSubtotal(itemAtualizado)
        return itemAtualizado
      }
      return item
    })
    onItensChange(novosItens)
    onTotalChange(calcularTotal(novosItens))
  }

  const selecionarProduto = (produto: typeof produtosMock[0]) => {
    console.log('Produto selecionado:', produto)
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

  const gerarOrdemProducao = () => {
    if (!itemSelecionado || !dataPrevisao) {
      toast({
        title: "Erro",
        description: "Por favor, preencha a data de previsão.",
        variant: "destructive"
      })
      return
    }

    const novaOrdem = {
      id: Date.now(),
      numero: `OP-${Date.now()}`,
      produtoId: itemSelecionado.produtoId,
      produto: itemSelecionado.produto?.nome,
      codigo: itemSelecionado.produto?.codigo,
      quantidade: itemSelecionado.quantidade,
      status: 'Pendente',
      dataCriacao: new Date().toISOString().split('T')[0],
      dataPrevisao: dataPrevisao,
      observacoes: observacoesOP || `Ordem gerada automaticamente do pedido de venda`
    }
    
    console.log('Ordem de Produção criada:', novaOrdem)
    
    toast({
      title: "Ordem de Produção Criada",
      description: `Ordem ${novaOrdem.numero} criada com sucesso para ${novaOrdem.produto}!`,
    })
    
    // Reset do dialog
    setOrdemProducaoDialog(false)
    setItemSelecionado(null)
    setDataPrevisao("")
    setObservacoesOP("")
  }

  const abrirDialogOrdemProducao = (item: ItemPedidoExpandido) => {
    setItemSelecionado(item)
    setDataPrevisao("")
    setObservacoesOP(`Ordem gerada automaticamente do pedido de venda`)
    setOrdemProducaoDialog(true)
  }

  const produtosFiltrados = produtosMock.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const produtoSelecionado = novoItem.produtoId ? produtosMock.find(p => p.id === novoItem.produtoId) : null

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
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.produto?.nome}</div>
                      <div className="text-sm text-muted-foreground">{item.produto?.codigo}</div>
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
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Gerar Ordem de Produção"
                        onClick={() => abrirDialogOrdemProducao(item)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
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
              ))}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={4} className="font-semibold">Total Geral:</TableCell>
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

        {/* Dialog para Ordem de Produção */}
        <Dialog open={ordemProducaoDialog} onOpenChange={setOrdemProducaoDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Gerar Ordem de Produção</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma ordem de produção para este item.
              </DialogDescription>
            </DialogHeader>
            
            {itemSelecionado && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Item Selecionado:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Produto:</span> {itemSelecionado.produto?.nome}
                    </div>
                    <div>
                      <span className="font-medium">Código:</span> {itemSelecionado.produto?.codigo}
                    </div>
                    <div>
                      <span className="font-medium">Quantidade:</span> {itemSelecionado.quantidade}
                    </div>
                    <div>
                      <span className="font-medium">Valor Unit.:</span> R$ {itemSelecionado.precoUnitario.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Data de Previsão *</label>
                    <Input
                      type="date"
                      value={dataPrevisao}
                      onChange={(e) => setDataPrevisao(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Observações</label>
                    <Input
                      value={observacoesOP}
                      onChange={(e) => setObservacoesOP(e.target.value)}
                      placeholder="Observações para a ordem de produção..."
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setOrdemProducaoDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={gerarOrdemProducao} disabled={!dataPrevisao}>
                    Gerar Ordem de Produção
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
