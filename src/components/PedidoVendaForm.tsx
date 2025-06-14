
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
import { pedidoSchema, type Pedido } from "@/lib/validations"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

interface PedidoVendaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedido?: Pedido & { id: number }
  onSave: (pedido: Pedido) => void
}

export function PedidoVendaForm({ open, onOpenChange, pedido, onSave }: PedidoVendaFormProps) {
  const { toast } = useToast()
  
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

  useEffect(() => {
    if (pedido) {
      form.reset(pedido)
    } else {
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
    }
  }, [pedido, form])

  const onSubmit = (data: Pedido) => {
    onSave(data)
    toast({
      title: pedido ? "Pedido atualizado" : "Pedido criado",
      description: "As informações foram salvas com sucesso.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {pedido ? "Editar Pedido de Venda" : "Novo Pedido de Venda"}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do pedido de venda abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="desconto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))} 
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
                        onChange={(e) => field.onChange(Number(e.target.value))} 
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
