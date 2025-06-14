
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

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

interface ContaEdicaoModalProps {
  conta: ContaReceber | null
  isOpen: boolean
  onClose: () => void
  onSave: (conta: ContaReceber) => void
}

export function ContaEdicaoModal({ conta, isOpen, onClose, onSave }: ContaEdicaoModalProps) {
  const [formData, setFormData] = useState<Partial<ContaReceber>>({})

  useEffect(() => {
    if (conta) {
      setFormData({
        ...conta,
        dataVencimento: conta.dataVencimento
      })
    }
  }, [conta])

  const handleSave = () => {
    if (conta && formData) {
      onSave({ ...conta, ...formData } as ContaReceber)
      onClose()
    }
  }

  if (!conta) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Conta a Receber</DialogTitle>
          <DialogDescription>
            Altere as informações da conta conforme necessário
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroDocumento">Número do Documento</Label>
              <Input
                id="numeroDocumento"
                value={formData.numeroDocumento || ''}
                onChange={(e) => setFormData({...formData, numeroDocumento: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={formData.cliente || ''}
                onChange={(e) => setFormData({...formData, cliente: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={formData.descricao || ''}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataVencimento">Data de Vencimento</Label>
              <Input
                id="dataVencimento"
                type="date"
                value={formData.dataVencimento || ''}
                onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorOriginal">Valor Original</Label>
              <Input
                id="valorOriginal"
                type="number"
                step="0.01"
                value={formData.valorOriginal || ''}
                onChange={(e) => setFormData({...formData, valorOriginal: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
