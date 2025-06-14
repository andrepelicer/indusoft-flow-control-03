
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock, Undo, Edit, Calendar, DollarSign } from "lucide-react"

interface PagamentoParcial {
  id: number
  data: string
  valor: number
  formaPagamento?: string
}

interface ContaReceber {
  id: number
  numeroDocumento: string
  cliente: string
  descricao: string
  dataVencimento: string
  dataPagamento?: string
  valorOriginal: number
  valorPago?: number
  status: "Pendente" | "Pago" | "Vencido" | "Parcial"
  formaPagamento?: string
  pagamentosRealizados?: PagamentoParcial[]
}

interface ContaDetalhesModalProps {
  conta: ContaReceber | null
  isOpen: boolean
  onClose: () => void
  onReceber: (id: number) => void
  onEditar: (id: number) => void
  onEstornar: (id: number) => void
}

export function ContaDetalhesModal({ conta, isOpen, onClose, onReceber, onEditar, onEstornar }: ContaDetalhesModalProps) {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (!conta) return null

  const saldoDevedor = conta.valorOriginal - (conta.valorPago || 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Conta</DialogTitle>
          <DialogDescription>
            Informações completas sobre a conta a receber
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Documento</label>
              <p className="text-base font-mono">{conta.numeroDocumento}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Cliente</label>
              <p className="text-base">{conta.cliente}</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Descrição</label>
            <p className="text-base">{conta.descricao}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Vencimento</label>
              <p className="text-base">{formatDate(conta.dataVencimento)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Valor Original</label>
              <p className="text-base font-bold">{formatCurrency(conta.valorOriginal)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Valor Total Pago</label>
              <p className="text-base font-bold text-green-600">{formatCurrency(conta.valorPago || 0)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Saldo Devedor</label>
              <p className="text-base font-bold text-red-600">{formatCurrency(saldoDevedor)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <Badge variant={getStatusVariant(conta.status) as any} className="flex items-center gap-1 w-fit">
                {getStatusIcon(conta.status)}
                {conta.status}
              </Badge>
            </div>
            {conta.formaPagamento && (
              <div>
                <label className="text-sm font-medium text-gray-500">Forma de Pagamento</label>
                <p className="text-base">{conta.formaPagamento}</p>
              </div>
            )}
          </div>

          {/* Lista de Pagamentos Realizados */}
          {conta.pagamentosRealizados && conta.pagamentosRealizados.length > 0 && (
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-gray-500 mb-3 block">Histórico de Pagamentos</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {conta.pagamentosRealizados.map((pagamento) => (
                    <div key={pagamento.id} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{formatDate(pagamento.data)}</p>
                          {pagamento.formaPagamento && (
                            <p className="text-xs text-gray-500">{pagamento.formaPagamento}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-green-600">{formatCurrency(pagamento.valor)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total de Pagamentos:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(conta.pagamentosRealizados.reduce((sum, p) => sum + p.valor, 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {conta.status === 'Pago' && conta.dataPagamento && !conta.pagamentosRealizados && (
            <div>
              <label className="text-sm font-medium text-gray-500">Data do Recebimento</label>
              <p className="text-base">{formatDate(conta.dataPagamento)}</p>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              {conta.status !== 'Pago' && (
                <Button 
                  className="flex-1"
                  onClick={() => onReceber(conta.id)}
                >
                  Receber Pagamento
                </Button>
              )}
              {conta.status === 'Pago' && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onEstornar(conta.id)}
                >
                  <Undo className="h-4 w-4 mr-2" />
                  Estornar Recebimento
                </Button>
              )}
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onEditar(conta.id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
