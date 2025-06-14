
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PedidoCompra {
  id: number
  numero: string
  fornecedor: string
  dataEmissao: string
  dataEntrega?: string
  status: "Pendente" | "Aprovado" | "Recebido" | "Cancelado"
  valorTotal: number
  itens: ItemPedidoCompra[]
}

interface ItemPedidoCompra {
  id: number
  produto: string
  quantidade: number
  precoUnitario: number
  total: number
}

export default function PedidosCompra() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPedido, setSelectedPedido] = useState<PedidoCompra | null>(null)
  
  const [pedidos, setPedidos] = useState<PedidoCompra[]>([
    {
      id: 1,
      numero: "PC-2024-001",
      fornecedor: "Aços Especiais Ltda",
      dataEmissao: "2024-01-15",
      dataEntrega: "2024-01-25",
      status: "Aprovado",
      valorTotal: 5500.00,
      itens: [
        { id: 1, produto: "Aço Carbono SAE 1020", quantidade: 100, precoUnitario: 15.50, total: 1550.00 },
        { id: 2, produto: "Aço Inox 304", quantidade: 50, precoUnitario: 79.00, total: 3950.00 }
      ]
    },
    {
      id: 2,
      numero: "PC-2024-002",
      fornecedor: "Ferramentas Industriais SA",
      dataEmissao: "2024-01-18",
      status: "Pendente",
      valorTotal: 1200.00,
      itens: [
        { id: 3, produto: "Broca HSS 10mm", quantidade: 20, precoUnitario: 25.00, total: 500.00 },
        { id: 4, produto: "Fresa de Topo 8mm", quantidade: 10, precoUnitario: 70.00, total: 700.00 }
      ]
    }
  ])

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente": return "secondary"
      case "Aprovado": return "default"
      case "Recebido": return "default"
      case "Cancelado": return "destructive"
      default: return "secondary"
    }
  }

  const handleStatusChange = (pedidoId: number, novoStatus: PedidoCompra['status']) => {
    setPedidos(prev => prev.map(p => 
      p.id === pedidoId ? { ...p, status: novoStatus } : p
    ))
    toast({
      title: "Status atualizado",
      description: `Pedido ${pedidos.find(p => p.id === pedidoId)?.numero} foi atualizado para ${novoStatus}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Pedidos de Compra</h2>
          </div>
          <p className="text-muted-foreground">Gerencie pedidos de compra para fornecedores</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{pedidos.length}</div>
            <div className="text-sm text-muted-foreground">Total Pedidos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {pedidos.filter(p => p.status === "Pendente").length}
            </div>
            <div className="text-sm text-muted-foreground">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {pedidos.filter(p => p.status === "Aprovado").length}
            </div>
            <div className="text-sm text-muted-foreground">Aprovados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(pedidos.reduce((sum, p) => sum + p.valorTotal, 0))}
            </div>
            <div className="text-sm text-muted-foreground">Valor Total</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
            <CardDescription>
              {filteredPedidos.length} pedido(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número ou fornecedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead className="hidden sm:table-cell">Fornecedor</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPedidos.map((pedido) => (
                    <TableRow 
                      key={pedido.id}
                      className={`cursor-pointer ${selectedPedido?.id === pedido.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedPedido(pedido)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{pedido.numero}</div>
                          <div className="text-sm text-gray-500">{formatDate(pedido.dataEmissao)}</div>
                          <div className="sm:hidden text-sm text-gray-500">{pedido.fornecedor}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{pedido.fornecedor}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(pedido.valorTotal)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={getStatusColor(pedido.status) as any}>
                          {pedido.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes do Pedido */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
            <CardDescription>
              {selectedPedido 
                ? `Informações do pedido ${selectedPedido.numero}`
                : "Selecione um pedido para ver os detalhes"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPedido ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Fornecedor</p>
                    <p className="font-medium">{selectedPedido.fornecedor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data de Emissão</p>
                    <p className="font-medium">{formatDate(selectedPedido.dataEmissao)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={getStatusColor(selectedPedido.status) as any}>
                      {selectedPedido.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="font-medium text-lg">{formatCurrency(selectedPedido.valorTotal)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Itens do Pedido</h4>
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead className="hidden sm:table-cell">Qtd</TableHead>
                          <TableHead className="hidden md:table-cell">Preço Unit.</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPedido.itens.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.produto}</TableCell>
                            <TableCell className="hidden sm:table-cell">{item.quantidade}</TableCell>
                            <TableCell className="hidden md:table-cell">{formatCurrency(item.precoUnitario)}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(item.total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {selectedPedido.status === "Pendente" && (
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => handleStatusChange(selectedPedido.id, "Aprovado")}
                      className="flex-1"
                    >
                      Aprovar
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleStatusChange(selectedPedido.id, "Cancelado")}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}

                {selectedPedido.status === "Aprovado" && (
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => handleStatusChange(selectedPedido.id, "Recebido")}
                      className="flex-1"
                    >
                      Marcar como Recebido
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecione um pedido para visualizar os detalhes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
