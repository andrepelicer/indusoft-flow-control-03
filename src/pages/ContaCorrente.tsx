
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface Movimentacao {
  id: number
  data: string
  descricao: string
  tipo: 'Entrada' | 'Saída'
  valor: number
  categoria: string
  saldo: number
}

export default function ContaCorrente() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const [movimentacoes] = useState<Movimentacao[]>([
    {
      id: 1,
      data: "2024-01-15",
      descricao: "Recebimento - Cliente ABC",
      tipo: "Entrada",
      valor: 25000.00,
      categoria: "Vendas",
      saldo: 125000.00
    },
    {
      id: 2,
      data: "2024-01-14",
      descricao: "Pagamento - Fornecedor XYZ",
      tipo: "Saída",
      valor: 15000.00,
      categoria: "Compras",
      saldo: 100000.00
    },
    {
      id: 3,
      data: "2024-01-13",
      descricao: "Pagamento de salários",
      tipo: "Saída",
      valor: 35000.00,
      categoria: "Folha de Pagamento",
      saldo: 115000.00
    },
    {
      id: 4,
      data: "2024-01-12",
      descricao: "Recebimento - Cliente DEF",
      tipo: "Entrada",
      valor: 18500.00,
      categoria: "Vendas",
      saldo: 150000.00
    }
  ])

  const filteredMovimentacoes = movimentacoes.filter(mov =>
    mov.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const saldoAtual = movimentacoes[0]?.saldo || 0
  const totalEntradas = movimentacoes.filter(m => m.tipo === 'Entrada').reduce((sum, m) => sum + m.valor, 0)
  const totalSaidas = movimentacoes.filter(m => m.tipo === 'Saída').reduce((sum, m) => sum + m.valor, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Conta Corrente</h2>
          </div>
          <p className="text-muted-foreground">Controle de movimentações financeiras</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nova Movimentação
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">
                  R$ {saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground">Saldo Atual</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground">Total Entradas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground">Total Saídas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {movimentacoes.length}
            </div>
            <div className="text-sm text-muted-foreground">Movimentações</div>
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
              placeholder="Buscar por descrição ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extrato da Conta Corrente</CardTitle>
          <CardDescription>
            {filteredMovimentacoes.length} movimentação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="hidden lg:table-cell">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovimentacoes.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>
                      {new Date(mov.data).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-medium">{mov.descricao}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{mov.categoria}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={mov.tipo === 'Entrada' ? 'default' : 'secondary'}>
                        {mov.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className={mov.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}>
                      {mov.tipo === 'Entrada' ? '+' : '-'} R$ {mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-mono">
                      R$ {mov.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
