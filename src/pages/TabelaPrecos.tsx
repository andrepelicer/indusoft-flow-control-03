
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
import { Badge } from "@/components/ui/badge"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Edit, Trash2, D​ollarSign, Package } from "lucide-react"

interface TabelaPreco {
  id: number
  nome: string
  descricao?: string
  ativa: boolean
  dataInicio: string
  dataFim?: string
  itens: ItemTabelaPreco[]
}

interface ItemTabelaPreco {
  id: number
  produtoNome: string
  produtoCodigo: string
  preco: number
  desconto?: number
  precoFinal: number
}

export default function TabelaPrecos() {
  const { toast } = useToast()
  const [tabelas, setTabelas] = useState<TabelaPreco[]>([
    {
      id: 1,
      nome: "Tabela Padrão",
      descricao: "Preços padrão para vendas",
      ativa: true,
      dataInicio: "2024-01-01",
      itens: [
        {
          id: 1,
          produtoNome: "Produto A",
          produtoCodigo: "PA001",
          preco: 100.00,
          desconto: 0,
          precoFinal: 100.00
        },
        {
          id: 2,
          produtoNome: "Produto B",
          produtoCodigo: "PB002",
          preco: 250.00,
          desconto: 10,
          precoFinal: 225.00
        }
      ]
    },
    {
      id: 2,
      nome: "Tabela Promocional",
      descricao: "Preços especiais para promoção",
      ativa: false,
      dataInicio: "2024-06-01",
      dataFim: "2024-06-30",
      itens: [
        {
          id: 3,
          produtoNome: "Produto A",
          produtoCodigo: "PA001",
          preco: 100.00,
          desconto: 20,
          precoFinal: 80.00
        }
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTabela, setSelectedTabela] = useState<TabelaPreco | null>(null)

  const filteredTabelas = tabelas.filter(tabela =>
    tabela.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tabela.descricao && tabela.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const toggleTabelaStatus = (id: number) => {
    setTabelas(prev => prev.map(tabela => 
      tabela.id === id ? { ...tabela, ativa: !tabela.ativa } : tabela
    ))
    
    const tabela = tabelas.find(t => t.id === id)
    toast({
      title: `Tabela ${tabela?.ativa ? 'desativada' : 'ativada'}`,
      description: `A tabela "${tabela?.nome}" foi ${tabela?.ativa ? 'desativada' : 'ativada'} com sucesso.`,
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tabela de Preços</h1>
          <p className="text-gray-600">Gerencie as tabelas de preços dos produtos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Tabelas */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Tabelas de Preços
                  </CardTitle>
                  <CardDescription>
                    {tabelas.length} tabela(s) cadastrada(s)
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Tabela
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar tabelas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredTabelas.map((tabela) => (
                  <div
                    key={tabela.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTabela?.id === tabela.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTabela(tabela)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{tabela.nome}</h3>
                      <Badge variant={tabela.ativa ? "default" : "secondary"}>
                        {tabela.ativa ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    {tabela.descricao && (
                      <p className="text-sm text-gray-600 mb-2">{tabela.descricao}</p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Início: {formatDate(tabela.dataInicio)}</span>
                      <span>{tabela.itens.length} produto(s)</span>
                    </div>
                    {tabela.dataFim && (
                      <div className="text-sm text-gray-500">
                        Fim: {formatDate(tabela.dataFim)}
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant={tabela.ativa ? "secondary" : "default"}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTabelaStatus(tabela.id)
                        }}
                      >
                        {tabela.ativa ? "Desativar" : "Ativar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Tabela Selecionada */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produtos da Tabela
              </CardTitle>
              <CardDescription>
                {selectedTabela 
                  ? `Preços da tabela "${selectedTabela.nome}"`
                  : "Selecione uma tabela para ver os produtos"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTabela ? (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {selectedTabela.itens.length} produto(s) na tabela
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Produto
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Desconto</TableHead>
                          <TableHead>Final</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTabela.itens.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.produtoNome}</div>
                                <div className="text-sm text-gray-500">{item.produtoCodigo}</div>
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(item.preco)}</TableCell>
                            <TableCell>
                              {item.desconto ? `${item.desconto}%` : "-"}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(item.precoFinal)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione uma tabela para visualizar os produtos e preços</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  )
}
