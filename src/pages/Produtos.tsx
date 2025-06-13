
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, Search, Edit, Trash2, Eye, AlertTriangle } from "lucide-react"
import { useState } from "react"

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("")
  
  const produtos = [
    { 
      id: 1, 
      codigo: "PRD-001", 
      nome: "Chapa de Aço Galvanizado 2mm", 
      categoria: "Matéria-Prima",
      unidade: "M²",
      precoVenda: 85.50,
      custoProducao: 65.20,
      estoque: 150,
      estoqueMinimo: 50,
      status: "Ativo",
      temFichaTecnica: true
    },
    { 
      id: 2, 
      codigo: "PRD-002", 
      nome: "Parafuso Allen M8x40", 
      categoria: "Componentes",
      unidade: "UN",
      precoVenda: 2.50,
      custoProducao: 1.20,
      estoque: 5000,
      estoqueMinimo: 1000,
      status: "Ativo",
      temFichaTecnica: false
    },
    { 
      id: 3, 
      codigo: "PRD-003", 
      nome: "Estrutura Metálica Personalizada", 
      categoria: "Produto Final",
      unidade: "UN",
      precoVenda: 1250.00,
      custoProducao: 890.00,
      estoque: 8,
      estoqueMinimo: 5,
      status: "Ativo",
      temFichaTecnica: true
    },
    { 
      id: 4, 
      codigo: "PRD-004", 
      nome: "Tinta Anticorrosiva", 
      categoria: "Acabamento",
      unidade: "L",
      precoVenda: 45.00,
      custoProducao: 32.00,
      estoque: 2,
      estoqueMinimo: 10,
      status: "Ativo",
      temFichaTecnica: false
    },
  ]

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const produtosBaixoEstoque = produtos.filter(p => p.estoque <= p.estoqueMinimo)

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Produtos</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Gestão de Produtos</h2>
                <p className="text-muted-foreground">Cadastro com ficha técnica e controle de estoque</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Baixo Estoque ({produtosBaixoEstoque.length})
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">248</div>
                  <div className="text-sm text-muted-foreground">Total Produtos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">210</div>
                  <div className="text-sm text-muted-foreground">Em Estoque</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{produtosBaixoEstoque.length}</div>
                  <div className="text-sm text-muted-foreground">Baixo Estoque</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">R$ 125k</div>
                  <div className="text-sm text-muted-foreground">Valor Total Estoque</div>
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
                        placeholder="Buscar por nome, código ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline">Por Categoria</Button>
                  <Button variant="outline">Com Ficha Técnica</Button>
                  <Button variant="outline">Baixo Estoque</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Produtos</CardTitle>
                <CardDescription>
                  {filteredProdutos.length} produto(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço Venda</TableHead>
                      <TableHead>Custo</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Ficha Técnica</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProdutos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-mono text-sm font-medium">{produto.codigo}</TableCell>
                        <TableCell className="font-medium">{produto.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{produto.categoria}</Badge>
                        </TableCell>
                        <TableCell>R$ {produto.precoVenda.toFixed(2)}</TableCell>
                        <TableCell>R$ {produto.custoProducao.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={produto.estoque <= produto.estoqueMinimo ? 'text-red-600 font-semibold' : ''}>
                              {produto.estoque} {produto.unidade}
                            </span>
                            {produto.estoque <= produto.estoqueMinimo && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {produto.temFichaTecnica ? (
                            <Badge variant="default">Sim</Badge>
                          ) : (
                            <Badge variant="secondary">Não</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={produto.status === 'Ativo' ? 'default' : 'secondary'}>
                            {produto.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" title="Visualizar">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Excluir">
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
                    <strong>Próxima Fase:</strong> Implementaremos ficha técnica completa (BOM), cálculo automático de custos, controle de lotes e integração com produção.
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

export default Produtos
