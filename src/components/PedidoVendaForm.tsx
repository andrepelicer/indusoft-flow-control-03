
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { pedidoSchema, type Pedido, ItemPedidoExpandido } from "@/lib/validations"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState, useCallback, useRef } from "react"
import { ItemPedidoManager } from "./ItemPedidoManager"

interface PedidoVendaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedido?: (Pedido & { id: number }) & { itens?: ItemPedidoExpandido[] }
  onSave: (pedido: Pedido & { itens: ItemPedidoExpandido[] }) => void
}

// Mock de produtos para garantir consistência
const produtosMock = [
  { id: 1, nome: "Chapa de Aço 1mm", codigo: "CH001", precoVenda: 120.00 },
  { id: 2, nome: "Perfil L 50x50x3", codigo: "PF002", precoVenda: 45.50 },
  { id: 3, nome: "Tubo Redondo 2\"", codigo: "TR003", precoVenda: 89.90 },
  { id: 4, nome: "Solda Eletrodo 3,25mm", codigo: "SO004", precoVenda: 25.80 },
  { id: 5, nome: "Tinta Anticorrosiva", codigo: "TI005", precoVenda: 67.30 },
  { id: 6, nome: "Parafuso M8x25", codigo: "PA006", precoVenda: 1.20 },
  { id: 7, nome: "Porca M8", codigo: "PO007", precoVenda: 0.80 },
  { id: 8, nome: "Arruela Lisa M8", codigo: "AR008", precoVenda: 0.25 },
  { id: 9, nome: "Chapa Galvanizada 2mm", codigo: "CG009", precoVenda: 180.00 },
  { id: 10, nome: "Barra Redonda 12mm", codigo: "BR010", precoVenda: 35.60 }
]

export function PedidoVendaForm({ open, onOpenChange, pedido, onSave }: PedidoVendaFormProps) {
  const { toast } = useToast()
  const [itens, setItens] = useState<ItemPedidoExpandido[]>([])
  const isEditingRef = useRef(false)
  
  const form = useForm<Pedido>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      numero: "",
      clienteId: 0,
      vendedorId: 0,
      dataPedido: new Date().toISOString().split('T')[0],
      dataEntrega: "",
      status: "Pendente",
      observacoes: "",
      desconto: 0,
      valorTotal: 0
    }
  })

  // Função para garantir que cada item tem o produto correto
  const normalizarItens = (itensOriginais: ItemPedidoExpandido[]): ItemPedidoExpandido[] => {
    console.log('=== NORMALIZANDO ITENS ===')
    
    return itensOriginais.map(item => {
      console.log(`Normalizando item ${item.id}:`, {
        produtoId: item.produtoId,
        produtoAtual: item.produto?.nome,
        produtoIdAtual: item.produto?.id
      })
      
      // Buscar sempre o produto correto pelo ID
      const produtoCorreto = produtosMock.find(p => p.id === item.produtoId)
      
      if (!produtoCorreto) {
        console.error(`❌ Produto não encontrado para ID ${item.produtoId}`)
        return item
      }
      
      const itemNormalizado = {
        ...item,
        produtoId: produtoCorreto.id, // Garantir que é o ID correto
        produto: {
          id: produtoCorreto.id,
          nome: produtoCorreto.nome,
          codigo: produtoCorreto.codigo,
          precoVenda: produtoCorreto.precoVenda
        },
        subtotal: item.quantidade * item.precoUnitario * (1 - (item.desconto || 0) / 100)
      }
      
      console.log(`✅ Item normalizado:`, {
        id: itemNormalizado.id,
        produtoId: itemNormalizado.produtoId,
        produto: itemNormalizado.produto.nome,
        verificacao: itemNormalizado.produtoId === itemNormalizado.produto.id
      })
      
      return itemNormalizado
    })
  }

  // Reset form quando o pedido muda ou quando o modal abre/fecha
  useEffect(() => {
    if (open) {
      if (pedido) {
        console.log('=== CARREGANDO PEDIDO PARA EDIÇÃO ===')
        console.log('Pedido numero:', pedido.numero)
        console.log('Pedido ID:', pedido.id)
        console.log('Itens recebidos:', pedido.itens?.length || 0)
        
        isEditingRef.current = true
        form.reset(pedido)
        
        if (pedido.itens && pedido.itens.length > 0) {
          console.log('Itens do pedido antes da normalização:', pedido.itens)
          const itensNormalizados = normalizarItens(pedido.itens)
          console.log('Itens após normalização:', itensNormalizados)
          setItens(itensNormalizados)
        } else {
          setItens([])
          console.log('Nenhum item encontrado no pedido')
        }
      } else {
        console.log('=== CRIANDO NOVO PEDIDO ===')
        isEditingRef.current = false
        const numeroPedido = `PV-${Date.now()}`
        form.reset({
          numero: numeroPedido,
          clienteId: 0,
          vendedorId: 0,
          dataPedido: new Date().toISOString().split('T')[0],
          dataEntrega: "",
          status: "Pendente",
          observacoes: "",
          desconto: 0,
          valorTotal: 0
        })
        setItens([])
        console.log('Novo pedido criado com número:', numeroPedido)
      }
    }
  }, [pedido, form, open])

  const handleItensChange = useCallback((novosItens: ItemPedidoExpandido[]) => {
    console.log('=== ALTERAÇÃO DE ITENS ===')
    console.log('Itens recebidos:', novosItens.length)
    
    // Normalizar os itens recebidos
    const itensNormalizados = normalizarItens(novosItens)
    setItens(itensNormalizados)
    
    console.log('Itens definidos no estado:', itensNormalizados.length)
  }, [])

  const handleTotalChange = useCallback((novoTotal: number) => {
    console.log('Atualizando total dos itens:', novoTotal)
    const desconto = form.getValues('desconto') || 0
    const totalComDesconto = novoTotal * (1 - desconto / 100)
    form.setValue('valorTotal', totalComDesconto)
  }, [form])

  const handleDescontoChange = useCallback((desconto: number) => {
    console.log('Aplicando desconto:', desconto, '%')
    const totalItens = itens.reduce((sum, item) => sum + (item.subtotal || 0), 0)
    const totalComDesconto = totalItens * (1 - desconto / 100)
    form.setValue('valorTotal', totalComDesconto)
  }, [itens, form])

  const onSubmit = (data: Pedido) => {
    console.log('=== SALVANDO PEDIDO ===')
    console.log('Dados do formulário:', data)
    console.log('Total de itens para salvar:', itens.length)
    
    // Validação: novos pedidos devem ter pelo menos um item
    if (!isEditingRef.current && itens.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item ao pedido.",
        variant: "destructive"
      })
      return
    }
    
    // Garantir que os itens estão normalizados antes de salvar
    const itensParaSalvar = normalizarItens(itens)
    
    console.log('=== ITENS FINAIS PARA SALVAR ===')
    itensParaSalvar.forEach(item => {
      console.log(`Item ${item.id}:`, {
        produtoId: item.produtoId,
        produto: item.produto?.nome,
        produtoIdInterno: item.produto?.id,
        integridade: item.produto ? item.produtoId === item.produto.id : false,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario
      })
    })
    
    const pedidoParaSalvar = { 
      ...data, 
      itens: itensParaSalvar
    }
    
    try {
      onSave(pedidoParaSalvar)
      
      const acao = isEditingRef.current ? "atualizado" : "criado"
      toast({
        title: `Pedido ${acao}`,
        description: `O pedido foi ${acao} com sucesso.`,
      })
      
      console.log(`✅ Pedido ${acao} com sucesso:`, pedidoParaSalvar.numero)
      onOpenChange(false)
    } catch (error) {
      console.error('❌ Erro ao salvar pedido:', error)
      toast({
        title: "Erro",
        description: "Erro ao salvar o pedido. Tente novamente.",
        variant: "destructive"
      })
    }
  }

  // Limpar estado quando modal fecha
  useEffect(() => {
    if (!open) {
      console.log('Modal fechado, limpando estado')
      setItens([])
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {pedido ? "Editar Pedido de Venda" : "Novo Pedido de Venda"}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do pedido de venda abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Pedido</FormLabel>
                    <FormControl>
                      <Input placeholder="PV-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Aprovado">Aprovado</SelectItem>
                        <SelectItem value="Faturado">Faturado</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Metalúrgica Santos Ltda.</SelectItem>
                        <SelectItem value="2">Indústria Silva & Cia</SelectItem>
                        <SelectItem value="3">Construtora Oliveira</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vendedorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendedor</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o vendedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Carlos Silva</SelectItem>
                        <SelectItem value="2">Ana Costa</SelectItem>
                        <SelectItem value="3">Roberto Santos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataPedido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Pedido</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataEntrega"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Entrega (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gerenciador de Itens */}
            <ItemPedidoManager
              itens={itens}
              onItensChange={handleItensChange}
              onTotalChange={handleTotalChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="desconto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto Geral (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          field.onChange(value)
                          handleDescontoChange(value)
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="valorTotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Total (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        readOnly
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações do pedido" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
