import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Plus, Search, Edit, Trash2, Eye, CheckCircle } from "lucide-react"
import { useState } from "react"
import { PedidoVendaForm } from "@/components/PedidoVendaForm"
import { PedidoVendaDetalhes } from "@/components/PedidoVendaDetalhes"
import { type Pedido, ItemPedidoExpandido } from "@/lib/validations"
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

type PedidoComId = Pedido & { id: number; itens?: ItemPedidoExpandido[] }

const PedidosVenda = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [detalhesOpen, setDetalhesOpen] = useState(false)
  const [editingPedido, setEditingPedido] = useState<PedidoComId | undefined>()
  const [viewingPedido, setViewingPedido] = useState<PedidoComId | null>(null)
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
      valorTotal: 18750.00,
      itens: [
        {
          id: 1001,
          produtoId: 1,
          quantidade: 100,
          precoUnitario: 120.00,
          desconto: 0,
          produto: { id: 1, nome: "Chapa de Aço 1mm", codigo: "CH001", precoVenda: 120.00 },
          subtotal: 12000.00
        },
        {
          id: 1002,
          produtoId: 2,
          quantidade: 150,
          precoUnitario: 45.50,
          desconto: 0,
          produto: { id: 2, nome: "Perfil L 50x50x3", codigo: "PF002", precoVenda: 45.50 },
          subtotal: 6825.00
        }
      ]
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
      valorTotal: 9200.00,
      itens: [
        {
          id: 2001,
          produtoId: 3,
          quantidade: 50,
          precoUnitario: 89.90,
          desconto: 0,
          produto: { id: 3, nome: "Tubo Redondo 2\"", codigo: "TR003", precoVenda: 89.90 },
          subtotal: 4495.00
        },
        {
          id: 2002,
          produtoId: 4,
          quantidade: 180,
          precoUnitario: 25.80,
          desconto: 0,
          produto: { id: 4, nome: "Solda Eletrodo 3,25mm", codigo: "SO004", precoVenda: 25.80 },
          subtotal: 4644.00
        }
      ]
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
      valorTotal: 14300.00,
      itens: [
        {
          id: 3001,
          produtoId: 9,
          quantidade: 80,
          precoUnitario: 180.00,
          desconto: 0,
          produto: { id: 9, nome: "Chapa Galvanizada 2mm", codigo: "CG009", precoVenda: 180.00 },
          subtotal: 14400.00
        }
      ]
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

  const handleSavePedido = (pedidoData: Pedido & { itens: ItemPedidoExpandido[] }) => {
    console.log('Salvando pedido na página principal:', {
      ...pedidoData,
      totalItens: pedidoData.itens?.length || 0,
      itensDetalhes: pedidoData.itens?.map(i => ({ id: i.id, produto: i.produto?.nome, quantidade: i.quantidade }))
    })
    
    if (editingPedido) {
      // Ao editar, preservar os itens com cuidado especial
      setPedidos(prev => prev.map(p => {
        if (p.id === editingPedido.id) {
          const pedidoAtualizado = { 
            ...pedidoData, 
            id: editingPedido.id,
            itens: pedidoData.itens ? [...pedidoData.itens] : [] // Garantir que os itens sejam copiados
          } as PedidoComId
          console.log('Pedido atualizado com sucesso:', pedidoAtualizado.numero, 'com', pedidoAtualizado.itens?.length, 'itens')
          return pedidoAtualizado
        }
        return p
      }))
    } else {
      // Ao criar novo, incluir os itens
      const newId = Math.max(...pedidos.map(p => p.id)) + 1
      const novoPedido = { 
        ...pedidoData, 
        id: newId,
        itens: pedidoData.itens ? [...pedidoData.itens] : []
      } as PedidoComId
      setPedidos(prev => [...prev, novoPedido])
      console.log('Novo pedido criado com', pedidoData.itens?.length || 0, 'itens')
    }
    setEditingPedido(undefined)
  }

  const handleEditPedido = (pedido: PedidoComId) => {
    console.log('Iniciando edição do pedido:', pedido.numero, 'com', pedido.itens?.length || 0, 'itens')
    console.log('Itens do pedido:', pedido.itens)
    // Garantir que o pedido tem uma cópia dos itens
    const pedidoParaEdicao = {
      ...pedido,
      itens: pedido.itens ? [...pedido.itens] : []
    }
    setEditingPedido(pedidoParaEdicao)
    setFormOpen(true)
  }

  const handleViewPedido = (pedido: PedidoComId) => {
    setViewingPedido(pedido)
    setDetalhesOpen(true)
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
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Pedidos de Venda</h2>
          <p className="text-muted-foreground">Controle de vendas e entregas</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprovados ({pedidosAprovados.length})
          </Button>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px]">
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
            <Button variant="outline" size="sm">Por Status</Button>
            <Button variant="outline" size="sm">Por Vendedor</Button>
            <Button variant="outline" size="sm">Por Período</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Lista de Pedidos de Venda
          </CardTitle>
          <CardDescription>
            {filteredPedidos.length} pedido(s) encontrado(s) - Total: R$ {valorTotalPedidos.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden lg:table-cell">Vendedor</TableHead>
                  <TableHead className="hidden md:table-cell">Data Pedido</TableHead>
                  <TableHead className="hidden lg:table-cell">Data Entrega</TableHead>
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
                    <TableCell className="hidden lg:table-cell">
                      {vendedorNomes[pedido.vendedorId as keyof typeof vendedorNomes]}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(pedido.dataPedido).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {pedido.dataEntrega ? new Date(pedido.dataEntrega).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>R$ {pedido.valorTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      {getStatusBadge(pedido.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Visualizar"
                          onClick={() => handleViewPedido(pedido)}
                        >
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
          </div>
        </CardContent>
      </Card>

      <PedidoVendaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        pedido={editingPedido}
        onSave={handleSavePedido}
      />

      <PedidoVendaDetalhes
        open={detalhesOpen}
        onOpenChange={setDetalhesOpen}
        pedido={viewingPedido}
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
    </div>
  )
}

export default PedidosVenda
