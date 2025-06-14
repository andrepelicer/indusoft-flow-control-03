import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, CreditCard, AlertCircle, CheckCircle, Clock, Eye } from "lucide-react"
import { ContaDetalhesModal } from "@/components/contas-pagar/ContaDetalhesModal"
import { ContaEdicaoModal } from "@/components/contas-pagar/ContaEdicaoModal"
import { PagamentoModal } from "@/components/contas-pagar/PagamentoModal"
import { useToast } from "@/hooks/use-toast"

interface Pagamento {
  id: number
  data: string
  valor: number
  meioPagamento: string
}

interface ContaPagar {
  id: number
  fornecedor: string
  documento: string
  descricao: string
  vencimento: string
  valor: number
  status: 'Pendente' | 'Pago' | 'Vencido' | 'Parcial'
  categoria: string
  valorPago?: number
  pagamentos?: Pagamento[]
}

export default function ContasPagar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConta, setSelectedConta] = useState<ContaPagar | null>(null)
  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false)
  const [isEdicaoModalOpen, setIsEdicaoModalOpen] = useState(false)
  const [isPagamentoModalOpen, setIsPagamentoModalOpen] = useState(false)
  const [contaParaPagamento, setContaParaPagamento] = useState<number | null>(null)
  const { toast } = useToast()
  
  const [meiosPagamento] = useState([
    { id: 1, nome: "Dinheiro", tipo: "Dinheiro", ativo: true },
    { id: 2, nome: "PIX", tipo: "PIX", ativo: true },
    { id: 3, nome: "Cartão de Crédito", tipo: "Cartão de Crédito", ativo: true },
    { id: 4, nome: "Cartão de Débito", tipo: "Cartão de Débito", ativo: true },
    { id: 5, nome: "Transferência", tipo: "Transferência", ativo: true },
    { id: 6, nome: "Boleto", tipo: "Boleto", ativo: true }
  ])
  
  const [contas, setContas] = useState<ContaPagar[]>([
    {
      id: 1,
      fornecedor: "Aços Especiais Ltda",
      documento: "NF-001234",
      descricao: "Compra de matéria-prima",
      vencimento: "2024-01-15",
      valor: 15000.00,
      status: "Pendente",
      categoria: "Matéria-Prima",
      valorPago: 0,
      pagamentos: []
    },
    {
      id: 2,
      fornecedor: "Energia Elétrica SA",
      documento: "Conta-456",
      descricao: "Conta de energia elétrica",
      vencimento: "2024-01-10",
      valor: 3500.50,
      status: "Vencido",
      categoria: "Utilidades",
      valorPago: 0,
      pagamentos: []
    },
    {
      id: 3,
      fornecedor: "Transporte Silva & Cia",
      documento: "NF-002345",
      descricao: "Frete de mercadorias",
      vencimento: "2024-01-20",
      valor: 850.00,
      status: "Pago",
      categoria: "Frete",
      valorPago: 850.00,
      pagamentos: [
        {
          id: 1,
          data: "2024-01-18",
          valor: 850.00,
          meioPagamento: "PIX"
        }
      ]
    }
  ])

  const filteredContas = contas.filter(conta =>
    conta.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conta.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conta.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPendente = contas.filter(c => c.status === 'Pendente').reduce((sum, c) => sum + c.valor - (c.valorPago || 0), 0)
  const totalVencido = contas.filter(c => c.status === 'Vencido').reduce((sum, c) => sum + c.valor - (c.valorPago || 0), 0)
  const totalPago = contas.filter(c => c.status === 'Pago').reduce((sum, c) => sum + (c.valorPago || 0), 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pago': return <CheckCircle className="h-4 w-4" />
      case 'Vencido': return <AlertCircle className="h-4 w-4" />
      case 'Parcial': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pago': return 'default'
      case 'Vencido': return 'destructive'
      case 'Parcial': return 'secondary'
      default: return 'secondary'
    }
  }

  const handleVerDetalhes = (conta: ContaPagar) => {
    setSelectedConta(conta)
    setIsDetalhesModalOpen(true)
  }

  const handlePagar = (id: number) => {
    setContaParaPagamento(id)
    setIsPagamentoModalOpen(true)
    setIsDetalhesModalOpen(false)
  }

  const handleConfirmarPagamento = (id: number, dataPagamento: string, valorPago: number, meioPagamentoId: number) => {
    const meioPagamento = meiosPagamento.find(m => m.id === meioPagamentoId)
    
    setContas(contas.map(conta => {
      if (conta.id === id) {
        const novoValorPago = (conta.valorPago || 0) + valorPago
        const novoPagamento: Pagamento = {
          id: Date.now(),
          data: dataPagamento,
          valor: valorPago,
          meioPagamento: meioPagamento?.nome || "Não informado"
        }
        
        let novoStatus: 'Pendente' | 'Pago' | 'Vencido' | 'Parcial'
        if (novoValorPago >= conta.valor) {
          novoStatus = 'Pago'
        } else {
          novoStatus = 'Parcial'
        }
        
        return {
          ...conta,
          status: novoStatus,
          valorPago: novoValorPago,
          pagamentos: [...(conta.pagamentos || []), novoPagamento]
        }
      }
      return conta
    }))
    
    toast({
      title: "Pagamento realizado",
      description: `Pagamento de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorPago)} registrado com sucesso.`,
    })
  }

  const handleEstornar = (id: number) => {
    setContas(contas.map(conta => 
      conta.id === id ? { 
        ...conta, 
        status: 'Pendente' as const, 
        valorPago: 0,
        pagamentos: []
      } : conta
    ))
    setIsDetalhesModalOpen(false)
    toast({
      title: "Pagamentos estornados",
      description: "Todos os pagamentos foram estornados e a conta voltou para pendente.",
    })
  }

  const handleEditar = (id: number) => {
    const conta = contas.find(c => c.id === id)
    if (conta) {
      setSelectedConta(conta)
      setIsEdicaoModalOpen(true)
      setIsDetalhesModalOpen(false)
    }
  }

  const handleSalvarEdicao = (contaEditada: ContaPagar) => {
    setContas(contas.map(conta => 
      conta.id === contaEditada.id ? contaEditada : conta
    ))
    toast({
      title: "Conta atualizada",
      description: "As alterações foram salvas com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Contas a Pagar</h2>
          </div>
          <p className="text-muted-foreground">Controle de pagamentos e obrigações financeiras</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground">Pendente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              R$ {totalVencido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground">Vencido</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground">Pago</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {contas.length}
            </div>
            <div className="text-sm text-muted-foreground">Total de Contas</div>
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
              placeholder="Buscar por fornecedor, documento ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas a Pagar</CardTitle>
          <CardDescription>
            {filteredContas.length} conta(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="hidden sm:table-cell">Documento</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="hidden md:table-cell">Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContas.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell className="font-medium">{conta.fornecedor}</TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-sm">{conta.documento}</TableCell>
                    <TableCell>{conta.descricao}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(conta.vencimento).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(conta.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(conta.status)}
                        {conta.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleVerDetalhes(conta)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ContaDetalhesModal
        conta={selectedConta}
        isOpen={isDetalhesModalOpen}
        onClose={() => setIsDetalhesModalOpen(false)}
        onPagar={handlePagar}
        onEditar={handleEditar}
        onEstornar={handleEstornar}
      />

      <ContaEdicaoModal
        conta={selectedConta}
        isOpen={isEdicaoModalOpen}
        onClose={() => setIsEdicaoModalOpen(false)}
        onSave={handleSalvarEdicao}
      />

      <PagamentoModal
        contaId={contaParaPagamento}
        contas={contas}
        isOpen={isPagamentoModalOpen}
        onClose={() => setIsPagamentoModalOpen(false)}
        onConfirm={handleConfirmarPagamento}
      />
    </div>
  )
}
