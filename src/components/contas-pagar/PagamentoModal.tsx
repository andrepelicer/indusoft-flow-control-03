
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface PagamentoModalProps {
  contaId: number | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (contaId: number, dataPagamento: string) => void
}

export function PagamentoModal({ contaId, isOpen, onClose, onConfirm }: PagamentoModalProps) {
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split('T')[0])

  const handleConfirm = () => {
    if (contaId) {
      onConfirm(contaId, dataPagamento)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Pagamento</DialogTitle>
          <DialogDescription>
            Informe a data do pagamento para confirmar a operação
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataPagamento">Data do Pagamento</Label>
            <Input
              id="dataPagamento"
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
            />
          </div>
          
          <div className="pt-4 border-t flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>
              Confirmar Pagamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
