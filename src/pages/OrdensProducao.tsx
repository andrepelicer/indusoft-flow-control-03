import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Eye, Play, Pause, CheckCircle, XCircle, Trash2, Settings, Check } from "lucide-react"
import { format } from "date-fns"
import EtapasProducaoManager from "@/components/EtapasProducaoManager"
import { useOrdensProducao, OrdemProducao } from "@/contexts/OrdensProducaoContext"

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

interface OrdemProducaoCompleta extends Omit<OrdemProducao, 'status'> {
  dataInicio: string
  dataPrevisao: string
  dataFinalizacao?: string
  status: 'Planejada' | 'Em Andamento' | 'Pausada' | 'Finalizada' | 'Cancelada'
  prioridade: 'Baixa' | 'Normal' | 'Alta' | 'Urgente'
  responsavelGeral: string
  produtos: ProdutoOrdem[]
}

type ProdutoComId = {
  id: number
  codigo: string
  nome: string
  categoria: string
  unidade: string
  precoVenda: number
  custoProducao: number
  estoque: number
  estoqueMinimo: number
  status: 'Ativo' | 'Inativo'
  temFichaTecnica: boolean
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
  const { ordens: ordensContext, adicionarOrdem, atualizarOrdem } = useOrdensProducao()
  
  // Estado para etapas cadastradas
  const [etapasCadastradas] = useState([
    { id: 1, nome: "Preparação de Material", descricao: "Separação e preparação dos materiais necessários", ordem: 1, ativo: true },
    { id: 2, nome: "Corte", descricao: "Corte das peças conforme especificações", ordem: 2, ativo: true },
    { id: 3, nome: "Usinagem", descricao: "Processo de usinagem das peças", ordem: 3, ativo: true },
    { id: 4, nome: "Soldagem", descricao: "Soldagem de componentes", ordem: 4, ativo: true },
    { id: 5, nome: "Montagem", descricao: "Montagem final do produto", ordem: 5, ativo: true },
    { id: 6, nome: "Acabamento", descricao: "Acabamento e polimento", ordem: 6, ativo: true },
    { id: 7, nome: "Controle de Qualidade", descricao: "Inspeção e controle de qualidade", ordem: 7, ativo: true },
    { id: 8, nome: "Embalagem", descricao: "Embalagem do produto final", ordem: 8, ativo: true }
  ])

  // Converter ordens do contexto para o formato usado nesta página
  const [ordens, setOrdens] = useState<OrdemProducaoCompleta[]>([])

  useEffect(() => {
    const ordensConvertidas: OrdemProducaoCompleta[] = ordensContext.map(ordem => ({
      id: ordem.id,
      numero: ordem.numero,
      descricao: ordem.observacoes || "Ordem de produção",
      dataInicio: ordem.dataCriacao,
      dataPrevisao: ordem.dataPrevisao,
      status: ordem.status === 'Pendente' ? 'Planejada' : 
              ordem.status === 'Em Andamento' ? 'Em Andamento' :
              ordem.status === 'Concluído' ? 'Finalizada' :
              ordem.status === 'Cancelado' ? 'Cancelada' : 'Planejada',
      prioridade: 'Normal' as const,
      responsavelGeral: "Responsável Padrão",
      observacoes: ordem.observacoes,
      produtos: [{
        id: 1,
        codigoProduto: ordem.codigo,
        nomeProduto: ordem.produto,
        quantidade: ordem.quantidade,
        quantidadeProduzida: 0,
        dataInicioProduto: ordem.dataCriacao,
        dataPrevisaoProduto: ordem.dataPrevisao,
        status: 'Pendente' as const,
        etapas: []
      }]
    }))
    setOrdens(ordensConvertidas)
  }, [ordensContext])

  const [produtos, setProdutos] = useState<ProdutoComId[]>([])

  // Carregar produtos do localStorage
  useEffect(() => {
    const produtosSalvos = localStorage.getItem('produtos')
    if (produtosSalvos) {
      try {
        const produtosData = JSON.parse(produtosSalvos)
        // Filtrar apenas produtos ativos
        const produtosAtivos = produtosData.filter((produto: ProdutoComId) => produto.status === 'Ativo')
        setProdutos(produtosAtivos)
      } catch (error) {
        console.error('Erro ao carregar produtos do localStorage:', error)
        setProdutos([])
      }
    } else {
      setProdutos([])
    }
  }, [])

  const [responsaveis] = useState([
    "João Silva",
    "Maria Santos", 
    "Carlos Oliveira",
    "Ana Costa",
    "Pedro Souza"
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOrdem, setSelectedOrdem] = useState<OrdemProducaoCompleta | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState<string>("Todos")
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false)
  const [isEtapasDialogOpen, setIsEtapasDialogOpen] = useState(false)
  const [isProntoDialogOpen, setIsProntoDialogOpen] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<ProdutoOrdem | null>(null)
  const [dataFinalizacao, setDataFinalizacao] = useState("")

  const [novaOrdem, setNovaOrdem] = useState<Partial<OrdemProducaoCompleta>>({
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
    console.log('Salvando ordem:', { isEditing, selectedOrdem, novaOrdem })
    
    if (isEditing && selectedOrdem) {
      // Atualizar ordem existente
      const ordemAtualizada: OrdemProducao = {
        id: selectedOrdem.id,
        numero: selectedOrdem.numero,
        produtoId: selectedOrdem.produtos[0]?.id || 1,
        produto: selectedOrdem.produtos[0]?.nomeProduto || selectedOrdem.descricao,
        codigo: selectedOrdem.produtos[0]?.codigoProduto || "",
        quantidade: selectedOrdem.produtos[0]?.quantidade || 0,
        status: selectedOrdem.status === 'Planejada' ? 'Pendente' :
                selectedOrdem.status === 'Em Andamento' ? 'Em Andamento' :
                selectedOrdem.status === 'Finalizada' ? 'Concluído' :
                selectedOrdem.status === 'Cancelada' ? 'Cancelado' : 'Pendente',
        dataCriacao: selectedOrdem.dataInicio,
        dataPrevisao: selectedOrdem.dataPrevisao,
        observacoes: selectedOrdem.observacoes || ""
      }
      
      atualizarOrdem(selectedOrdem.id, ordemAtualizada)
    } else {
      // Criar nova ordem
      if (novaOrdem.produtos && novaOrdem.produtos.length > 0) {
        const produto = novaOrdem.produtos[0]
        const ordemParaContexto: Omit<OrdemProducao, 'id'> = {
          numero: `OP-${Date.now()}`,
          produtoId: produto.id,
          produto: produto.nomeProduto,
          codigo: produto.codigoProduto,
          quantidade: produto.quantidade,
          status: 'Pendente',
          dataCriacao: novaOrdem.dataInicio || new Date().toISOString().split('T')[0],
          dataPrevisao: novaOrdem.dataPrevisao || new Date().toISOString().split('T')[0],
          observacoes: novaOrdem.observacoes || ""
        }
        
        adicionarOrdem(ordemParaContexto)
      }
    }
    
    // Resetar formulário
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

  const handleEditar = (ordem: OrdemProducaoCompleta) => {
    console.log('Editando ordem:', ordem)
    setSelectedOrdem(ordem)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleVerDetalhes = (ordem: OrdemProducaoCompleta) => {
    setSelectedOrdem(ordem)
    setIsDetalhesOpen(true)
  }

  const adicionarProduto = () => {
    console.log('Adicionando produto:', novoProduto)
    
    if (!novoProduto.codigoProduto || !novoProduto.quantidade) {
      console.log('Produto inválido - faltam dados')
      return
    }

    const produto = produtos.find(p => p.codigo === novoProduto.codigoProduto)
    if (!produto) {
      console.log('Produto não encontrado:', novoProduto.codigoProduto)
      return
    }

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

    // Resetar formulário de produto
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

  const getTotalProdutos = (ordem: OrdemProducaoCompleta) => {
    return ordem.produtos.reduce((total, produto) => total + produto.quantidade, 0)
  }

  const getTotalProduzidos = (ordem: OrdemProducaoCompleta) => {
    return ordem.produtos.reduce((total, produto) => total + produto.quantidadeProduzida, 0)
  }

  const handleAlterarEtapas = (produto: ProdutoOrdem) => {
    setSelectedProduto(produto)
    setIsEtapasDialogOpen(true)
  }

  const handleMarcarPronto = (produto: ProdutoOrdem) => {
    setSelectedProduto(produto)
    setDataFinalizacao("")
    setIsProntoDialogOpen(true)
  }

  const confirmarProdutoPronto = () => {
    if (!selectedProduto || !dataFinalizacao || !selectedOrdem) return

    const novasOrdens = ordens.map(ordem => {
      if (ordem.id === selectedOrdem.id) {
        return {
          ...ordem,
          produtos: ordem.produtos.map(produto => 
            produto.id === selectedProduto.id 
              ? { 
                  ...produto, 
                  status: 'Finalizado' as const,
                  quantidadeProduzida: produto.quantidade,
                  dataFinalizacaoProduto: dataFinalizacao
                }
              : produto
          )
        }
      }
      return ordem
    })

    setOrdens(novasOrdens)
    setSelectedOrdem(novasOrdens.find(o => o.id === selectedOrdem.id) || null)
    setIsProntoDialogOpen(false)
    setSelectedProduto(null)
    setDataFinalizacao("")
  }

  const updateEtapasProduto = (novasEtapas: any[]) => {
    if (!selectedProduto || !selectedOrdem) return

    const novasOrdens = ordens.map(ordem => {
      if (ordem.id === selectedOrdem.id) {
        return {
          ...ordem,
          produtos: ordem.produtos.map(produto => 
            produto.id === selectedProduto.id 
              ? { ...produto, etapas: novasEtapas }
              : produto
          )
        }
      }
      return ordem
    })

    setOrdens(novasOrdens)
    setSelectedOrdem(novasOrdens.find(o => o.id === selectedOrdem.id) || null)
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
              console.log('Abrindo dialog para nova ordem')
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
                      console.log('Alterando descrição:', e.target.value)
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
                        console.log('Selecionando produto:', value)
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
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(produto.status)}>
                            {produto.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAlterarEtapas(produto)}
                            disabled={produto.status === 'Finalizado'}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Alterar Etapas
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarcarPronto(produto)}
                            disabled={produto.status === 'Finalizado'}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Marcar Pronto
                          </Button>
                        </div>
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
                        {produto.dataFinalizacaoProduto && (
                          <div>
                            <strong>Data Finalização:</strong> {format(new Date(produto.dataFinalizacaoProduto), 'dd/MM/yyyy')}
                          </div>
                        )}
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

      {/* Modal de Alterar Etapas */}
      <Dialog open={isEtapasDialogOpen} onOpenChange={setIsEtapasDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Alterar Etapas - {selectedProduto?.nomeProduto}</DialogTitle>
            <DialogDescription>
              Gerencie as etapas de produção do produto
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduto && (
            <EtapasProducaoManager
              etapas={selectedProduto.etapas}
              onEtapasChange={updateEtapasProduto}
              responsaveis={responsaveis}
              etapasCadastradas={etapasCadastradas}
            />
          )}
          
          <div className="flex justify-end mt-6">
            <Button onClick={() => setIsEtapasDialogOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Marcar Produto Pronto */}
      <Dialog open={isProntoDialogOpen} onOpenChange={setIsProntoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar Produto como Pronto</DialogTitle>
            <DialogDescription>
              Confirme que o produto {selectedProduto?.nomeProduto} foi finalizado
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataFinalizacao">Data de Finalização</Label>
              <Input
                id="dataFinalizacao"
                type="date"
                value={dataFinalizacao}
                onChange={(e) => setDataFinalizacao(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsProntoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarProdutoPronto} disabled={!dataFinalizacao}>
              Confirmar Finalização
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
