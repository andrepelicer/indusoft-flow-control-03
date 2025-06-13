
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Search, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("")
  
  const clientes = [
    { 
      id: 1, 
      nome: "Metalúrgica São Paulo Ltda", 
      tipo: "PJ", 
      documento: "12.345.678/0001-90", 
      email: "contato@metalurgicasp.com.br",
      telefone: "(11) 3456-7890",
      cidade: "São Paulo",
      status: "Ativo",
      limiteCredito: 50000
    },
    { 
      id: 2, 
      nome: "João Silva", 
      tipo: "PF", 
      documento: "123.456.789-00", 
      email: "joao.silva@email.com",
      telefone: "(11) 99999-8888",
      cidade: "Guarulhos",
      status: "Ativo",
      limiteCredito: 10000
    },
    { 
      id: 3, 
      nome: "Indústria ABC S.A.", 
      tipo: "PJ", 
      documento: "98.765.432/0001-10", 
      email: "compras@industriaabc.com",
      telefone: "(11) 2345-6789",
      cidade: "Osasco",
      status: "Inativo",
      limiteCredito: 75000
    },
  ]

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.documento.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Clientes</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Gestão de Clientes</h2>
                <p className="text-muted-foreground">Cadastro de pessoas físicas e jurídicas</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
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
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Próxima Fase:</strong> Implementaremos formulário completo de cadastro, validação de CPF/CNPJ, histórico de compras e integração com limite de crédito.
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Clientes
