
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Search, Settings } from "lucide-react"
import { ItemPedidoExpandido } from "@/lib/validations"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"

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
  const [novoItem, setNovoItem] = useState<Partial<ItemPedidoExpandido>>({
    produtoId: undefined,
    quantidade: 1,
    precoUnitario: 0,
    desconto: 0
  })
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [ordemProducaoDialog, setOrdemProducaoDialog] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState<ItemPedidoExpandido | null>(null)

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
    setSearchValue("")
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
    setSearchValue(`${produto.codigo} - ${produto.nome}`)
    setOpen(false)
  }

  const gerarOrdemProducao = (item: ItemPedidoExpandido) => {
    // Aqui seria a integração real com o sistema de ordens de produção
    console.log('Gerando ordem de produção para:', item)
    
    const novaOrdem = {
      id: Date.now(),
      numero: `OP-${Date.now()}`,
      produtoId: item.produtoId,
      produto: item.produto?.nome,
      quantidade: item.quantidade,
      status: 'Pendente',
      dataCriacao: new Date().toISOString().split('T')[0],
      dataPrevisao: '',
      observacoes: `Ordem gerada automaticamente do pedido de venda`
    }
    
    // Simulação de salvamento
    alert(`Ordem de Produção ${novaOrdem.numero} criada com sucesso!`)
    setOrdemProducaoDialog(false)
    setItemSelecionado(null)
  }

  const produtosFiltrados = produtosMock.filter(produto =>
    produto.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchValue.toLowerCase())
  )

  console.log('Search value:', searchValue)
  console.log('Produtos filtrados:', produtosFiltrados)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulário para adicionar novo item */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 p-4 border rounded-lg">
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {searchValue || "Buscar produto..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Digite o nome ou código do produto..." 
                    value={searchValue}
                    onValueChange={(value) => {
                      console.log('CommandInput value changed:', value)
                      setSearchValue(value)
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                    <CommandGroup>
                      {produtosFiltrados.map((produto) => (
                        <CommandItem
                          key={produto.id}
                          value={`${produto.codigo} ${produto.nome}`}
                          onSelect={() => selecionarProduto(produto)}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{produto.nome}</span>
                            <span className="text-sm text-muted-foreground">
                              {produto.codigo} - R$ {produto.precoVenda.toFixed(2)}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
                        onClick={() => {
                          setItemSelecionado(item)
                          setOrdemProducaoDialog(true)
                        }}
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerar Ordem de Produção</DialogTitle>
              <DialogDescription>
                Deseja criar uma ordem de produção para este item?
              </DialogDescription>
            </DialogHeader>
            
            {itemSelecionado && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Item Selecionado:</h4>
                  <p><strong>Produto:</strong> {itemSelecionado.produto?.nome}</p>
                  <p><strong>Código:</strong> {itemSelecionado.produto?.codigo}</p>
                  <p><strong>Quantidade:</strong> {itemSelecionado.quantidade}</p>
                  <p><strong>Preço Unitário:</strong> R$ {itemSelecionado.precoUnitario.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOrdemProducaoDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => gerarOrdemProducao(itemSelecionado)}>
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
