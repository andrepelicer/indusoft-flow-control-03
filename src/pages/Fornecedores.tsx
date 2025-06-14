
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Building2, Phone, Mail, Edit, Trash2 } from "lucide-react"

interface Endereco {
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

interface Fornecedor {
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  telefone?: string
  email?: string
  endereco: Endereco
  ativo: boolean
}

interface FornecedorComId extends Fornecedor {
  id: number
}

export default function Fornecedores() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const [fornecedores, setFornecedores] = useState<FornecedorComId[]>([
    {
      id: 1,
      cnpj: "12.345.678/0001-90",
      razaoSocial: "Aços Especiais Ltda",
      nomeFantasia: "Aços Especiais",
      telefone: "(11) 3456-7890",
      email: "contato@acosespeciais.com.br",
      endereco: {
        rua: "Rua da Indústria",
        numero: "123",
        bairro: "Industrial",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567"
      },
      ativo: true
    },
    {
      id: 2,
      cnpj: "98.765.432/0001-10",
      razaoSocial: "Materiais de Construção Silva & Cia",
      nomeFantasia: "Silva Materiais",
      telefone: "(11) 2345-6789",
      email: "vendas@silvamat.com.br",
      endereco: {
        rua: "Av. das Construções",
        numero: "456",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "02345-678"
      },
      ativo: true
    },
    {
      id: 3,
      cnpj: "11.222.333/0001-44",
      razaoSocial: "Transportes Rápidos S.A.",
      nomeFantasia: "Rápidos",
      telefone: "(11) 4567-8901",
      email: "logistica@rapidostransportes.com.br",
      endereco: {
        rua: "Rod. dos Transportes",
        numero: "789",
        bairro: "Logística",
        cidade: "São Paulo",
        estado: "SP",
        cep: "03456-789"
      },
      ativo: false
    }
  ])

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cnpj.includes(searchTerm) ||
    (fornecedor.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  const totalFornecedores = fornecedores.length
  const fornecedoresAtivos = fornecedores.filter(f => f.ativo).length
  const fornecedoresInativos = fornecedores.filter(f => !f.ativo).length

  const handleEditar = (fornecedor: FornecedorComId) => {
    console.log("Editar fornecedor:", fornecedor.id)
  }

  const handleExcluir = (id: number) => {
    setFornecedores(fornecedores.filter(fornecedor => fornecedor.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Fornecedores</h2>
          </div>
          <p className="text-muted-foreground">Gerenciamento de fornecedores e parceiros</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {totalFornecedores}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {fornecedoresAtivos}
            </div>
            <div className="text-sm text-muted-foreground">Ativos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {fornecedoresInativos}
            </div>
            <div className="text-sm text-muted-foreground">Inativos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {fornecedoresAtivos}
            </div>
            <div className="text-sm text-muted-foreground">Parceiros</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por razão social, CNPJ ou nome fantasia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
                  <TableHead>Razão Social</TableHead>
                  <TableHead className="hidden sm:table-cell">CNPJ</TableHead>
                  <TableHead className="hidden md:table-cell">Nome Fantasia</TableHead>
                  <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFornecedores.map((fornecedor) => (
                  <TableRow key={fornecedor.id}>
                    <TableCell className="font-medium">{fornecedor.razaoSocial}</TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-sm">{fornecedor.cnpj}</TableCell>
                    <TableCell className="hidden md:table-cell">{fornecedor.nomeFantasia || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{fornecedor.telefone || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{fornecedor.email || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={fornecedor.ativo ? 'default' : 'secondary'}>
                        {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditar(fornecedor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleExcluir(fornecedor.id)}
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
    </div>
  )
}
