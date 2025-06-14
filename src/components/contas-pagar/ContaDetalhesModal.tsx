
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock, Undo, Calendar, CreditCard, DollarSign } from "lucide-react"

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

interface ContaDetalhesModalProps {
  conta: ContaPagar | null
  isOpen: boolean
  onClose: () => void
  onPagar: (id: number) => void
  onEditar: (id: number) => void
  onEstornar: (id: number) => void
}

export function ContaDetalhesModal({ conta, isOpen, onClose, onPagar, onEditar, onEstornar }: ContaDetalhesModalProps) {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (!conta) return null

  const saldoDevedor = conta.valor - (conta.valorPago || 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Conta</DialogTitle>
          <DialogDescription>
            Informações completas sobre a conta a pagar
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Fornecedor</label>
              <p className="text-base">{conta.fornecedor}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Documento</label>
              <p className="text-base font-mono">{conta.documento}</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Descrição</label>
            <p className="text-base">{conta.descricao}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Vencimento</label>
              <p className="text-base">{new Date(conta.vencimento).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Valor Original</label>
              <p className="text-base font-bold">{formatCurrency(conta.valor)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <Badge variant={getStatusVariant(conta.status)} className="flex items-center gap-1 w-fit">
                {getStatusIcon(conta.status)}
                {conta.status}
              </Badge>
            </div>
          </div>

          {(conta.status === 'Pago' || conta.status === 'Parcial') && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Valor Pago:</span>
                  <div className="font-semibold text-green-600">{formatCurrency(conta.valorPago || 0)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Saldo Devedor:</span>
                  <div className="font-bold text-red-600">{formatCurrency(saldoDevedor)}</div>
                </div>
              </div>
            </div>
          )}

          {conta.pagamentos && conta.pagamentos.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Histórico de Pagamentos
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {conta.pagamentos.map((pagamento) => (
                  <div key={pagamento.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {new Date(pagamento.data).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <CreditCard className="h-3 w-3" />
                        {pagamento.meioPagamento}
                      </div>
                    </div>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(pagamento.valor)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-gray-500">Categoria</label>
            <p className="text-base">{conta.categoria}</p>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              {(conta.status === 'Pendente' || conta.status === 'Vencido' || conta.status === 'Parcial') && (
                <Button 
                  className="flex-1"
                  onClick={() => onPagar(conta.id)}
                >
                  {conta.status === 'Parcial' ? 'Pagar Saldo' : 'Efetuar Pagamento'}
                </Button>
              )}
              {conta.status === 'Pago' && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onEstornar(conta.id)}
                >
                  <Undo className="h-4 w-4 mr-2" />
                  Estornar Todos os Pagamentos
                </Button>
              )}
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onEditar(conta.id)}
              >
                Editar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
