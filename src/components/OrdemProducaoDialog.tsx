
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { ItemPedidoExpandido } from "@/lib/validations"
import { useToast } from "@/hooks/use-toast"

interface OrdemProducaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ItemPedidoExpandido | null
}

export function OrdemProducaoDialog({ open, onOpenChange, item }: OrdemProducaoDialogProps) {
  const { toast } = useToast()
  const [dataPrevisao, setDataPrevisao] = useState("")
  const [observacoesOP, setObservacoesOP] = useState("")

  useEffect(() => {
    if (open && item) {
      setObservacoesOP(`Ordem gerada automaticamente do pedido de venda para ${item.produto?.nome}`)
      setDataPrevisao("")
    } else if (!open) {
      setDataPrevisao("")
      setObservacoesOP("")
    }
  }, [open, item])

  const handleClose = () => {
    setDataPrevisao("")
    setObservacoesOP("")
    onOpenChange(false)
  }

  const gerarOrdemProducao = () => {
    console.log('Gerando ordem de produção para item:', item)
    
    if (!item) {
      toast({
        title: "Erro",
        description: "Nenhum item selecionado para gerar ordem de produção.",
        variant: "destructive"
      })
      return
    }

    if (!dataPrevisao) {
      toast({
        title: "Erro",
        description: "Por favor, preencha a data de previsão.",
        variant: "destructive"
      })
      return
    }

    const novaOrdem = {
      id: Date.now(),
      numero: `OP-${Date.now()}`,
      produtoId: item.produtoId,
      produto: item.produto?.nome,
      codigo: item.produto?.codigo,
      quantidade: item.quantidade,
      status: 'Pendente',
      dataCriacao: new Date().toISOString().split('T')[0],
      dataPrevisao: dataPrevisao,
      observacoes: observacoesOP
    }
    
    console.log('Ordem de Produção criada:', novaOrdem)
    
    toast({
      title: "Ordem de Produção Criada",
      description: `Ordem ${novaOrdem.numero} criada com sucesso para ${novaOrdem.produto}!`,
    })
    
    handleClose()
  }

  if (!open || !item) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Gerar Ordem de Produção</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Preencha os dados para criar uma ordem de produção para este item.
        </p>
        
        {/* Item Info */}
        <div className="p-4 border rounded-lg bg-muted/50 mb-4">
          <h4 className="font-medium mb-2">Item Selecionado:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Produto:</span> {item.produto?.nome}
            </div>
            <div>
              <span className="font-medium">Código:</span> {item.produto?.codigo}
            </div>
            <div>
              <span className="font-medium">Quantidade:</span> {item.quantidade}
            </div>
            <div>
              <span className="font-medium">Valor Unit.:</span> R$ {item.precoUnitario.toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Data de Previsão *</label>
            <Input
              type="date"
              value={dataPrevisao}
              onChange={(e) => setDataPrevisao(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Observações</label>
            <Input
              value={observacoesOP}
              onChange={(e) => setObservacoesOP(e.target.value)}
              placeholder="Observações para a ordem de produção..."
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={gerarOrdemProducao} disabled={!dataPrevisao}>
            Gerar Ordem de Produção
          </Button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
