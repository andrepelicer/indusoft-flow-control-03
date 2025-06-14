
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
import { Badge } from "@/components/ui/badge"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { VendedorForm } from "@/components/VendedorForm"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Edit, Trash2, Users } from "lucide-react"
import type { Vendedor } from "@/lib/validations"

type VendedorWithId = Vendedor & { id: number }

export default function Vendedores() {
  const { toast } = useToast()
  const [vendedores, setVendedores] = useState<VendedorWithId[]>([
    {
      id: 1,
      nome: "João Silva Santos",
      cpf: "123.456.789-00",
      email: "joao.silva@empresa.com",
      telefone: "(11) 99999-1111",
      comissao: 5,
      status: "Ativo",
      dataAdmissao: "2023-01-15"
    },
    {
      id: 2,
      nome: "Maria Oliveira Costa",
      cpf: "987.654.321-00",
      email: "maria.oliveira@empresa.com",
      telefone: "(11) 99999-2222",
      comissao: 7.5,
      status: "Ativo",
      dataAdmissao: "2023-03-20"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedVendedor, setSelectedVendedor] = useState<VendedorWithId | undefined>()
  const [vendedorToDelete, setVendedorToDelete] = useState<VendedorWithId | null>(null)

  const filteredVendedores = vendedores.filter(vendedor =>
    vendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendedor.cpf.includes(searchTerm) ||
    vendedor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSaveVendedor = (vendedorData: Vendedor) => {
    if (selectedVendedor) {
      setVendedores(prev => prev.map(v => 
        v.id === selectedVendedor.id 
          ? { ...vendedorData, id: selectedVendedor.id }
          : v
      ))
    } else {
      const newVendedor = {
        ...vendedorData,
        id: Math.max(0, ...vendedores.map(v => v.id)) + 1
      }
      setVendedores(prev => [...prev, newVendedor])
    }
    setSelectedVendedor(undefined)
  }

  const handleEditVendedor = (vendedor: VendedorWithId) => {
    setSelectedVendedor(vendedor)
    setIsFormOpen(true)
  }

  const handleDeleteVendedor = (vendedor: VendedorWithId) => {
    setVendedorToDelete(vendedor)
  }

  const confirmDelete = () => {
    if (vendedorToDelete) {
      setVendedores(prev => prev.filter(v => v.id !== vendedorToDelete.id))
      toast({
        title: "Vendedor removido",
        description: "O vendedor foi removido com sucesso.",
      })
      setVendedorToDelete(null)
    }
  }

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendedores</h1>
          <p className="text-gray-600">Gerencie os vendedores da sua empresa</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Lista de Vendedores
                </CardTitle>
                <CardDescription>
                  {vendedores.length} vendedor(es) cadastrado(s)
                </CardDescription>
              </div>
              <Button onClick={() => {
                setSelectedVendedor(undefined)
                setIsFormOpen(true)
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Vendedor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, CPF ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Admissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendedores.map((vendedor) => (
                    <TableRow key={vendedor.id}>
                      <TableCell className="font-medium">{vendedor.nome}</TableCell>
                      <TableCell>{formatCPF(vendedor.cpf)}</TableCell>
                      <TableCell>{vendedor.email}</TableCell>
                      <TableCell>{vendedor.telefone}</TableCell>
                      <TableCell>{vendedor.comissao}%</TableCell>
                      <TableCell>{formatDate(vendedor.dataAdmissao)}</TableCell>
                      <TableCell>
                        <Badge variant={vendedor.status === "Ativo" ? "default" : "secondary"}>
                          {vendedor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVendedor(vendedor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteVendedor(vendedor)}
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

            {filteredVendedores.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum vendedor encontrado.
              </div>
            )}
          </CardContent>
        </Card>

        <VendedorForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          vendedor={selectedVendedor}
          onSave={handleSaveVendedor}
        />

        <AlertDialog open={!!vendedorToDelete} onOpenChange={() => setVendedorToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o vendedor "{vendedorToDelete?.nome}"? 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </SidebarProvider>
  )
}
