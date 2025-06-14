import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, Plus, Search, DollarSign, AlertCircle, CheckCircle, Undo2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ContaDetalhesModal } from "@/components/contas-receber/ContaDetalhesModal"
import { RecebimentoModal } from "@/components/contas-receber/RecebimentoModal"
import { ContaEdicaoModal } from "@/components/contas-receber/ContaEdicaoModal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ContaReceber {
  id: number
  numeroDocumento: string
  cliente: string
  descricao: string
  dataVencimento: string
  dataPagamento?: string
  valorOriginal: number
  valorPago?: number
  status: "Pendente" | "Pago" | "Vencido" | "Parcial"
  formaPagamento?: string
}

export default function ContasReceber() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Modals state
  const [detalhesModal, setDetalhesModal] = useState({ isOpen: false, conta: null as ContaReceber | null })
  const [recebimentoModal, setRecebimentoModal] = useState({ isOpen: false, contaId: null as number | null })
  const [edicaoModal, setEdicaoModal] = useState({ isOpen: false, conta: null as ContaReceber | null })
  
  const [contas, setContas] = useState<ContaReceber[]>([
    {
      id: 1,
      numeroDocumento: "FAT-2024-001",
      cliente: "Empresa ABC Ltda",
      descricao: "Venda de produtos industriais",
      dataVencimento: "2024-02-15",
      dataPagamento: "2024-02-10",
      valorOriginal: 1250.00,
      valorPago: 1250.00,
      status: "Pago",
      formaPagamento: "PIX"
    },
    {
      id: 2,
      numeroDocumento: "FAT-2024-002",
      cliente: "Comercial XYZ S.A.",
      descricao: "Prestação de serviços",
      dataVencimento: "2024-02-20",
      valorOriginal: 850.00,
      status: "Pendente"
    },
    {
      id: 3,
      numeroDocumento: "FAT-2024-003",
      cliente: "Indústria DEF ME",
      descricao: "Venda de equipamentos",
      dataVencimento: "2024-01-30",
      valorOriginal: 2100.00,
      valorPago: 1000.00,
      status: "Vencido"
    }
  ])

  const filteredContas = contas.filter(conta => {
    const matchesSearch = conta.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conta.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || conta.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente": return "secondary"
      case "Pago": return "default"
      case "Vencido": return "destructive"
      case "Parcial": return "secondary"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pago": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Vencido": return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <DollarSign className="h-4 w-4 text-blue-600" />
    }
  }

  const openDetalhes = (conta: ContaReceber) => {
    setDetalhesModal({ isOpen: true, conta })
  }

  const openRecebimento = (contaId: number) => {
    setRecebimentoModal({ isOpen: true, contaId })
  }

  const openEdicao = (conta: ContaReceber) => {
    setEdicaoModal({ isOpen: true, conta })
  }

  const handleConfirmarRecebimento = (contaId: number, dataRecebimento: string) => {
    const conta = contas.find(c => c.id === contaId)
    if (!conta) return

    setContas(prev => prev.map(c => 
      c.id === contaId 
        ? { 
            ...c, 
            status: "Pago",
            dataPagamento: dataRecebimento,
            valorPago: c.valorOriginal,
            formaPagamento: "PIX"
          }
        : c
    ))

    toast({
      title: "Recebimento registrado",
      description: `Recebimento de ${conta.numeroDocumento} foi registrado com sucesso.`,
    })
  }

  const handleEstornarPagamento = (contaId: number) => {
    const conta = contas.find(c => c.id === contaId)
    if (!conta) return

    // Determinar o novo status baseado na data de vencimento
    const hoje = new Date()
    const dataVencimento = new Date(conta.dataVencimento)
    const novoStatus = dataVencimento < hoje ? "Vencido" : "Pendente"

    setContas(prev => prev.map(c => 
      c.id === contaId 
        ? { 
            ...c, 
            status: novoStatus,
            dataPagamento: undefined,
            valorPago: undefined,
            formaPagamento: undefined
          }
        : c
    ))

    setDetalhesModal({ isOpen: false, conta: null })

    toast({
      title: "Recebimento estornado",
      description: `O recebimento de ${conta.numeroDocumento} foi estornado com sucesso.`,
      variant: "destructive"
    })
  }

  const handleSalvarEdicao = (contaEditada: ContaReceber) => {
    setContas(prev => prev.map(c => 
      c.id === contaEditada.id ? contaEditada : c
    ))

    toast({
      title: "Conta atualizada",
      description: `A conta ${contaEditada.numeroDocumento} foi atualizada com sucesso.`,
    })
  }

  const totalPendente = contas.filter(c => c.status === "Pendente").reduce((sum, c) => sum + c.valorOriginal, 0)
  const totalVencido = contas.filter(c => c.status === "Vencido").reduce((sum, c) => sum + (c.valorOriginal - (c.valorPago || 0)), 0)
  const totalRecebido = contas.filter(c => c.status === "Pago").reduce((sum, c) => sum + (c.valorPago || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Contas a Receber</h2>
          </div>
          <p className="text-muted-foreground">Controle de pagamentos de clientes</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">A Receber</p>
                <p className="text-lg font-bold">{formatCurrency(totalPendente)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vencido</p>
                <p className="text-lg font-bold">{formatCurrency(totalVencido)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recebido</p>
                <p className="text-lg font-bold">{formatCurrency(totalRecebido)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Contas</p>
                <p className="text-xl font-bold">{contas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas</CardTitle>
          <CardDescription>
            {filteredContas.length} conta(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por documento, cliente ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  Todas
                </Button>
                <Button
                  variant={statusFilter === "Pendente" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Pendente")}
                >
                  Pendentes
                </Button>
                <Button
                  variant={statusFilter === "Vencido" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Vencido")}
                >
                  Vencidas
                </Button>
                <Button
                  variant={statusFilter === "Pago" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Pago")}
                >
                  Pagas
                </Button>
              </div>
            </div>
          </div>

          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead className="hidden sm:table-cell">Cliente</TableHead>
                  <TableHead className="hidden md:table-cell">Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContas.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{conta.numeroDocumento}</div>
                        <div className="text-sm text-gray-500">{conta.descricao}</div>
                        <div className="sm:hidden text-sm text-gray-500">{conta.cliente}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{conta.cliente}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        {formatDate(conta.dataVencimento)}
                        {conta.dataPagamento && (
                          <div className="text-green-600">
                            Pago em {formatDate(conta.dataPagamento)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatCurrency(conta.valorOriginal)}</div>
                        {conta.valorPago && conta.valorPago < conta.valorOriginal && (
                          <div className="text-sm text-green-600">
                            Pago: {formatCurrency(conta.valorPago)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(conta.status)}
                        <Badge variant={getStatusColor(conta.status) as any}>
                          {conta.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetalhes(conta)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        {conta.status !== "Pago" && (
                          <Button
                            size="sm"
                            onClick={() => openRecebimento(conta.id)}
                          >
                            Receber
                          </Button>
                        )}
                        {conta.status === "Pago" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                              >
                                <Undo2 className="h-4 w-4 mr-1" />
                                Estornar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Estorno</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja estornar o recebimento de {conta.numeroDocumento}?
                                  Esta ação desfará o recebimento de {formatCurrency(conta.valorPago || 0)} e 
                                  voltará a conta para o status pendente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleEstornarPagamento(conta.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Estornar Recebimento
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ContaDetalhesModal
        conta={detalhesModal.conta}
        isOpen={detalhesModal.isOpen}
        onClose={() => setDetalhesModal({ isOpen: false, conta: null })}
        onReceber={openRecebimento}
        onEditar={(id) => {
          const conta = contas.find(c => c.id === id)
          if (conta) openEdicao(conta)
        }}
        onEstornar={handleEstornarPagamento}
      />

      <RecebimentoModal
        contaId={recebimentoModal.contaId}
        isOpen={recebimentoModal.isOpen}
        onClose={() => setRecebimentoModal({ isOpen: false, contaId: null })}
        onConfirm={handleConfirmarRecebimento}
      />

      <ContaEdicaoModal
        conta={edicaoModal.conta}
        isOpen={edicaoModal.isOpen}
        onClose={() => setEdicaoModal({ isOpen: false, conta: null })}
        onSave={handleSalvarEdicao}
      />
    </div>
  )
}
