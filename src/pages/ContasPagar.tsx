
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, CreditCard, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface ContaPagar {
  id: number
  fornecedor: string
  documento: string
  descricao: string
  vencimento: string
  valor: number
  status: 'Pendente' | 'Pago' | 'Vencido'
  categoria: string
}

export default function ContasPagar() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const [contas] = useState<ContaPagar[]>([
    {
      id: 1,
      fornecedor: "Aços Especiais Ltda",
      documento: "NF-001234",
      descricao: "Compra de matéria-prima",
      vencimento: "2024-01-15",
      valor: 15000.00,
      status: "Pendente",
      categoria: "Matéria-Prima"
    },
    {
      id: 2,
      fornecedor: "Energia Elétrica SA",
      documento: "Conta-456",
      descricao: "Conta de energia elétrica",
      vencimento: "2024-01-10",
      valor: 3500.50,
      status: "Vencido",
      categoria: "Utilidades"
    },
    {
      id: 3,
      fornecedor: "Transporte Silva & Cia",
      documento: "NF-002345",
      descricao: "Frete de mercadorias",
      vencimento: "2024-01-20",
      valor: 850.00,
      status: "Pago",
      categoria: "Frete"
    }
  ])

  const filteredContas = contas.filter(conta =>
    conta.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conta.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conta.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPendente = contas.filter(c => c.status === 'Pendente').reduce((sum, c) => sum + c.valor, 0)
  const totalVencido = contas.filter(c => c.status === 'Vencido').reduce((sum, c) => sum + c.valor, 0)
  const totalPago = contas.filter(c => c.status === 'Pago').reduce((sum, c) => sum + c.valor, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pago': return <CheckCircle className="h-4 w-4" />
      case 'Vencido': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pago': return 'default'
      case 'Vencido': return 'destructive'
      default: return 'secondary'
    }
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
                      <Button variant="outline" size="sm">
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
    </div>
  )
}
