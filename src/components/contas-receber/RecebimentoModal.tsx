
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
  valorOriginal: number
  valorPago?: number
  status: "Pendente" | "Pago" | "Vencido" | "Parcial"
}

interface RecebimentoModalProps {
  contaId: number | null
  contas: ContaReceber[]
  isOpen: boolean
  onClose: () => void
  onConfirm: (contaId: number, dataRecebimento: string, valorPago: number) => void
}

export function RecebimentoModal({ contaId, contas, isOpen, onClose, onConfirm }: RecebimentoModalProps) {
  const [dataRecebimento, setDataRecebimento] = useState(new Date().toISOString().split('T')[0])
  const [valorPago, setValorPago] = useState('')

  const conta = contas.find(c => c.id === contaId)
  const saldoDevedor = conta ? conta.valorOriginal - (conta.valorPago || 0) : 0

  useEffect(() => {
    if (conta && isOpen) {
      // Define o valor padrão como o saldo devedor
      setValorPago(saldoDevedor.toFixed(2))
    }
  }, [conta, isOpen, saldoDevedor])

  const handleConfirm = () => {
    if (contaId && valorPago) {
      const valor = parseFloat(valorPago)
      if (valor > 0 && valor <= saldoDevedor) {
        onConfirm(contaId, dataRecebimento, valor)
        onClose()
        setValorPago('')
      }
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (!conta) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Recebimento</DialogTitle>
          <DialogDescription>
            Informe os dados do recebimento para a conta {conta.numeroDocumento}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Valor Original:</span>
                <div className="font-semibold">{formatCurrency(conta.valorOriginal)}</div>
              </div>
              <div>
                <span className="text-gray-600">Valor Já Pago:</span>
                <div className="font-semibold text-green-600">{formatCurrency(conta.valorPago || 0)}</div>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Saldo Devedor:</span>
                <div className="font-bold text-red-600 text-lg">{formatCurrency(saldoDevedor)}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataRecebimento">Data do Recebimento</Label>
            <Input
              id="dataRecebimento"
              type="date"
              value={dataRecebimento}
              onChange={(e) => setDataRecebimento(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorPago">Valor a Receber</Label>
            <Input
              id="valorPago"
              type="number"
              step="0.01"
              max={saldoDevedor}
              value={valorPago}
              onChange={(e) => setValorPago(e.target.value)}
              placeholder="0,00"
            />
            <p className="text-xs text-gray-500">
              Valor máximo: {formatCurrency(saldoDevedor)}
            </p>
          </div>
          
          <div className="pt-4 border-t flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!valorPago || parseFloat(valorPago) <= 0 || parseFloat(valorPago) > saldoDevedor}
            >
              Confirmar Recebimento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
