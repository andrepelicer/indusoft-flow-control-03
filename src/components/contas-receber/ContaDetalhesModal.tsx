
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock, Undo, Edit } from "lucide-react"

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

  if (!conta) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
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
              <p className="text-base">{new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Valor Original</label>
              <p className="text-base font-bold">R$ {conta.valorOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          {conta.valorPago && (
            <div>
              <label className="text-sm font-medium text-gray-500">Valor Pago</label>
              <p className="text-base font-bold text-green-600">R$ {conta.valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          )}
          
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

          {conta.status === 'Pago' && conta.dataPagamento && (
            <div>
              <label className="text-sm font-medium text-gray-500">Data do Recebimento</label>
              <p className="text-base">{new Date(conta.dataPagamento).toLocaleDateString('pt-BR')}</p>
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
