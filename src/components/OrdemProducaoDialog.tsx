
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
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

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setDataPrevisao("")
      setObservacoesOP("")
    } else if (item) {
      // Initialize form when opening with item
      setObservacoesOP(`Ordem gerada automaticamente do pedido de venda para ${item.produto?.nome}`)
    }
    onOpenChange(newOpen)
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
    
    // Close dialog and reset form
    handleOpenChange(false)
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerar Ordem de Produção</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma ordem de produção para este item.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
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
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Data de Previsão *</label>
              <Input
                type="date"
                value={dataPrevisao}
                onChange={(e) => setDataPrevisao(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Observações</label>
              <Input
                value={observacoesOP}
                onChange={(e) => setObservacoesOP(e.target.value)}
                placeholder="Observações para a ordem de produção..."
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={gerarOrdemProducao} disabled={!dataPrevisao}>
              Gerar Ordem de Produção
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
