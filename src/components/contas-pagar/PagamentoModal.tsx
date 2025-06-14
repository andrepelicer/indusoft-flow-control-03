
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

interface MeioPagamento {
  id: number
  nome: string
  tipo: string
  ativo: boolean
}

interface PagamentoModalProps {
  contaId: number | null
  contas: any[]
  isOpen: boolean
  onClose: () => void
  onConfirm: (contaId: number, dataPagamento: string, valorPago: number, meioPagamentoId: number) => void
}

export function PagamentoModal({ contaId, contas, isOpen, onClose, onConfirm }: PagamentoModalProps) {
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split('T')[0])
  const [valorPago, setValorPago] = useState('')
  const [meioPagamentoSelecionado, setMeioPagamentoSelecionado] = useState<string>('')

  // Mock dos meios de pagamento - em uma aplicação real, viria de uma API ou context
  const [meiosPagamento] = useState<MeioPagamento[]>([
    { id: 1, nome: "Dinheiro", tipo: "Dinheiro", ativo: true },
    { id: 2, nome: "PIX", tipo: "PIX", ativo: true },
    { id: 3, nome: "Cartão de Crédito", tipo: "Cartão de Crédito", ativo: true },
    { id: 4, nome: "Cartão de Débito", tipo: "Cartão de Débito", ativo: true },
    { id: 5, nome: "Transferência", tipo: "Transferência", ativo: true },
    { id: 6, nome: "Boleto", tipo: "Boleto", ativo: true }
  ])

  const conta = contas?.find(c => c.id === contaId)
  const saldoDevedor = conta ? conta.valor - (conta.valorPago || 0) : 0

  useEffect(() => {
    if (conta && isOpen) {
      // Define o valor padrão como o saldo devedor
      setValorPago(saldoDevedor.toFixed(2))
      setMeioPagamentoSelecionado('')
    }
  }, [conta, isOpen, saldoDevedor])

  const handleConfirm = () => {
    if (contaId && valorPago && meioPagamentoSelecionado) {
      const valor = parseFloat(valorPago)
      const meioPagamentoId = parseInt(meioPagamentoSelecionado)
      if (valor > 0 && valor <= saldoDevedor && meioPagamentoId) {
        onConfirm(contaId, dataPagamento, valor, meioPagamentoId)
        onClose()
        setValorPago('')
        setMeioPagamentoSelecionado('')
      }
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const meiosPagamentoAtivos = meiosPagamento.filter(meio => meio.ativo)

  if (!conta) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Pagamento</DialogTitle>
          <DialogDescription>
            Informe os dados do pagamento para a conta {conta.documento}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Valor Original:</span>
                <div className="font-semibold">{formatCurrency(conta.valor)}</div>
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
            <Label htmlFor="dataPagamento">Data do Pagamento</Label>
            <Input
              id="dataPagamento"
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorPago">Valor a Pagar</Label>
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

          <div className="space-y-2">
            <Label htmlFor="meioPagamento">Meio de Pagamento</Label>
            <Select value={meioPagamentoSelecionado} onValueChange={setMeioPagamentoSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o meio de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {meiosPagamentoAtivos.map((meio) => (
                  <SelectItem key={meio.id} value={meio.id.toString()}>
                    {meio.nome} ({meio.tipo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4 border-t flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!valorPago || !meioPagamentoSelecionado || parseFloat(valorPago) <= 0 || parseFloat(valorPago) > saldoDevedor}
            >
              Confirmar Pagamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
