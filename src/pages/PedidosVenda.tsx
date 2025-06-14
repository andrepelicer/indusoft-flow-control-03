
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Plus, Search, Edit, Trash2, Eye, CheckCircle } from "lucide-react"
import { useState } from "react"
import { PedidoVendaForm } from "@/components/PedidoVendaForm"
import { type Pedido } from "@/lib/validations"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type PedidoComId = Pedido & { id: number }

const PedidosVenda = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingPedido, setEditingPedido] = useState<PedidoComId | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pedidoToDelete, setPedidoToDelete] = useState<number | null>(null)
  const { toast } = useToast()
  
  const [pedidos, setPedidos] = useState<PedidoComId[]>([
    { 
      id: 1, 
      numero: "PV-2024-001", 
      clienteId: 1,
      vendedorId: 1,
      dataPedido: "2024-01-20",
      dataEntrega: "2024-02-20",
      status: "Aprovado" as const,
      observacoes: "Entrega em lote único",
      desconto: 2.5,
      valorTotal: 18750.00
    },
    { 
      id: 2, 
      numero: "PV-2024-002", 
      clienteId: 2,
      vendedorId: 2,
      dataPedido: "2024-01-22",
      dataEntrega: "2024-02-25",
      status: "Faturado" as const,
      observacoes: "Pagamento à vista",
      desconto: 0,
      valorTotal: 9200.00
    },
    { 
      id: 3, 
      numero: "PV-2024-003", 
      clienteId: 3,
      vendedorId: 1,
      dataPedido: "2024-01-25",
      dataEntrega: "",
      status: "Pendente" as const,
      observacoes: "Aguardando aprovação do cliente",
      desconto: 5,
      valorTotal: 14300.00
    },
  ])

  const clienteNomes = {
    1: "Metalúrgica Santos Ltda.",
    2: "Indústria Silva & Cia",
    3: "Construtora Oliveira"
  }

  const vendedorNomes = {
    1: "Carlos Silva",
    2: "Ana Costa",
    3: "Roberto Santos"
  }

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clienteNomes[pedido.clienteId as keyof typeof clienteNomes]?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pedidosPendentes = pedidos.filter(p => p.status === 'Pendente')
  const pedidosAprovados = pedidos.filter(p => p.status === 'Aprovado')
  const pedidosFaturados = pedidos.filter(p => p.status === 'Faturado')
  const valorTotalPedidos = pedidos.reduce((sum, p) => sum + p.valorTotal, 0)

  const handleSavePedido = (pedidoData: Pedido) => {
    if (editingPedido) {
      setPedidos(prev => prev.map(p => 
        p.id === editingPedido.id ? { ...pedidoData, id: editingPedido.id } as PedidoComId : p
      ))
    } else {
      const newId = Math.max(...pedidos.map(p => p.id)) + 1
      setPedidos(prev => [...prev, { ...pedidoData, id: newId } as PedidoComId])
    }
    setEditingPedido(undefined)
  }

  const handleEditPedido = (pedido: PedidoComId) => {
    setEditingPedido(pedido)
    setFormOpen(true)
  }

  const handleDeletePedido = (id: number) => {
    setPedidoToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (pedidoToDelete) {
      setPedidos(prev => prev.filter(p => p.id !== pedidoToDelete))
      toast({
        title: "Pedido excluído",
        description: "O pedido foi removido com sucesso.",
      })
    }
    setDeleteDialogOpen(false)
    setPedidoToDelete(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case 'Pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case 'Faturado':
        return <Badge className="bg-blue-100 text-blue-800">Faturado</Badge>
      case 'Cancelado':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Pedidos de Venda</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Gestão de Pedidos de Venda</h2>
                <p className="text-muted-foreground">Controle de vendas e entregas</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovados ({pedidosAprovados.length})
                </Button>
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pedido
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{pedidos.length}</div>
                  <div className="text-sm text-muted-foreground">Total Pedidos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{pedidosPendentes.length}</div>
                  <div className="text-sm text-muted-foreground">Pendentes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{pedidosAprovados.length}</div>
                  <div className="text-sm text-muted-foreground">Aprovados</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{pedidosFaturados.length}</div>
                  <div className="text-sm text-muted-foreground">Faturados</div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar por número ou cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline">Por Status</Button>
                  <Button variant="outline">Por Vendedor</Button>
                  <Button variant="outline">Por Período</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Pedidos de Venda</CardTitle>
                <CardDescription>
                  {filteredPedidos.length} pedido(s) encontrado(s) - Total: R$ {valorTotalPedidos.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead>Data Pedido</TableHead>
                      <TableHead>Data Entrega</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPedidos.map((pedido) => (
                      <TableRow key={pedido.id}>
                        <TableCell className="font-mono text-sm font-medium">{pedido.numero}</TableCell>
                        <TableCell className="font-medium">
                          {clienteNomes[pedido.clienteId as keyof typeof clienteNomes]}
                        </TableCell>
                        <TableCell>
                          {vendedorNomes[pedido.vendedorId as keyof typeof vendedorNomes]}
                        </TableCell>
                        <TableCell>{new Date(pedido.dataPedido).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {pedido.dataEntrega ? new Date(pedido.dataEntrega).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>R$ {pedido.valorTotal.toFixed(2)}</TableCell>
                        <TableCell>
                          {getStatusBadge(pedido.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" title="Visualizar">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Editar"
                              onClick={() => handleEditPedido(pedido)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Excluir"
                              onClick={() => handleDeletePedido(pedido.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>

      <PedidoVendaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        pedido={editingPedido}
        onSave={handleSavePedido}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}

export default PedidosVenda
