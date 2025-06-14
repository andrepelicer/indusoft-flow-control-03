
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Eye, Play, Pause, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"

interface OrdemProducao {
  id: number
  numero: string
  produto: string
  codigoProduto: string
  quantidade: number
  quantidadeProduzida: number
  dataInicio: string
  dataPrevisao: string
  dataFinalizacao?: string
  status: 'Planejada' | 'Em Andamento' | 'Pausada' | 'Finalizada' | 'Cancelada'
  prioridade: 'Baixa' | 'Normal' | 'Alta' | 'Urgente'
  responsavel: string
  observacoes?: string
}

export default function OrdensProducao() {
  const [ordens, setOrdens] = useState<OrdemProducao[]>([
    {
      id: 1,
      numero: "OP-2024-001",
      produto: "Peça de Aço Inox 304",
      codigoProduto: "AI304-001",
      quantidade: 100,
      quantidadeProduzida: 75,
      dataInicio: "2024-01-15",
      dataPrevisao: "2024-01-25",
      status: "Em Andamento",
      prioridade: "Alta",
      responsavel: "João Silva",
      observacoes: "Produção em linha dupla"
    },
    {
      id: 2,
      numero: "OP-2024-002",
      produto: "Chapa de Alumínio 2mm",
      codigoProduto: "AL2-002",
      quantidade: 50,
      quantidadeProduzida: 0,
      dataInicio: "2024-01-20",
      dataPrevisao: "2024-01-28",
      status: "Planejada",
      prioridade: "Normal",
      responsavel: "Maria Santos",
      observacoes: ""
    },
    {
      id: 3,
      numero: "OP-2024-003",
      produto: "Tubo de Ferro Galvanizado",
      codigoProduto: "FG-003",
      quantidade: 200,
      quantidadeProduzida: 200,
      dataInicio: "2024-01-10",
      dataPrevisao: "2024-01-18",
      dataFinalizacao: "2024-01-17",
      status: "Finalizada",
      prioridade: "Normal",
      responsavel: "Carlos Oliveira"
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

  const [novaOrdem, setNovaOrdem] = useState<Partial<OrdemProducao>>({
    numero: "",
    produto: "",
    codigoProduto: "",
    quantidade: 0,
    quantidadeProduzida: 0,
    dataInicio: "",
    dataPrevisao: "",
    status: "Planejada",
    prioridade: "Normal",
    responsavel: "",
    observacoes: ""
  })

  const getStatusColor = (status: string) => {
    const colors = {
      'Planejada': 'bg-blue-100 text-blue-800',
      'Em Andamento': 'bg-yellow-100 text-yellow-800', 
      'Pausada': 'bg-orange-100 text-orange-800',
      'Finalizada': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800'
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
        numero: `OP-2024-${String(newId).padStart(3, '0')}`
      }
      setOrdens([...ordens, ordem])
    }
    
    setIsDialogOpen(false)
    setIsEditing(false)
    setSelectedOrdem(null)
    setNovaOrdem({
      numero: "",
      produto: "",
      codigoProduto: "",
      quantidade: 0,
      quantidadeProduzida: 0,
      dataInicio: "",
      dataPrevisao: "",
      status: "Planejada",
      prioridade: "Normal",
      responsavel: "",
      observacoes: ""
    })
  }

  const handleEditar = (ordem: OrdemProducao) => {
    setSelectedOrdem(ordem)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleIniciar = (id: number) => {
    setOrdens(ordens.map(ordem =>
      ordem.id === id ? { ...ordem, status: 'Em Andamento' as const } : ordem
    ))
  }

  const handlePausar = (id: number) => {
    setOrdens(ordens.map(ordem =>
      ordem.id === id ? { ...ordem, status: 'Pausada' as const } : ordem
    ))
  }

  const handleFinalizar = (id: number) => {
    setOrdens(ordens.map(ordem =>
      ordem.id === id ? { 
        ...ordem, 
        status: 'Finalizada' as const,
        dataFinalizacao: format(new Date(), 'yyyy-MM-dd'),
        quantidadeProduzida: ordem.quantidade
      } : ordem
    ))
  }

  const handleCancelar = (id: number) => {
    setOrdens(ordens.map(ordem =>
      ordem.id === id ? { ...ordem, status: 'Cancelada' as const } : ordem
    ))
  }

  const ordensFiltradas = filtroStatus === "Todos" 
    ? ordens 
    : ordens.filter(ordem => ordem.status === filtroStatus)

  const handleProdutoChange = (codigoProduto: string) => {
    const produto = produtos.find(p => p.codigo === codigoProduto)
    if (produto) {
      if (isEditing && selectedOrdem) {
        setSelectedOrdem({
          ...selectedOrdem,
          codigoProduto: produto.codigo,
          produto: produto.nome
        })
      } else {
        setNovaOrdem({
          ...novaOrdem,
          codigoProduto: produto.codigo,
          produto: produto.nome
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ordens de Produção</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe as ordens de produção
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Ordem de Produção" : "Nova Ordem de Produção"}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? "Altere as informações da ordem" : "Preencha as informações para criar uma nova ordem"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <Select 
                  value={isEditing ? selectedOrdem?.codigoProduto : novaOrdem.codigoProduto} 
                  onValueChange={handleProdutoChange}
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
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={isEditing ? selectedOrdem?.quantidade : novaOrdem.quantidade}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    if (isEditing && selectedOrdem) {
                      setSelectedOrdem({...selectedOrdem, quantidade: value})
                    } else {
                      setNovaOrdem({...novaOrdem, quantidade: value})
                    }
                  }}
                />
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
                <Label htmlFor="responsavel">Responsável</Label>
                <Select 
                  value={isEditing ? selectedOrdem?.responsavel : novaOrdem.responsavel} 
                  onValueChange={(value) => {
                    if (isEditing && selectedOrdem) {
                      setSelectedOrdem({...selectedOrdem, responsavel: value})
                    } else {
                      setNovaOrdem({...novaOrdem, responsavel: value})
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
              
              <div className="col-span-2 space-y-2">
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
            
            <div className="flex justify-end gap-2 mt-6">
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

      {/* Filtros e Estatísticas */}
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
            Gerencie suas ordens de produção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Progresso</TableHead>
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
                    <div>
                      <div className="font-medium">{ordem.produto}</div>
                      <div className="text-sm text-muted-foreground">{ordem.codigoProduto}</div>
                    </div>
                  </TableCell>
                  <TableCell>{ordem.quantidade}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{ordem.quantidadeProduzida}/{ordem.quantidade}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all" 
                          style={{width: `${getProgressPercentage(ordem.quantidadeProduzida, ordem.quantidade)}%`}}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getProgressPercentage(ordem.quantidadeProduzida, ordem.quantidade)}%
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
                  <TableCell>{ordem.responsavel}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditar(ordem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {ordem.status === 'Planejada' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIniciar(ordem.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {ordem.status === 'Em Andamento' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePausar(ordem.id)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFinalizar(ordem.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {ordem.status === 'Pausada' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIniciar(ordem.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {(ordem.status === 'Planejada' || ordem.status === 'Pausada') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelar(ordem.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
