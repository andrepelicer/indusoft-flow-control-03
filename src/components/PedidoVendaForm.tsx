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

  // Reset form quando o pedido muda ou quando o modal abre/fecha
  useEffect(() => {
    if (open) {
      if (pedido) {
        console.log('=== CARREGANDO PEDIDO PARA EDIÇÃO ===')
        console.log('Pedido:', pedido.numero)
        console.log('Itens originais:', pedido.itens?.map(i => ({ 
          id: i.id, 
          produtoId: i.produtoId, 
          produto: i.produto?.nome,
          quantidade: i.quantidade 
        })))
        
        isEditingRef.current = true
        form.reset(pedido)
        
        // Preservar os itens do pedido com validação
        if (pedido.itens && pedido.itens.length > 0) {
          // Criar uma cópia profunda e garantir integridade dos dados
          const itensValidados = pedido.itens.map(item => {
            const itemCopia = {
              ...item,
              id: item.id || Date.now() + Math.random(), // Garantir ID único
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              precoUnitario: item.precoUnitario,
              desconto: item.desconto || 0,
              produto: item.produto ? { ...item.produto } : undefined,
              subtotal: item.subtotal || (item.quantidade * item.precoUnitario * (1 - (item.desconto || 0) / 100))
            }
            console.log('Item validado:', {
              id: itemCopia.id,
              produtoId: itemCopia.produtoId,
              produto: itemCopia.produto?.nome,
              quantidade: itemCopia.quantidade
            })
            return itemCopia
          })
          
          setItens(itensValidados)
          console.log('Itens carregados no formulário:', itensValidados.length)
          console.log('Detalhes dos itens carregados:', itensValidados.map(i => ({ 
            id: i.id, 
            produtoId: i.produtoId, 
            produto: i.produto?.nome 
          })))
        } else {
          setItens([])
          console.log('Nenhum item encontrado no pedido')
        }
      } else {
        console.log('=== CRIANDO NOVO PEDIDO ===')
        isEditingRef.current = false
        form.reset({
          numero: `PV-${Date.now()}`,
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
      }
    }
  }, [pedido, form, open])

  const handleItensChange = useCallback((novosItens: ItemPedidoExpandido[]) => {
    console.log('=== ALTERAÇÃO DE ITENS ===')
    console.log('Novos itens recebidos:', novosItens.length)
    console.log('Detalhes dos novos itens:', novosItens.map(i => ({ 
      id: i.id, 
      produtoId: i.produtoId, 
      produto: i.produto?.nome,
      quantidade: i.quantidade 
    })))
    
    // Criar uma cópia profunda para evitar mutações
    const itensCopiados = novosItens.map(item => ({
      ...item,
      produto: item.produto ? { ...item.produto } : undefined
    }))
    
    setItens(itensCopiados)
  }, [])

  const handleTotalChange = useCallback((novoTotal: number) => {
    console.log('Atualizando total dos itens:', novoTotal)
    const desconto = form.getValues('desconto') || 0
    const totalComDesconto = novoTotal * (1 - desconto / 100)
    form.setValue('valorTotal', totalComDesconto)
  }, [form])

  const handleDescontoChange = useCallback((desconto: number) => {
    console.log('Aplicando desconto:', desconto, '% sobre', itens.length, 'itens')
    const totalItens = itens.reduce((sum, item) => sum + (item.subtotal || 0), 0)
    const totalComDesconto = totalItens * (1 - desconto / 100)
    form.setValue('valorTotal', totalComDesconto)
  }, [itens, form])

  const onSubmit = (data: Pedido) => {
    console.log('=== SUBMETENDO PEDIDO ===')
    console.log('Dados do formulário:', { ...data, totalItens: itens.length })
    console.log('Itens a serem salvos:', itens.map(i => ({ 
      id: i.id, 
      produtoId: i.produtoId, 
      produto: i.produto?.nome,
      quantidade: i.quantidade 
    })))
    
    if (itens.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item ao pedido.",
        variant: "destructive"
      })
      return
    }

    // Garantir que os itens estão incluídos no pedido com validação final
    const itensFinais = itens.map(item => ({
      ...item,
      id: item.id || Date.now() + Math.random(),
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario,
      desconto: item.desconto || 0,
      produto: item.produto ? { ...item.produto } : undefined,
      subtotal: item.subtotal || (item.quantidade * item.precoUnitario * (1 - (item.desconto || 0) / 100))
    }))
    
    const pedidoComItens = { 
      ...data, 
      itens: itensFinais
    }
    
    console.log('=== PEDIDO FINAL PARA SALVAR ===')
    console.log('Total de itens:', pedidoComItens.itens.length)
    console.log('Itens finais:', pedidoComItens.itens.map(i => ({ 
      id: i.id, 
      produtoId: i.produtoId, 
      produto: i.produto?.nome,
      quantidade: i.quantidade 
    })))
    
    onSave(pedidoComItens)
    
    toast({
      title: pedido ? "Pedido atualizado" : "Pedido criado",
      description: "As informações foram salvas com sucesso.",
    })
    onOpenChange(false)
  }

  // Não resetar os itens quando o modal fecha para evitar perda de dados
  useEffect(() => {
    if (!open && !isEditingRef.current) {
      console.log('Modal fechado, limpando estado apenas se não estiver editando')
      setItens([])
    }
  }, [open])

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
                {pedido ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
