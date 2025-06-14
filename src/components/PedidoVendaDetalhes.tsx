
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Pedido, ItemPedidoExpandido } from "@/lib/validations"

interface PedidoVendaDetalhesProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedido: (Pedido & { id: number; itens?: ItemPedidoExpandido[] }) | null
}

export function PedidoVendaDetalhes({ open, onOpenChange, pedido }: PedidoVendaDetalhesProps) {
  if (!pedido) return null

  const clienteNomes = {
    1: "Metalúrgica Santos Ltda.",
    2: "Indústria Silva & Cia",
    3: "Construtora Oliveira"
  }

  const vendedorNomes = {
    1: "Carlos Silva",
    2: "Ana Costa",
    3: "Roberto Santos"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case 'Pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case 'Faturado':
        return <Badge className="bg-blue-100 text-blue-800">Faturado</Badge>
      case 'Cancelado':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const calcularSubtotal = (item: ItemPedidoExpandido) => {
    const subtotal = item.quantidade * item.precoUnitario
    const desconto = (subtotal * (item.desconto || 0)) / 100
    return subtotal - desconto
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido {pedido.numero}</DialogTitle>
          <DialogDescription>
            Visualização completa do pedido de venda
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                <p>{clienteNomes[pedido.clienteId as keyof typeof clienteNomes]}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendedor</p>
                <p>{vendedorNomes[pedido.vendedorId as keyof typeof vendedorNomes]}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data do Pedido</p>
                <p>{new Date(pedido.dataPedido).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Entrega</p>
                <p>{pedido.dataEntrega ? new Date(pedido.dataEntrega).toLocaleDateString() : 'Não definida'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                {getStatusBadge(pedido.status)}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-lg font-bold">R$ {pedido.valorTotal.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Itens do Pedido */}
          {pedido.itens && pedido.itens.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Preço Unit.</TableHead>
                      <TableHead>Desc %</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedido.itens.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.produto?.nome}</div>
                            <div className="text-sm text-muted-foreground">{item.produto?.codigo}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantidade}</TableCell>
                        <TableCell>R$ {item.precoUnitario.toFixed(2)}</TableCell>
                        <TableCell>{item.desconto || 0}%</TableCell>
                        <TableCell>R$ {calcularSubtotal(item).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={4} className="font-semibold">Total dos Itens:</TableCell>
                      <TableCell className="font-bold">
                        R$ {pedido.itens.reduce((sum, item) => sum + calcularSubtotal(item), 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {pedido.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{pedido.observacoes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
