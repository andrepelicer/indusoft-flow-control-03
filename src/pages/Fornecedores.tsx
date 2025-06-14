import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck, Plus, Search, Edit, Trash2, Star } from "lucide-react"
import { useState } from "react"
import { FornecedorForm } from "@/components/FornecedorForm"
import { type Fornecedor } from "@/lib/validations"
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

type FornecedorComId = Fornecedor & { id: number }

const Fornecedores = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingFornecedor, setEditingFornecedor] =
    useState<FornecedorComId | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fornecedorToDelete, setFornecedorToDelete] = useState<number | null>(null)
  const { toast } = useToast()
  
  const [fornecedores, setFornecedores] = useState<FornecedorComId[]>([
    { 
      id: 1, 
      nome: "Aços Especiais Ltda", 
      cnpj: "11.222.333/0001-44", 
      categoria: "Matéria-Prima",
      email: "vendas@acosespeciais.com.br",
      telefone: "(11) 3333-4444",
      cidade: "São Bernardo do Campo",
      status: "Ativo" as const,
      avaliacao: 5
    },
    { 
      id: 2, 
      nome: "Transporte Silva & Cia", 
      cnpj: "22.333.444/0001-55", 
      categoria: "Serviços",
      email: "contato@transportesilva.com",
      telefone: "(11) 4444-5555",
      cidade: "Santo André",
      status: "Ativo" as const,
      avaliacao: 4
    },
    { 
      id: 3, 
      nome: "Ferramentas Industriais SA", 
      cnpj: "33.444.555/0001-66", 
      categoria: "Ferramentas",
      email: "comercial@ferramentasindustriais.com",
      telefone: "(11) 5555-6666",
      cidade: "Diadema",
      status: "Inativo" as const,
      avaliacao: 3
    },
  ])

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cnpj.includes(searchTerm) ||
    fornecedor.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSaveFornecedor = (fornecedorData: Fornecedor) => {
    if (editingFornecedor) {
      setFornecedores(prev => prev.map(f => 
        f.id === editingFornecedor.id ? { ...fornecedorData, id: editingFornecedor.id } as FornecedorComId : f
      ))
    } else {
      const newId = Math.max(...fornecedores.map(f => f.id)) + 1
      setFornecedores(prev => [...prev, { ...fornecedorData, id: newId } as FornecedorComId])
    }
    setEditingFornecedor(undefined)
  }

  const handleEditFornecedor = (fornecedor: FornecedorComId) => {
    setEditingFornecedor(fornecedor)
    setFormOpen(true)
  }

  const handleDeleteFornecedor = (id: number) => {
    setFornecedorToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (fornecedorToDelete) {
      setFornecedores(prev => prev.filter(f => f.id !== fornecedorToDelete))
      toast({
        title: "Fornecedor excluído",
        description: "O fornecedor foi removido com sucesso.",
      })
    }
    setDeleteDialogOpen(false)
    setFornecedorToDelete(null)
  }

  const handleNewFornecedor = () => {
    setEditingFornecedor(undefined)
    setFormOpen(true)
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  const avaliacaoMedia = fornecedores.reduce((sum, f) => sum + f.avaliacao, 0) / fornecedores.length

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Fornecedores</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Gestão de Fornecedores</h2>
                <p className="text-muted-foreground">Cadastro e avaliação de fornecedores por categoria</p>
              </div>
              <Button onClick={handleNewFornecedor}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Fornecedor
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{fornecedores.length}</div>
                  <div className="text-sm text-muted-foreground">Total Fornecedores</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {fornecedores.filter(f => f.status === 'Ativo').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Ativos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{avaliacaoMedia.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Avaliação Média</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {new Set(fornecedores.map(f => f.categoria)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Categorias</div>
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
                        placeholder="Buscar por nome, CNPJ ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline">Por Categoria</Button>
                  <Button variant="outline">Por Avaliação</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Fornecedores</CardTitle>
                <CardDescription>
                  {filteredFornecedores.length} fornecedor(es) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome/Razão Social</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Avaliação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFornecedores.map((fornecedor) => (
                      <TableRow key={fornecedor.id}>
                        <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                        <TableCell className="font-mono text-sm">{fornecedor.cnpj}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{fornecedor.categoria}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{fornecedor.email}</div>
                            <div className="text-sm text-muted-foreground">{fornecedor.telefone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{fornecedor.cidade}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {renderStars(fornecedor.avaliacao)}
                            <span className="text-sm ml-1">({fornecedor.avaliacao})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={fornecedor.status === 'Ativo' ? 'default' : 'secondary'}>
                            {fornecedor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditFornecedor(fornecedor)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteFornecedor(fornecedor.id)}
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

      <FornecedorForm
        open={formOpen}
        onOpenChange={setFormOpen}
        fornecedor={editingFornecedor}
        onSave={handleSaveFornecedor}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita.
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

export default Fornecedores
