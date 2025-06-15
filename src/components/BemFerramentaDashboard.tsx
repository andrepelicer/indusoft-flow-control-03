
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface BemFerramentaDashboardProps {
  itens: {
    id: number
    nome: string
    tipo: string
    codigo: string
    status: string
    manutencoes: { id: number; data: string; descricao: string; responsavel: string }[]
  }[]
}

const COLORS = ['#22c55e', '#f59e42', '#6366f1', '#e11d48']

export function BemFerramentaDashboard({ itens }: BemFerramentaDashboardProps) {
  // Quantidade de itens por status
  const statusData = ["Disponível", "Em uso", "Manutenção"].map((status, idx) => ({
    status,
    quantidade: itens.filter(i => i.status.toLowerCase().includes(status.toLowerCase())).length,
    color: COLORS[idx % COLORS.length]
  }))

  // Manutenções por bem
  const manutencoesData = itens.map(bem => ({
    nome: bem.nome,
    manutencoes: bem.manutencoes.length,
  }))

  const totalManutencoes = itens.reduce((sum, i) => sum + i.manutencoes.length, 0)

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
      <Card>
        <CardHeader>
          <CardTitle>Itens por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="quantidade"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label={({ status, quantidade }) => quantidade > 0 ? `${status}: ${quantidade}` : ""}
              >
                {statusData.map((entry, idx) => (
                  <Cell key={entry.status} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Manutenções por Bem</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={manutencoesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="manutencoes" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
          <div className="pt-2 text-sm text-muted-foreground">Total de manutenções: <b>{totalManutencoes}</b></div>
        </CardContent>
      </Card>
    </div>
  )
}
