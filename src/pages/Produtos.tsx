import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, Search, Edit, Trash2, Eye, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { ProdutoForm } from "@/components/ProdutoForm"
import { type Produto } from "@/lib/validations"
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

type ProdutoComId = Produto & { id: number }

const PRODUTOS_INICIAIS: ProdutoComId[] = [
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
    status: "Ativo" as const,
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
    status: "Ativo" as const,
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
    status: "Ativo" as const,
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
    status: "Ativo" as const,
    temFichaTecnica: false
  },
]

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduto, setEditingProduto] = useState<ProdutoComId | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [produtoToDelete, setProdutoToDelete] = useState<number | null>(null)
  const { toast } = useToast()
  
  const [produtos, setProdutos] = useState<ProdutoComId[]>([])

  // Carregar produtos do localStorage ou usar dados iniciais
  useEffect(() => {
    const produtosSalvos = localStorage.getItem('produtos')
    if (produtosSalvos) {
      try {
        setProdutos(JSON.parse(produtosSalvos))
      } catch (error) {
        console.error('Erro ao carregar produtos do localStorage:', error)
        setProdutos(PRODUTOS_INICIAIS)
        localStorage.setItem('produtos', JSON.stringify(PRODUTOS_INICIAIS))
      }
    } else {
      setProdutos(PRODUTOS_INICIAIS)
      localStorage.setItem('produtos', JSON.stringify(PRODUTOS_INICIAIS))
    }
  }, [])

  // Salvar produtos no localStorage sempre que a lista for atualizada
  useEffect(() => {
    if (produtos.length > 0) {
      localStorage.setItem('produtos', JSON.stringify(produtos))
    }
  }, [produtos])

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const produtosBaixoEstoque = produtos.filter(p => p.estoque <= p.estoqueMinimo)
  const valorTotalEstoque = produtos.reduce((sum, p) => sum + (p.precoVenda * p.estoque), 0)

  const handleSaveProduto = (produtoData: Produto) => {
    if (editingProduto) {
      setProdutos(prev => prev.map(p => 
        p.id === editingProduto.id ? { ...produtoData, id: editingProduto.id } as ProdutoComId : p
      ))
    } else {
      const newId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1
      setProdutos(prev => [...prev, { ...produtoData, id: newId } as ProdutoComId])
    }
    setEditingProduto(undefined)
  }

  const handleEditProduto = (produto: ProdutoComId) => {
    setEditingProduto(produto)
    setFormOpen(true)
  }

  const handleDeleteProduto = (id: number) => {
    setProdutoToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (produtoToDelete) {
      setProdutos(prev => prev.filter(p => p.id !== produtoToDelete))
      toast({
        title: "Produto excluído",
        description: "O produto foi removido com sucesso.",
      })
    }
    setDeleteDialogOpen(false)
    setProdutoToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Produtos</h2>
          <p className="text-muted-foreground">Cadastro com ficha técnica e controle de estoque</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Baixo Estoque ({produtosBaixoEstoque.length})
          </Button>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{produtos.length}</div>
            <div className="text-sm text-muted-foreground">Total Produtos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {produtos.filter(p => p.status === 'Ativo').length}
            </div>
            <div className="text-sm text-muted-foreground">Ativos</div>
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
            <div className="text-2xl font-bold text-blue-600">
              R$ {(valorTotalEstoque / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-muted-foreground">Valor Total Estoque</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px]">
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
            <Button variant="outline" size="sm">Por Categoria</Button>
            <Button variant="outline" size="sm">Com Ficha Técnica</Button>
            <Button variant="outline" size="sm">Baixo Estoque</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lista de Produtos
          </CardTitle>
          <CardDescription>
            {filteredProdutos.length} produto(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead>Preço Venda</TableHead>
                  <TableHead className="hidden lg:table-cell">Custo</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="hidden lg:table-cell">Ficha Técnica</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-mono text-sm font-medium">{produto.codigo}</TableCell>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{produto.categoria}</Badge>
                    </TableCell>
                    <TableCell>R$ {produto.precoVenda.toFixed(2)}</TableCell>
                    <TableCell className="hidden lg:table-cell">R$ {produto.custoProducao.toFixed(2)}</TableCell>
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
                    <TableCell className="hidden lg:table-cell">
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
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Editar"
                          onClick={() => handleEditProduto(produto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Excluir"
                          onClick={() => handleDeleteProduto(produto.id)}
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

      <ProdutoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        produto={editingProduto}
        onSave={handleSaveProduto}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
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

export default Produtos
