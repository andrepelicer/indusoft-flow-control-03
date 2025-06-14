
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useToast } from "@/hooks/use-toast"
import { Search, FileText, DollarSign, Calendar, User, Package } from "lucide-react"

interface Pedido {
  id: number
  numero: string
  cliente: string
  vendedor: string
  dataPedido: string
  dataEntrega?: string
  status: "Pendente" | "Aprovado" | "Faturado" | "Cancelado"
  valorTotal: number
  itens: ItemPedido[]
}

interface ItemPedido {
  id: number
  produto: string
  quantidade: number
  precoUnitario: number
  total: number
}

export default function Faturamento() {
  const { toast } = useToast()
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: 1,
      numero: "PED-2024-001",
      cliente: "Empresa ABC Ltda",
      vendedor: "João Silva Santos",
      dataPedido: "2024-01-15",
      dataEntrega: "2024-01-25",
      status: "Aprovado",
      valorTotal: 1250.00,
      itens: [
        {
          id: 1,
          produto: "Produto A",
          quantidade: 5,
          precoUnitario: 100.00,
          total: 500.00
        },
        {
          id: 2,
          produto: "Produto B",
          quantidade: 3,
          precoUnitario: 250.00,
          total: 750.00
        }
      ]
    },
    {
      id: 2,
      numero: "PED-2024-002",
      cliente: "Comercial XYZ S.A.",
      vendedor: "Maria Oliveira Costa",
      dataPedido: "2024-01-18",
      status: "Pendente",
      valorTotal: 850.00,
      itens: [
        {
          id: 3,
          produto: "Produto C",
          quantidade: 2,
          precoUnitario: 425.00,
          total: 850.00
        }
      ]
    },
    {
      id: 3,
      numero: "PED-2024-003",
      cliente: "Indústria DEF ME",
      vendedor: "João Silva Santos",
      dataPedido: "2024-01-20",
      status: "Faturado",
      valorTotal: 2100.00,
      itens: [
        {
          id: 4,
          produto: "Produto A",
          quantidade: 10,
          precoUnitario: 100.00,
          total: 1000.00
        },
        {
          id: 5,
          produto: "Produto D",
          quantidade: 4,
          precoUnitario: 275.00,
          total: 1100.00
        }
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.vendedor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || pedido.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
      case "Pendente":
        return "secondary"
      case "Aprovado":
        return "default"
      case "Faturado":
        return "default"
      case "Cancelado":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleFaturar = (pedido: Pedido) => {
    if (pedido.status !== "Aprovado") {
      toast({
        title: "Erro",
        description: "Apenas pedidos aprovados podem ser faturados.",
        variant: "destructive"
      })
      return
    }

    setPedidos(prev => prev.map(p => 
      p.id === pedido.id 
        ? { ...p, status: "Faturado" as const }
        : p
    ))

    toast({
      title: "Pedido faturado",
      description: `O pedido ${pedido.numero} foi faturado com sucesso.`,
    })
  }

  const pedidosParaFaturar = pedidos.filter(p => p.status === "Aprovado")
  const totalParaFaturar = pedidosParaFaturar.reduce((sum, p) => sum + p.valorTotal, 0)

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Faturamento de Pedidos</h1>
          <p className="text-gray-600">Gerencie o faturamento dos pedidos aprovados</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pedidos</p>
                  <p className="text-xl font-bold">{pedidos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Para Faturar</p>
                  <p className="text-xl font-bold">{pedidosParaFaturar.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valor a Faturar</p>
                  <p className="text-lg font-bold">{formatCurrency(totalParaFaturar)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Faturados</p>
                  <p className="text-xl font-bold">{pedidos.filter(p => p.status === "Faturado").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Pedidos */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Pedidos para Faturamento
                  </CardTitle>
                  <CardDescription>
                    {filteredPedidos.length} pedido(s) encontrado(s)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por número, cliente ou vendedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={statusFilter === "Pendente" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("Pendente")}
                  >
                    Pendente
                  </Button>
                  <Button
                    variant={statusFilter === "Aprovado" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("Aprovado")}
                  >
                    Aprovado
                  </Button>
                  <Button
                    variant={statusFilter === "Faturado" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("Faturado")}
                  >
                    Faturado
                  </Button>
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ação</TableHead>
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
                            <div className="text-sm text-gray-500">{formatDate(pedido.dataPedido)}</div>
                          </div>
                        </TableCell>
                        <TableCell>{pedido.cliente}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(pedido.valorTotal)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(pedido.status) as any}>
                            {pedido.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {pedido.status === "Aprovado" && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleFaturar(pedido)
                              }}
                            >
                              Faturar
                            </Button>
                          )}
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
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Detalhes do Pedido
              </CardTitle>
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
                  {/* Cabeçalho do Pedido */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Cliente</p>
                      <p className="font-medium">{selectedPedido.cliente}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vendedor</p>
                      <p className="font-medium">{selectedPedido.vendedor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Data do Pedido</p>
                      <p className="font-medium">{formatDate(selectedPedido.dataPedido)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge variant={getStatusColor(selectedPedido.status) as any}>
                        {selectedPedido.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Itens do Pedido */}
                  <div>
                    <h4 className="font-medium mb-3">Itens do Pedido</h4>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead>Qtd</TableHead>
                            <TableHead>Preço Unit.</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPedido.itens.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.produto}</TableCell>
                              <TableCell>{item.quantidade}</TableCell>
                              <TableCell>{formatCurrency(item.precoUnitario)}</TableCell>
                              <TableCell className="font-medium">{formatCurrency(item.total)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total do Pedido:</span>
                      <span>{formatCurrency(selectedPedido.valorTotal)}</span>
                    </div>
                  </div>

                  {/* Ações */}
                  {selectedPedido.status === "Aprovado" && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={() => handleFaturar(selectedPedido)} className="flex-1">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Faturar Pedido
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione um pedido para visualizar os detalhes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  )
}
