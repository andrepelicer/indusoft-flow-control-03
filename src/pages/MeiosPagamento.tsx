
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, CreditCard } from "lucide-react"
import { MeiosPagamentoForm } from "@/components/MeiosPagamentoForm"
import { useToast } from "@/hooks/use-toast"

interface Parcela {
  numeroParcela: number
  diasVencimento: number
}

interface MeioPagamento {
  id: number
  nome: string
  tipo: string
  ativo: boolean
  taxaJuros?: number
  parcelas: Parcela[]
  dataCriacao: string
}

export default function MeiosPagamento() {
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingMeio, setEditingMeio] = useState<MeioPagamento | null>(null)
  const [meiosPagamento, setMeiosPagamento] = useState<MeioPagamento[]>([
    {
      id: 1,
      nome: "Dinheiro",
      tipo: "Dinheiro",
      ativo: true,
      taxaJuros: 0,
      parcelas: [{ numeroParcela: 1, diasVencimento: 0 }],
      dataCriacao: "2024-01-15"
    },
    {
      id: 2,
      nome: "PIX",
      tipo: "PIX", 
      ativo: true,
      taxaJuros: 0,
      parcelas: [{ numeroParcela: 1, diasVencimento: 0 }],
      dataCriacao: "2024-01-15"
    },
    {
      id: 3,
      nome: "Cartão de Crédito",
      tipo: "Cartão de Crédito",
      ativo: true,
      taxaJuros: 2.5,
      parcelas: [
        { numeroParcela: 1, diasVencimento: 30 },
        { numeroParcela: 2, diasVencimento: 60 },
        { numeroParcela: 3, diasVencimento: 90 }
      ],
      dataCriacao: "2024-01-15"
    }
  ])

  const handleSubmit = (data: any) => {
    if (editingMeio) {
      setMeiosPagamento(prev => 
        prev.map(meio => 
          meio.id === editingMeio.id 
            ? { ...meio, ...data }
            : meio
        )
      )
      toast({
        title: "Meio de Pagamento atualizado",
        description: "As informações foram salvas com sucesso.",
      })
      setEditingMeio(null)
    } else {
      const novoMeio: MeioPagamento = {
        id: Date.now(),
        ...data,
        dataCriacao: new Date().toISOString().split('T')[0]
      }
      setMeiosPagamento(prev => [...prev, novoMeio])
      toast({
        title: "Meio de Pagamento cadastrado",
        description: "O novo meio de pagamento foi adicionado com sucesso.",
      })
    }
    setShowForm(false)
  }

  const handleEdit = (meio: MeioPagamento) => {
    setEditingMeio(meio)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    setMeiosPagamento(prev => prev.filter(meio => meio.id !== id))
    toast({
      title: "Meio de Pagamento removido",
      description: "O meio de pagamento foi excluído com sucesso.",
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingMeio(null)
  }

  if (showForm) {
    return (
      <div className="container mx-auto py-6">
        <MeiosPagamentoForm
          onSubmit={handleSubmit}
          initialData={editingMeio || undefined}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meios de Pagamento</h1>
          <p className="text-muted-foreground">
            Gerencie os meios de pagamento disponíveis no sistema
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Meio de Pagamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meiosPagamento.map((meio) => (
          <Card key={meio.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{meio.nome}</CardTitle>
                </div>
                <Badge variant={meio.ativo ? "default" : "secondary"}>
                  {meio.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <CardDescription>{meio.tipo}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Taxa de Juros:</span>
                <p className="font-medium">{meio.taxaJuros || 0}%</p>
              </div>
              
              <div className="text-sm">
                <span className="text-muted-foreground">Parcelas:</span>
                <div className="mt-1 space-y-1">
                  {meio.parcelas.map((parcela, index) => (
                    <div key={index} className="flex justify-between text-xs bg-muted p-2 rounded">
                      <span>Parcela {parcela.numeroParcela}</span>
                      <span>{parcela.diasVencimento} dias</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(meio)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(meio.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {meiosPagamento.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum meio de pagamento cadastrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece cadastrando os meios de pagamento que sua empresa aceita
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeiro Meio de Pagamento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
