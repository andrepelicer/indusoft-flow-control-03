
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { TabelaPrecosForm } from "@/components/TabelaPrecosForm"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Edit, Trash2, DollarSign, Package } from "lucide-react"
import type { TabelaPreco, ItemTabelaPreco } from "@/lib/validations"

type TabelaPrecoWithId = TabelaPreco & { id: number; itens?: ItemTabelaPrecoWithId[] }
type ItemTabelaPrecoWithId = ItemTabelaPreco & { id: number; produtoNome: string }

export default function TabelaPrecos() {
  const { toast } = useToast()
  const [tabelas, setTabelas] = useState<TabelaPrecoWithId[]>([
    {
      id: 1,
      nome: "Tabela Padrão",
      descricao: "Preços padrão para clientes regulares",
      ativa: true,
      dataInicio: "2024-01-01",
      dataFim: "2024-12-31",
      itens: [
        { id: 1, produtoId: 1, produtoNome: "Chapa de Aço", preco: 85.50, desconto: 0 },
        { id: 2, produtoId: 2, produtoNome: "Parafuso Allen", preco: 2.50, desconto: 5 }
      ]
    },
    {
      id: 2,
      nome: "Tabela Promocional",
      descricao: "Preços promocionais para grandes volumes",
      ativa: false,
      dataInicio: "2024-06-01",
      dataFim: "2024-06-30",
      itens: []
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTabela, setSelectedTabela] = useState<TabelaPrecoWithId | undefined>()
  const [tabelaToDelete, setTabelaToDelete] = useState<TabelaPrecoWithId | null>(null)

  const filteredTabelas = tabelas.filter(tabela =>
    tabela.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tabela.descricao && tabela.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSaveTabela = (tabelaData: TabelaPreco) => {
    if (selectedTabela) {
      setTabelas(prev => prev.map(t => 
        t.id === selectedTabela.id 
          ? { ...tabelaData, id: selectedTabela.id, itens: selectedTabela.itens || [] }
          : t
      ))
    } else {
      const newTabela = {
        ...tabelaData,
        id: Math.max(0, ...tabelas.map(t => t.id)) + 1,
        itens: []
      }
      setTabelas(prev => [...prev, newTabela])
    }
    setSelectedTabela(undefined)
  }

  const handleEditTabela = (tabela: TabelaPrecoWithId) => {
    setSelectedTabela(tabela)
    setIsFormOpen(true)
  }

  const handleDeleteTabela = (tabela: TabelaPrecoWithId) => {
    setTabelaToDelete(tabela)
  }

  const confirmDelete = () => {
    if (tabelaToDelete) {
      setTabelas(prev => prev.filter(t => t.id !== tabelaToDelete.id))
      toast({
        title: "Tabela removida",
        description: "A tabela de preços foi removida com sucesso.",
      })
      setTabelaToDelete(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tabela de Preços</h2>
          <p className="text-muted-foreground">Gerencie as tabelas de preços dos produtos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Lista de Tabelas de Preços
              </CardTitle>
              <CardDescription>
                {tabelas.length} tabela(s) cadastrada(s)
              </CardDescription>
            </div>
            <Button onClick={() => {
              setSelectedTabela(undefined)
              setIsFormOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tabela
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Descrição</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTabelas.map((tabela) => (
                  <TableRow key={tabela.id}>
                    <TableCell className="font-medium">{tabela.nome}</TableCell>
                    <TableCell className="hidden md:table-cell">{tabela.descricao || "-"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(tabela.dataInicio)}</div>
                        {tabela.dataFim && (
                          <div className="text-gray-500 hidden sm:block">até {formatDate(tabela.dataFim)}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {tabela.itens?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tabela.ativa ? "default" : "secondary"}>
                        {tabela.ativa ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTabela(tabela)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTabela(tabela)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTabelas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma tabela encontrada.
            </div>
          )}
        </CardContent>
      </Card>

      <TabelaPrecosForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        tabela={selectedTabela}
        onSave={handleSaveTabela}
      />

      <AlertDialog open={!!tabelaToDelete} onOpenChange={() => setTabelaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a tabela "{tabelaToDelete?.nome}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
