
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Plus, Search, Edit, Trash2, Eye, Clock } from "lucide-react"
import { useState } from "react"
import { OrcamentoForm } from "@/components/OrcamentoForm"
import { type Orcamento } from "@/lib/validations"
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

type OrcamentoComId = Orcamento & { id: number }

const Orcamentos = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingOrcamento, setEditingOrcamento] = useState<OrcamentoComId | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orcamentoToDelete, setOrcamentoToDelete] = useState<number | null>(null)
  const { toast } = useToast()
  
  const [orcamentos, setOrcamentos] = useState<OrcamentoComId[]>([
    { 
      id: 1, 
      numero: "ORC-2024-001", 
      clienteId: 1,
      vendedorId: 1,
      dataOrcamento: "2024-01-15",
      validadeOrcamento: "2024-02-15",
      status: "Pendente" as const,
      observacoes: "Orçamento para estrutura metálica personalizada",
      desconto: 5,
      valorTotal: 15750.00
    },
    { 
      id: 2, 
      numero: "ORC-2024-002", 
      clienteId: 2,
      vendedorId: 2,
      dataOrcamento: "2024-01-18",
      validadeOrcamento: "2024-02-18",
      status: "Aprovado" as const,
      observacoes: "Projeto aprovado pelo cliente",
      desconto: 0,
      valorTotal: 8900.00
    },
    { 
      id: 3, 
      numero: "ORC-2024-003", 
      clienteId: 3,
      vendedorId: 1,
      dataOrcamento: "2024-01-10",
      validadeOrcamento: "2024-01-25",
      status: "Expirado" as const,
      observacoes: "Cliente não respondeu no prazo",
      desconto: 10,
      valorTotal: 12300.00
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

  const filteredOrcamentos = orcamentos.filter(orcamento =>
    orcamento.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clienteNomes[orcamento.clienteId as keyof typeof clienteNomes]?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const orcamentosPendentes = orcamentos.filter(o => o.status === 'Pendente')
  const orcamentosAprovados = orcamentos.filter(o => o.status === 'Aprovado')
  const valorTotalOrcamentos = orcamentos.reduce((sum, o) => sum + o.valorTotal, 0)

  const handleSaveOrcamento = (orcamentoData: Orcamento) => {
    if (editingOrcamento) {
      setOrcamentos(prev => prev.map(o => 
        o.id === editingOrcamento.id ? { ...orcamentoData, id: editingOrcamento.id } as OrcamentoComId : o
      ))
    } else {
      const newId = Math.max(...orcamentos.map(o => o.id)) + 1
      setOrcamentos(prev => [...prev, { ...orcamentoData, id: newId } as OrcamentoComId])
    }
    setEditingOrcamento(undefined)
  }

  const handleEditOrcamento = (orcamento: OrcamentoComId) => {
    setEditingOrcamento(orcamento)
    setFormOpen(true)
  }

  const handleDeleteOrcamento = (id: number) => {
    setOrcamentoToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (orcamentoToDelete) {
      setOrcamentos(prev => prev.filter(o => o.id !== orcamentoToDelete))
      toast({
        title: "Orçamento excluído",
        description: "O orçamento foi removido com sucesso.",
      })
    }
    setDeleteDialogOpen(false)
    setOrcamentoToDelete(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case 'Pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case 'Rejeitado':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>
      case 'Expirado':
        return <Badge className="bg-gray-100 text-gray-800">Expirado</Badge>
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
              <FileText className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Orçamentos</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Gestão de Orçamentos</h2>
                <p className="text-muted-foreground">Controle de propostas e negociações</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Pendentes ({orcamentosPendentes.length})
                </Button>
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Orçamento
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{orcamentos.length}</div>
                  <div className="text-sm text-muted-foreground">Total Orçamentos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{orcamentosPendentes.length}</div>
                  <div className="text-sm text-muted-foreground">Pendentes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{orcamentosAprovados.length}</div>
                  <div className="text-sm text-muted-foreground">Aprovados</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    R$ {(valorTotalOrcamentos / 1000).toFixed(0)}k
                  </div>
                  <div className="text-sm text-muted-foreground">Valor Total</div>
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
                <CardTitle>Lista de Orçamentos</CardTitle>
                <CardDescription>
                  {filteredOrcamentos.length} orçamento(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrcamentos.map((orcamento) => (
                      <TableRow key={orcamento.id}>
                        <TableCell className="font-mono text-sm font-medium">{orcamento.numero}</TableCell>
                        <TableCell className="font-medium">
                          {clienteNomes[orcamento.clienteId as keyof typeof clienteNomes]}
                        </TableCell>
                        <TableCell>
                          {vendedorNomes[orcamento.vendedorId as keyof typeof vendedorNomes]}
                        </TableCell>
                        <TableCell>{new Date(orcamento.dataOrcamento).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(orcamento.validadeOrcamento).toLocaleDateString()}</TableCell>
                        <TableCell>R$ {orcamento.valorTotal.toFixed(2)}</TableCell>
                        <TableCell>
                          {getStatusBadge(orcamento.status)}
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
                              onClick={() => handleEditOrcamento(orcamento)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Excluir"
                              onClick={() => handleDeleteOrcamento(orcamento.id)}
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

      <OrcamentoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        orcamento={editingOrcamento}
        onSave={handleSaveOrcamento}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
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

export default Orcamentos
