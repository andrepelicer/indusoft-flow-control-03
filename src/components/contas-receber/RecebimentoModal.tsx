
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface RecebimentoModalProps {
  contaId: number | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (contaId: number, dataRecebimento: string) => void
}

export function RecebimentoModal({ contaId, isOpen, onClose, onConfirm }: RecebimentoModalProps) {
  const [dataRecebimento, setDataRecebimento] = useState(new Date().toISOString().split('T')[0])

  const handleConfirm = () => {
    if (contaId) {
      onConfirm(contaId, dataRecebimento)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Recebimento</DialogTitle>
          <DialogDescription>
            Informe a data do recebimento para confirmar a operação
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataRecebimento">Data do Recebimento</Label>
            <Input
              id="dataRecebimento"
              type="date"
              value={dataRecebimento}
              onChange={(e) => setDataRecebimento(e.target.value)}
            />
          </div>
          
          <div className="pt-4 border-t flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>
              Confirmar Recebimento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
