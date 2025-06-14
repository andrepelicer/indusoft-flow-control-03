
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Plus } from "lucide-react"

interface FluxoData {
  periodo: string
  entradas: number
  saidas: number
  saldo: number
}

export default function FluxoCaixa() {
  const [selectedPeriod, setSelectedPeriod] = useState("30dias")
  
  const fluxoData: FluxoData[] = [
    { periodo: "Jan", entradas: 125000, saidas: 98000, saldo: 27000 },
    { periodo: "Fev", entradas: 145000, saidas: 105000, saldo: 40000 },
    { periodo: "Mar", entradas: 165000, saidas: 115000, saldo: 50000 },
    { periodo: "Abr", entradas: 155000, saidas: 125000, saldo: 30000 },
    { periodo: "Mai", entradas: 175000, saidas: 135000, saldo: 40000 },
    { periodo: "Jun", entradas: 185000, saidas: 140000, saldo: 45000 }
  ]

  const proximosVencimentos = [
    { id: 1, descricao: "Pagamento Fornecedor A", valor: 15000, vencimento: "2024-01-18", tipo: "saida" },
    { id: 2, descricao: "Recebimento Cliente B", valor: 25000, vencimento: "2024-01-20", tipo: "entrada" },
    { id: 3, descricao: "Folha de Pagamento", valor: 45000, vencimento: "2024-01-25", tipo: "saida" },
    { id: 4, descricao: "Recebimento Cliente C", valor: 18000, vencimento: "2024-01-30", tipo: "entrada" }
  ]

  const totalEntradas = fluxoData.reduce((sum, item) => sum + item.entradas, 0)
  const totalSaidas = fluxoData.reduce((sum, item) => sum + item.saidas, 0)
  const saldoLiquido = totalEntradas - totalSaidas
  const saldoAtual = 125000

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Fluxo de Caixa</h2>
          </div>
          <p className="text-muted-foreground">Análise de entradas e saídas financeiras</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filtrar Período
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nova Projeção
          </Button>
        </div>
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
              R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground">Saldo Líquido</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo Mensal</CardTitle>
            <CardDescription>Entradas vs Saídas por período</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fluxoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                />
                <Bar dataKey="entradas" fill="#22c55e" name="Entradas" />
                <Bar dataKey="saidas" fill="#ef4444" name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução do Saldo</CardTitle>
            <CardDescription>Tendência do saldo ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fluxoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Saldo']}
                />
                <Line 
                  type="monotone" 
                  dataKey="saldo" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Vencimentos</CardTitle>
          <CardDescription>Previsão de entradas e saídas nos próximos dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proximosVencimentos.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{item.descricao}</div>
                  <div className="text-sm text-muted-foreground">
                    Vencimento: {new Date(item.vencimento).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={item.tipo === 'entrada' ? 'default' : 'secondary'}>
                    {item.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                  </Badge>
                  <div className={`font-bold ${item.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.tipo === 'entrada' ? '+' : '-'} R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
