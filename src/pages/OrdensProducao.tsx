
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Eye, Play, Pause, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface EtapaProducao {
  id: number
  nome: string
  ordem: number
  concluida: boolean
  dataConclusao?: string
  responsavel: string
  observacoes?: string
}

interface ProdutoOrdem {
  id: number
  codigoProduto: string
  nomeProduto: string
  quantidade: number
  quantidadeProduzida: number
  dataInicioProduto: string
  dataPrevisaoProduto: string
  dataFinalizacaoProduto?: string
  status: 'Pendente' | 'Em Andamento' | 'Pausado' | 'Finalizado' | 'Cancelado'
  etapas: EtapaProducao[]
}

interface OrdemProducao {
  id: number
  numero: string
  descricao: string
  dataInicio: string
  dataPrevisao: string
  dataFinalizacao?: string
  status: 'Planejada' | 'Em Andamento' | 'Pausada' | 'Finalizada' | 'Cancelada'
  prioridade: 'Baixa' | 'Normal' | 'Alta' | 'Urgente'
  responsavelGeral: string
  observacoes?: string
  produtos: ProdutoOrdem[]
}

const etapasDisponiveis = [
  "Preparação de Material",
  "Corte",
  "Usinagem", 
  "Soldagem",
  "Montagem",
  "Acabamento",
  "Controle de Qualidade",
  "Embalagem"
]

export default function OrdensProducao() {
  const [ordens, setOrdens] = useState<OrdemProducao[]>([
    {
      id: 1,
      numero: "OP-2024-001",
      descricao: "Produção de peças para projeto industrial",
      dataInicio: "2024-01-15",
      dataPrevisao: "2024-01-25",
      status: "Em Andamento",
      prioridade: "Alta",
      responsavelGeral: "João Silva",
      observacoes: "Produção em linha dupla",
      produtos: [
        {
          id: 1,
          codigoProduto: "AI304-001",
          nomeProduto: "Peça de Aço Inox 304",
          quantidade: 100,
          quantidadeProduzida: 75,
          dataInicioProduto: "2024-01-15",
          dataPrevisaoProduto: "2024-01-22",
          status: "Em Andamento",
          etapas: [
            { id: 1, nome: "Preparação de Material", ordem: 1, concluida: true, dataConclusao: "2024-01-15", responsavel: "João Silva" },
            { id: 2, nome: "Corte", ordem: 2, concluida: true, dataConclusao: "2024-01-16", responsavel: "João Silva" },
            { id: 3, nome: "Usinagem", ordem: 3, concluida: false, responsavel: "Maria Santos" }
          ]
        },
        {
          id: 2,
          codigoProduto: "AL2-002",
          nomeProduto: "Chapa de Alumínio 2mm",
          quantidade: 50,
          quantidadeProduzida: 20,
          dataInicioProduto: "2024-01-16",
          dataPrevisaoProduto: "2024-01-24",
          status: "Em Andamento",
          etapas: [
            { id: 1, nome: "Preparação de Material", ordem: 1, concluida: true, dataConclusao: "2024-01-16", responsavel: "Carlos Oliveira" },
            { id: 2, nome: "Corte", ordem: 2, concluida: false, responsavel: "Carlos Oliveira" }
          ]
        }
      ]
    }
  ])

  const [produtos] = useState([
    { id: 1, codigo: "AI304-001", nome: "Peça de Aço Inox 304" },
    { id: 2, codigo: "AL2-002", nome: "Chapa de Alumínio 2mm" },
    { id: 3, codigo: "FG-003", nome: "Tubo de Ferro Galvanizado" },
    { id: 4, codigo: "AC-004", nome: "Perfil de Aço Carbono" }
  ])

  const [responsaveis] = useState([
    "João Silva",
    "Maria Santos", 
    "Carlos Oliveira",
    "Ana Costa",
    "Pedro Souza"
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOrdem, setSelectedOrdem] = useState<OrdemProducao | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState<string>("Todos")
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false)

  const [novaOrdem, setNovaOrdem] = useState<Partial<OrdemProducao>>({
    numero: "",
    descricao: "",
    dataInicio: "",
    dataPrevisao: "",
    status: "Planejada",
    prioridade: "Normal",
    responsavelGeral: "",
    observacoes: "",
    produtos: []
  })

  const [novoProduto, setNovoProduto] = useState<Partial<ProdutoOrdem>>({
    codigoProduto: "",
    nomeProduto: "",
    quantidade: 0,
    quantidadeProduzida: 0,
    dataInicioProduto: "",
    dataPrevisaoProduto: "",
    status: "Pendente",
    etapas: []
  })

  const getStatusColor = (status: string) => {
    const colors = {
      'Planejada': 'bg-blue-100 text-blue-800',
      'Em Andamento': 'bg-yellow-100 text-yellow-800', 
      'Pausada': 'bg-orange-100 text-orange-800',
      'Finalizada': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800',
      'Pendente': 'bg-gray-100 text-gray-800',
      'Pausado': 'bg-orange-100 text-orange-800',
      'Finalizado': 'bg-green-100 text-green-800',
      'Cancelado': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      'Baixa': 'bg-gray-100 text-gray-800',
      'Normal': 'bg-blue-100 text-blue-800',
      'Alta': 'bg-orange-100 text-orange-800',
      'Urgente': 'bg-red-100 text-red-800'
    }
    return colors[prioridade as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getProgressPercentage = (produzida: number, total: number) => {
    return total > 0 ? Math.round((produzida / total) * 100) : 0
  }

  const handleSalvar = () => {
    if (isEditing && selectedOrdem) {
      setOrdens(ordens.map(ordem => 
        ordem.id === selectedOrdem.id ? { ...selectedOrdem } : ordem
      ))
    } else {
      const newId = Math.max(...ordens.map(o => o.id)) + 1
      const ordem: OrdemProducao = {
        ...novaOrdem as OrdemProducao,
        id: newId,
        numero: `OP-2024-${String(newId).padStart(3, '0')}`,
        produtos: novaOrdem.produtos || []
      }
      setOrdens([...ordens, ordem])
    }
    
    setIsDialogOpen(false)
    setIsEditing(false)
    setSelectedOrdem(null)
    setNovaOrdem({
      numero: "",
      descricao: "",
      dataInicio: "",
      dataPrevisao: "",
      status: "Planejada",
      prioridade: "Normal",
      responsavelGeral: "",
      observacoes: "",
      produtos: []
    })
  }

  const handleEditar = (ordem: OrdemProducao) => {
    setSelectedOrdem(ordem)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleVerDetalhes = (ordem: OrdemProducao) => {
    setSelectedOrdem(ordem)
    setIsDetalhesOpen(true)
  }

  const adicionarProduto = () => {
    if (!novoProduto.codigoProduto || !novoProduto.quantidade) return

    const produto = produtos.find(p => p.codigo === novoProduto.codigoProduto)
    if (!produto) return

    const produtoCompleto: ProdutoOrdem = {
      id: Date.now(),
      codigoProduto: produto.codigo,
      nomeProduto: produto.nome,
      quantidade: novoProduto.quantidade || 0,
      quantidadeProduzida: 0,
      dataInicioProduto: novoProduto.dataInicioProduto || "",
      dataPrevisaoProduto: novoProduto.dataPrevisaoProduto || "",
      status: "Pendente",
      etapas: []
    }

    if (isEditing && selectedOrdem) {
      setSelectedOrdem({
        ...selectedOrdem,
        produtos: [...selectedOrdem.produtos, produtoCompleto]
      })
    } else {
      setNovaOrdem({
        ...novaOrdem,
        produtos: [...(novaOrdem.produtos || []), produtoCompleto]
      })
    }

    setNovoProduto({
      codigoProduto: "",
      nomeProduto: "",
      quantidade: 0,
      quantidadeProduzida: 0,
      dataInicioProduto: "",
      dataPrevisaoProduto: "",
      status: "Pendente",
      etapas: []
    })
  }

  const removerProduto = (produtoId: number) => {
    if (isEditing && selectedOrdem) {
      setSelectedOrdem({
        ...selectedOrdem,
        produtos: selectedOrdem.produtos.filter(p => p.id !== produtoId)
      })
    } else {
      setNovaOrdem({
        ...novaOrdem,
        produtos: (novaOrdem.produtos || []).filter(p => p.id !== produtoId)
      })
    }
  }

  const ordensFiltradas = filtroStatus === "Todos" 
    ? ordens 
    : ordens.filter(ordem => ordem.status === filtroStatus)

  const getTotalProdutos = (ordem: OrdemProducao) => {
    return ordem.produtos.reduce((total, produto) => total + produto.quantidade, 0)
  }

  const getTotalProduzidos = (ordem: OrdemProducao) => {
    return ordem.produtos.reduce((total, produto) => total + produto.quantidadeProduzida, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ordens de Produção</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe as ordens de produção com múltiplos produtos
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditing(false)
              setSelectedOrdem(null)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ordem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Ordem de Produção" : "Nova Ordem de Produção"}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? "Altere as informações da ordem" : "Preencha as informações para criar uma nova ordem"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição da Ordem</Label>
                  <Input
                    id="descricao"
                    value={isEditing ? selectedOrdem?.descricao : novaOrdem.descricao}
                    onChange={(e) => {
                      if (isEditing && selectedOrdem) {
                        setSelectedOrdem({...selectedOrdem, descricao: e.target.value})
                      } else {
                        setNovaOrdem({...novaOrdem, descricao: e.target.value})
                      }
                    }}
                    placeholder="Descrição da ordem de produção"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsavelGeral">Responsável Geral</Label>
                  <Select 
                    value={isEditing ? selectedOrdem?.responsavelGeral : novaOrdem.responsavelGeral} 
                    onValueChange={(value) => {
                      if (isEditing && selectedOrdem) {
                        setSelectedOrdem({...selectedOrdem, responsavelGeral: value})
                      } else {
                        setNovaOrdem({...novaOrdem, responsavelGeral: value})
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {responsaveis.map((responsavel) => (
                        <SelectItem key={responsavel} value={responsavel}>
                          {responsavel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={isEditing ? selectedOrdem?.dataInicio : novaOrdem.dataInicio}
                    onChange={(e) => {
                      if (isEditing && selectedOrdem) {
                        setSelectedOrdem({...selectedOrdem, dataInicio: e.target.value})
                      } else {
                        setNovaOrdem({...novaOrdem, dataInicio: e.target.value})
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataPrevisao">Data de Previsão</Label>
                  <Input
                    id="dataPrevisao"
                    type="date"
                    value={isEditing ? selectedOrdem?.dataPrevisao : novaOrdem.dataPrevisao}
                    onChange={(e) => {
                      if (isEditing && selectedOrdem) {
                        setSelectedOrdem({...selectedOrdem, dataPrevisao: e.target.value})
                      } else {
                        setNovaOrdem({...novaOrdem, dataPrevisao: e.target.value})
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select 
                    value={isEditing ? selectedOrdem?.prioridade : novaOrdem.prioridade} 
                    onValueChange={(value) => {
                      if (isEditing && selectedOrdem) {
                        setSelectedOrdem({...selectedOrdem, prioridade: value as any})
                      } else {
                        setNovaOrdem({...novaOrdem, prioridade: value as any})
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input
                    id="observacoes"
                    value={isEditing ? selectedOrdem?.observacoes : novaOrdem.observacoes}
                    onChange={(e) => {
                      if (isEditing && selectedOrdem) {
                        setSelectedOrdem({...selectedOrdem, observacoes: e.target.value})
                      } else {
                        setNovaOrdem({...novaOrdem, observacoes: e.target.value})
                      }
                    }}
                    placeholder="Observações sobre a ordem"
                  />
                </div>
              </div>

              {/* Adicionar Produtos */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Adicionar Produto</h3>
                <div className="grid grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Produto</Label>
                    <Select 
                      value={novoProduto.codigoProduto} 
                      onValueChange={(value) => {
                        const produto = produtos.find(p => p.codigo === value)
                        setNovoProduto({
                          ...novoProduto,
                          codigoProduto: value,
                          nomeProduto: produto?.nome || ""
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {produtos.map((produto) => (
                          <SelectItem key={produto.id} value={produto.codigo}>
                            {produto.codigo} - {produto.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      value={novoProduto.quantidade}
                      onChange={(e) => setNovoProduto({
                        ...novoProduto,
                        quantidade: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Data Início</Label>
                    <Input
                      type="date"
                      value={novoProduto.dataInicioProduto}
                      onChange={(e) => setNovoProduto({
                        ...novoProduto,
                        dataInicioProduto: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Data Previsão</Label>
                    <Input
                      type="date"
                      value={novoProduto.dataPrevisaoProduto}
                      onChange={(e) => setNovoProduto({
                        ...novoProduto,
                        dataPrevisaoProduto: e.target.value
                      })}
                    />
                  </div>
                </div>
                <Button onClick={adicionarProduto} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Produto
                </Button>
              </div>

              {/* Lista de Produtos */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Produtos da Ordem</h3>
                <div className="space-y-2">
                  {(isEditing ? selectedOrdem?.produtos : novaOrdem.produtos)?.map((produto) => (
                    <div key={produto.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{produto.nomeProduto}</div>
                        <div className="text-sm text-muted-foreground">
                          {produto.codigoProduto} - Qtd: {produto.quantidade} - 
                          Início: {produto.dataInicioProduto} - Previsão: {produto.dataPrevisaoProduto}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removerProduto(produto.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvar}>
                {isEditing ? "Salvar Alterações" : "Criar Ordem"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total de Ordens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordens.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {ordens.filter(o => o.status === 'Em Andamento').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Finalizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ordens.filter(o => o.status === 'Finalizada').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Filtrar por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Planejada">Planejada</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Pausada">Pausada</SelectItem>
                <SelectItem value="Finalizada">Finalizada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Ordens */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ordens de Produção</CardTitle>
          <CardDescription>
            Gerencie suas ordens de produção com múltiplos produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Progresso Total</TableHead>
                <TableHead>Data Previsão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordensFiltradas.map((ordem) => (
                <TableRow key={ordem.id}>
                  <TableCell className="font-medium">{ordem.numero}</TableCell>
                  <TableCell>
                    <div className="font-medium">{ordem.descricao}</div>
                    <div className="text-sm text-muted-foreground">{ordem.produtos.length} produtos</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {ordem.produtos.slice(0, 2).map((produto) => (
                        <div key={produto.id} className="text-sm">
                          {produto.nomeProduto} ({produto.quantidade})
                        </div>
                      ))}
                      {ordem.produtos.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{ordem.produtos.length - 2} produtos
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{getTotalProduzidos(ordem)}/{getTotalProdutos(ordem)}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all" 
                          style={{width: `${getProgressPercentage(getTotalProduzidos(ordem), getTotalProdutos(ordem))}%`}}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getProgressPercentage(getTotalProduzidos(ordem), getTotalProdutos(ordem))}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(ordem.dataPrevisao), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ordem.status)}>
                      {ordem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPrioridadeColor(ordem.prioridade)}>
                      {ordem.prioridade}
                    </Badge>
                  </TableCell>
                  <TableCell>{ordem.responsavelGeral}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerDetalhes(ordem)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditar(ordem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={isDetalhesOpen} onOpenChange={setIsDetalhesOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Ordem - {selectedOrdem?.numero}</DialogTitle>
            <DialogDescription>
              Acompanhe o progresso detalhado de cada produto e suas etapas
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrdem && (
            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <strong>Descrição:</strong> {selectedOrdem.descricao}
                </div>
                <div>
                  <strong>Responsável Geral:</strong> {selectedOrdem.responsavelGeral}
                </div>
                <div>
                  <strong>Data Início:</strong> {format(new Date(selectedOrdem.dataInicio), 'dd/MM/yyyy')}
                </div>
                <div>
                  <strong>Data Previsão:</strong> {format(new Date(selectedOrdem.dataPrevisao), 'dd/MM/yyyy')}
                </div>
              </div>

              {/* Produtos e Etapas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Produtos e Etapas</h3>
                {selectedOrdem.produtos.map((produto) => (
                  <Card key={produto.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{produto.nomeProduto}</CardTitle>
                          <CardDescription>{produto.codigoProduto}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(produto.status)}>
                          {produto.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Quantidade:</strong> {produto.quantidadeProduzida}/{produto.quantidade}
                        </div>
                        <div>
                          <strong>Data Início:</strong> {format(new Date(produto.dataInicioProduto), 'dd/MM/yyyy')}
                        </div>
                        <div>
                          <strong>Data Previsão:</strong> {format(new Date(produto.dataPrevisaoProduto), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Etapas de Produção:</div>
                        {produto.etapas.length > 0 ? (
                          <div className="space-y-1">
                            {produto.etapas.map((etapa) => (
                              <div key={etapa.id} className="flex items-center justify-between p-2 border rounded">
                                <div className="flex items-center space-x-2">
                                  {etapa.concluida ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <div className="h-4 w-4 border rounded-full" />
                                  )}
                                  <span className={etapa.concluida ? "line-through text-muted-foreground" : ""}>
                                    {etapa.nome}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {etapa.responsavel}
                                  {etapa.dataConclusao && (
                                    <span className="ml-2">
                                      Concluída em {format(new Date(etapa.dataConclusao), 'dd/MM/yyyy')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">Nenhuma etapa definida</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
