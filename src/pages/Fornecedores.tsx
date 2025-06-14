
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Gestão de Fornecedores</h2>
          </div>
          <p className="text-muted-foreground">Cadastro e avaliação de fornecedores por categoria</p>
        </div>
        <Button onClick={handleNewFornecedor} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">Por Categoria</Button>
              <Button variant="outline" size="sm">Por Avaliação</Button>
            </div>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome/Razão Social</TableHead>
                  <TableHead className="hidden sm:table-cell">CNPJ</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden lg:table-cell">Contato</TableHead>
                  <TableHead className="hidden xl:table-cell">Cidade</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFornecedores.map((fornecedor) => (
                  <TableRow key={fornecedor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{fornecedor.nome}</div>
                        <div className="sm:hidden text-sm text-muted-foreground">
                          {fornecedor.cnpj}
                        </div>
                        <div className="md:hidden text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{fornecedor.categoria}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-sm">{fornecedor.cnpj}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{fornecedor.categoria}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-1">
                        <div className="text-sm">{fornecedor.email}</div>
                        <div className="text-sm text-muted-foreground">{fornecedor.telefone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">{fornecedor.cidade}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(fornecedor.avaliacao)}
                        <span className="text-sm ml-1">({fornecedor.avaliacao})</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={fornecedor.status === 'Ativo' ? 'default' : 'secondary'}>
                        {fornecedor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
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
          </div>
        </CardContent>
      </Card>

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
    </div>
  )
}

export default Fornecedores
