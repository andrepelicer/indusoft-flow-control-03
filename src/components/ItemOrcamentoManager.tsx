
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { ItemOrcamentoExpandido } from "@/lib/validations"

interface ItemOrcamentoManagerProps {
  itens: ItemOrcamentoExpandido[]
  onItensChange: (itens: ItemOrcamentoExpandido[]) => void
  onTotalChange: (total: number) => void
}

// Mock de produtos - em um sistema real viria da API
const produtosMock = [
  { id: 1, nome: "Chapa de Aço 1mm", codigo: "CH001", precoVenda: 120.00 },
  { id: 2, nome: "Perfil L 50x50x3", codigo: "PF002", precoVenda: 45.50 },
  { id: 3, nome: "Tubo Redondo 2\"", codigo: "TR003", precoVenda: 89.90 },
  { id: 4, nome: "Solda Eletrodo 3,25mm", codigo: "SO004", precoVenda: 25.80 },
  { id: 5, nome: "Tinta Anticorrosiva", codigo: "TI005", precoVenda: 67.30 }
]

export function ItemOrcamentoManager({ itens, onItensChange, onTotalChange }: ItemOrcamentoManagerProps) {
  const [novoItem, setNovoItem] = useState<Partial<ItemOrcamentoExpandido>>({
    produtoId: 0,
    quantidade: 1,
    precoUnitario: 0,
    desconto: 0
  })

  const calcularSubtotal = (item: ItemOrcamentoExpandido) => {
    const subtotal = item.quantidade * item.precoUnitario
    const desconto = (subtotal * (item.desconto || 0)) / 100
    return subtotal - desconto
  }

  const calcularTotal = (itensAtuais: ItemOrcamentoExpandido[]) => {
    return itensAtuais.reduce((total, item) => total + calcularSubtotal(item), 0)
  }

  const adicionarItem = () => {
    if (!novoItem.produtoId || !novoItem.quantidade || !novoItem.precoUnitario) return

    const produto = produtosMock.find(p => p.id === novoItem.produtoId)
    if (!produto) return

    const itemCompleto: ItemOrcamentoExpandido = {
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
      produtoId: 0,
      quantidade: 1,
      precoUnitario: 0,
      desconto: 0
    })
  }

  const removerItem = (id: number) => {
    const novosItens = itens.filter(item => item.id !== id)
    onItensChange(novosItens)
    onTotalChange(calcularTotal(novosItens))
  }

  const atualizarItem = (id: number, campo: keyof ItemOrcamentoExpandido, valor: any) => {
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

  const selecionarProduto = (produtoId: number) => {
    const produto = produtosMock.find(p => p.id === produtoId)
    setNovoItem({
      ...novoItem,
      produtoId,
      precoUnitario: produto?.precoVenda || 0
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens do Orçamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulário para adicionar novo item */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 p-4 border rounded-lg">
          <div>
            <Select onValueChange={(value) => selecionarProduto(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Produto" />
              </SelectTrigger>
              <SelectContent>
                {produtosMock.map(produto => (
                  <SelectItem key={produto.id} value={produto.id.toString()}>
                    {produto.codigo} - {produto.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              type="number"
              placeholder="Qtd"
              value={novoItem.quantidade || ''}
              onChange={(e) => setNovoItem({...novoItem, quantidade: Number(e.target.value)})}
            />
          </div>
          <div>
            <Input
              type="number"
              step="0.01"
              placeholder="Preço"
              value={novoItem.precoUnitario || ''}
              onChange={(e) => setNovoItem({...novoItem, precoUnitario: Number(e.target.value)})}
            />
          </div>
          <div>
            <Input
              type="number"
              step="0.01"
              placeholder="Desc %"
              value={novoItem.desconto || ''}
              onChange={(e) => setNovoItem({...novoItem, desconto: Number(e.target.value)})}
            />
          </div>
          <div className="md:col-span-2">
            <Button onClick={adicionarItem} className="w-full">
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
                      value={item.quantidade}
                      onChange={(e) => atualizarItem(item.id!, 'quantidade', Number(e.target.value))}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.precoUnitario}
                      onChange={(e) => atualizarItem(item.id!, 'precoUnitario', Number(e.target.value))}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.desconto || 0}
                      onChange={(e) => atualizarItem(item.id!, 'desconto', Number(e.target.value))}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    R$ {calcularSubtotal(item).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removerItem(item.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
      </CardContent>
    </Card>
  )
}
