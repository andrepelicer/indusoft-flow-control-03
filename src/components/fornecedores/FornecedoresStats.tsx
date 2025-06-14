
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface FornecedoresStatsProps {
  fornecedores: Array<{
    status?: 'Ativo' | 'Inativo'
    avaliacao: number
    categoria: string
  }>
}

export function FornecedoresStats({ fornecedores }: FornecedoresStatsProps) {
  const avaliacaoMedia = fornecedores.reduce((sum, f) => sum + f.avaliacao, 0) / fornecedores.length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-primary">{fornecedores.length}</div>
          <div className="text-sm text-muted-foreground">Total Fornecedores</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {fornecedores.filter(f => f.status === 'Ativo').length}
          </div>
          <div className="text-sm text-muted-foreground">Ativos</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-yellow-600">{avaliacaoMedia.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">Avaliação Média</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {new Set(fornecedores.map(f => f.categoria)).size}
          </div>
          <div className="text-sm text-muted-foreground">Categorias</div>
        </CardContent>
      </Card>
    </div>
  )
}
