import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Plus, Search, Star, MapPin, Phone, Mail, FileText } from "lucide-react"
import { FornecedoresStats } from "@/components/fornecedores/FornecedoresStats"
import { FornecedoresFilters } from "@/components/fornecedores/FornecedoresFilters"
import { FornecedoresTable } from "@/components/fornecedores/FornecedoresTable"

export interface FornecedorComId {
  id: number
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  inscricaoEstadual?: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  telefone: string
  email: string
  contato: string
  observacoes?: string
  status?: "Ativo" | "Inativo"
  categoria: string
  avaliacao: number
  ultimaCompra?: string
  totalCompras?: number
}

export default function Fornecedores() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoriaFilter, setCategoriaFilter] = useState<string>("all")
  
  const [fornecedores] = useState<FornecedorComId[]>([
    {
      id: 1,
      razaoSocial: "Aços Especiais Ltda",
      nomeFantasia: "Aços Especiais",
      cnpj: "12.345.678/0001-90",
      inscricaoEstadual: "123456789",
      endereco: "Rua Industrial, 123",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      telefone: "(11) 3456-7890",
      email: "contato@acosespeciais.com.br",
      contato: "João Silva",
      observacoes: "Fornecedor principal de matéria-prima",
      status: "Ativo",
      categoria: "Matéria-Prima",
      avaliacao: 4.5,
      ultimaCompra: "2024-01-15",
      totalCompras: 25000.00
    },
    {
      id: 2,
      razaoSocial: "Transportes Rápidos S.A.",
      nomeFantasia: "TR Transportes",
      cnpj: "98.765.432/0001-10",
      endereco: "Av. Logística, 456",
      cidade: "Santos",
      estado: "SP",
      cep: "11234-567",
      telefone: "(13) 2345-6789",
      email: "vendas@trtransportes.com.br",
      contato: "Maria Santos",
      status: "Ativo",
      categoria: "Logística",
      avaliacao: 4.0,
      ultimaCompra: "2024-01-10",
      totalCompras: 8500.00
    },
    {
      id: 3,
      razaoSocial: "Embalagens Premium ME",
      nomeFantasia: "Premium Pack",
      cnpj: "11.222.333/0001-44",
      endereco: "Rua das Embalagens, 789",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "21234-567",
      telefone: "(21) 3333-4444",
      email: "comercial@premiumpack.com.br",
      contato: "Carlos Oliveira",
      status: "Inativo",
      categoria: "Embalagens",
      avaliacao: 3.5,
      ultimaCompra: "2023-12-05",
      totalCompras: 12000.00
    }
  ])

  const filteredFornecedores = fornecedores.filter(fornecedor => {
    const matchesSearch = fornecedor.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fornecedor.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fornecedor.cnpj.includes(searchTerm)
    
    const matchesStatus = statusFilter === "all" || fornecedor.status === statusFilter
    const matchesCategoria = categoriaFilter === "all" || fornecedor.categoria === categoriaFilter
    
    return matchesSearch && matchesStatus && matchesCategoria
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  const handleEditFornecedor = (id: number) => {
    console.log("Editar fornecedor:", id)
  }

  const handleViewDetails = (id: number) => {
    console.log("Ver detalhes do fornecedor:", id)
  }

  const handleDeleteFornecedor = (fornecedor: FornecedorComId) => {
    console.log("Delete fornecedor:", fornecedor.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Fornecedores</h2>
          </div>
          <p className="text-muted-foreground">Gerencie seus fornecedores e parcerias</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      <Tabs defaultValue="lista" className="w-full">
        <TabsList>
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lista" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="estatisticas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Fornecedores por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Matéria-Prima', 'Logística', 'Embalagens'].map((categoria) => {
                    const count = fornecedores.filter(f => f.categoria === categoria).length
                    const percentage = (count / fornecedores.length) * 100
                    return (
                      <div key={categoria} className="flex justify-between items-center">
                        <span className="text-sm">{categoria}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Status dos Fornecedores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Ativo', 'Inativo'].map((status) => {
                    const count = fornecedores.filter(f => f.status === status).length
                    const percentage = (count / fornecedores.length) * 100
                    return (
                      <div key={status} className="flex justify-between items-center">
                        <span className="text-sm">{status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                status === 'Ativo' ? 'bg-green-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Avaliação Média</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {(fornecedores.reduce((sum, f) => sum + f.avaliacao, 0) / fornecedores.length).toFixed(1)}
                </div>
                {renderStars(fornecedores.reduce((sum, f) => sum + f.avaliacao, 0) / fornecedores.length)}
                <p className="text-sm text-muted-foreground mt-2">
                  Baseado em {fornecedores.length} fornecedores
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
