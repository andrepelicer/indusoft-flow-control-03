
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { ClienteForm } from "@/components/ClienteForm"
import { type Cliente } from "@/lib/validations"
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

type ClienteComId = Cliente & { id: number }

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<ClienteComId | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<number | null>(null)
  const { toast } = useToast()
  
  const [clientes, setClientes] = useState<ClienteComId[]>([
    { 
      id: 1, 
      nome: "Metalúrgica São Paulo Ltda", 
      tipo: "PJ" as const, 
      documento: "12.345.678/0001-90", 
      email: "contato@metalurgicasp.com.br",
      telefone: "(11) 3456-7890",
      cidade: "São Paulo",
      status: "Ativo" as const,
      limiteCredito: 50000
    },
    { 
      id: 2, 
      nome: "João Silva", 
      tipo: "PF" as const, 
      documento: "123.456.789-00", 
      email: "joao.silva@email.com",
      telefone: "(11) 99999-8888",
      cidade: "Guarulhos",
      status: "Ativo" as const,
      limiteCredito: 10000
    },
    { 
      id: 3, 
      nome: "Indústria ABC S.A.", 
      tipo: "PJ" as const, 
      documento: "98.765.432/0001-10", 
      email: "compras@industriaabc.com",
      telefone: "(11) 2345-6789",
      cidade: "Osasco",
      status: "Inativo" as const,
      limiteCredito: 75000
    },
  ])

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.documento.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSaveCliente = (clienteData: Cliente) => {
    if (editingCliente) {
      setClientes(prev => prev.map(c => 
        c.id === editingCliente.id ? { ...clienteData, id: editingCliente.id } as ClienteComId : c
      ))
    } else {
      const newId = Math.max(...clientes.map(c => c.id)) + 1
      setClientes(prev => [...prev, { ...clienteData, id: newId } as ClienteComId])
    }
    setEditingCliente(undefined)
  }

  const handleEditCliente = (cliente: ClienteComId) => {
    setEditingCliente(cliente)
    setFormOpen(true)
  }

  const handleDeleteCliente = (id: number) => {
    setClienteToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (clienteToDelete) {
      setClientes(prev => prev.filter(c => c.id !== clienteToDelete))
      toast({
        title: "Cliente excluído",
        description: "O cliente foi removido com sucesso.",
      })
    }
    setDeleteDialogOpen(false)
    setClienteToDelete(null)
  }

  const handleNewCliente = () => {
    setEditingCliente(undefined)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Clientes</h2>
          <p className="text-muted-foreground">Cadastro de pessoas físicas e jurídicas</p>
        </div>
        <Button onClick={handleNewCliente}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{clientes.length}</div>
            <div className="text-sm text-muted-foreground">Total Clientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {clientes.filter(c => c.status === 'Ativo').length}
            </div>
            <div className="text-sm text-muted-foreground">Ativos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {clientes.filter(c => c.tipo === 'PJ').length}
            </div>
            <div className="text-sm text-muted-foreground">Pessoas Jurídicas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              R$ {clientes.reduce((sum, c) => sum + c.limiteCredito, 0).toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-muted-foreground">Limite Total</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, documento ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">Filtros Avançados</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClientes.length} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome/Razão Social</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Limite Crédito</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>
                    <Badge variant={cliente.tipo === 'PJ' ? 'default' : 'secondary'}>
                      {cliente.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{cliente.documento}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{cliente.email}</div>
                      <div className="text-sm text-muted-foreground">{cliente.telefone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{cliente.cidade}</TableCell>
                  <TableCell>R$ {cliente.limiteCredito.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge variant={cliente.status === 'Ativo' ? 'default' : 'secondary'}>
                      {cliente.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditCliente(cliente)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteCliente(cliente.id)}
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

      <ClienteForm
        open={formOpen}
        onOpenChange={setFormOpen}
        cliente={editingCliente}
        onSave={handleSaveCliente}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
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

export default Clientes
