
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, Edit, Trash2 } from "lucide-react"
import { type Fornecedor } from "@/lib/validations"

type FornecedorComId = Fornecedor & { id: number }

interface FornecedoresTableProps {
  fornecedores: FornecedorComId[]
  onEdit: (fornecedor: FornecedorComId) => void
  onDelete: (id: number) => void
}

export function FornecedoresTable({ fornecedores, onEdit, onDelete }: FornecedoresTableProps) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Fornecedores</CardTitle>
        <CardDescription>
          {fornecedores.length} fornecedor(es) encontrado(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome/Razão Social</TableHead>
                <TableHead className="hidden sm:table-cell">CNPJ</TableHead>
                <TableHead className="hidden md:table-cell">Categoria</TableHead>
                <TableHead className="hidden lg:table-cell">Contato</TableHead>
                <TableHead className="hidden xl:table-cell">Cidade</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedores.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{fornecedor.nome}</div>
                      <div className="sm:hidden text-sm text-muted-foreground">
                        {fornecedor.cnpj}
                      </div>
                      <div className="md:hidden text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{fornecedor.categoria}</Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell font-mono text-sm">{fornecedor.cnpj}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{fornecedor.categoria}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="space-y-1">
                      <div className="text-sm">{fornecedor.email}</div>
                      <div className="text-sm text-muted-foreground">{fornecedor.telefone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">{fornecedor.cidade}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(fornecedor.avaliacao)}
                      <span className="text-sm ml-1">({fornecedor.avaliacao})</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={fornecedor.status === 'Ativo' ? 'default' : 'secondary'}>
                      {fornecedor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEdit(fornecedor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDelete(fornecedor.id)}
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
      </CardContent>
    </Card>
  )
}
