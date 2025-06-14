
import { Button } from "@/components/ui/button"
import { Truck, Plus } from "lucide-react"
import { useState } from "react"
import { FornecedorForm } from "@/components/FornecedorForm"
import { FornecedoresStats } from "@/components/fornecedores/FornecedoresStats"
import { FornecedoresFilters } from "@/components/fornecedores/FornecedoresFilters"
import { FornecedoresTable } from "@/components/fornecedores/FornecedoresTable"
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
  const [editingFornecedor, setEditingFornecedor] = useState<FornecedorComId | undefined>()
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

      <FornecedoresStats fornecedores={fornecedores} />
      
      <FornecedoresFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <FornecedoresTable
        fornecedores={filteredFornecedores}
        onEdit={handleEditFornecedor}
        onDelete={handleDeleteFornecedor}
      />

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
