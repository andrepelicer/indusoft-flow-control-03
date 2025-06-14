
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

interface ContaPagar {
  id: number
  fornecedor: string
  documento: string
  descricao: string
  vencimento: string
  valor: number
  status: 'Pendente' | 'Pago' | 'Vencido'
  categoria: string
}

interface ContaDetalhesModalProps {
  conta: ContaPagar | null
  isOpen: boolean
  onClose: () => void
  onPagar: (id: number) => void
  onEditar: (id: number) => void
}

export function ContaDetalhesModal({ conta, isOpen, onClose, onPagar, onEditar }: ContaDetalhesModalProps) {
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Vencimento</label>
              <p className="text-base">{new Date(conta.vencimento).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Valor</label>
              <p className="text-base font-bold">R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Categoria</label>
              <p className="text-base">{conta.categoria}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <Badge variant={getStatusVariant(conta.status)} className="flex items-center gap-1 w-fit">
                {getStatusIcon(conta.status)}
                {conta.status}
              </Badge>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              {conta.status !== 'Pago' && (
                <Button 
                  className="flex-1"
                  onClick={() => onPagar(conta.id)}
                >
                  Efetuar Pagamento
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
