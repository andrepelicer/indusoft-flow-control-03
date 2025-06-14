
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
import { orcamentoSchema, type Orcamento, ItemOrcamentoExpandido } from "@/lib/validations"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { ItemOrcamentoManager } from "./ItemOrcamentoManager"

interface OrcamentoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orcamento?: Orcamento & { id: number }
  onSave: (orcamento: Orcamento) => void
}

export function OrcamentoForm({ open, onOpenChange, orcamento, onSave }: OrcamentoFormProps) {
  const { toast } = useToast()
  const [itens, setItens] = useState<ItemOrcamentoExpandido[]>([])
  
  const form = useForm<Orcamento>({
    resolver: zodResolver(orcamentoSchema),
    defaultValues: {
      numero: "",
      clienteId: 0,
      vendedorId: 0,
      dataOrcamento: new Date().toISOString().split('T')[0],
      validadeOrcamento: "",
      status: "Pendente",
      observacoes: "",
      desconto: 0,
      valorTotal: 0
    }
  })

  useEffect(() => {
    if (orcamento) {
      form.reset(orcamento)
      setItens([]) // Em um sistema real, carregaria os itens do orçamento
    } else {
      const hoje = new Date()
      const validade = new Date(hoje)
      validade.setDate(hoje.getDate() + 30) // 30 dias de validade padrão
      
      form.reset({
        numero: `ORC-${Date.now()}`,
        clienteId: 0,
        vendedorId: 0,
        dataOrcamento: hoje.toISOString().split('T')[0],
        validadeOrcamento: validade.toISOString().split('T')[0],
        status: "Pendente",
        observacoes: "",
        desconto: 0,
        valorTotal: 0
      })
      setItens([])
    }
  }, [orcamento, form])

  const handleTotalChange = (novoTotal: number) => {
    const desconto = form.getValues('desconto') || 0
    const totalComDesconto = novoTotal * (1 - desconto / 100)
    form.setValue('valorTotal', totalComDesconto)
  }

  const onSubmit = (data: Orcamento) => {
    if (itens.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item ao orçamento.",
        variant: "destructive"
      })
      return
    }

    onSave(data)
    toast({
      title: orcamento ? "Orçamento atualizado" : "Orçamento criado",
      description: "As informações foram salvas com sucesso.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {orcamento ? "Editar Orçamento" : "Novo Orçamento"}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do orçamento abaixo.
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
                    <FormLabel>Número do Orçamento</FormLabel>
                    <FormControl>
                      <Input placeholder="ORC-001" {...field} />
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
                        <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                        <SelectItem value="Expirado">Expirado</SelectItem>
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
                name="dataOrcamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Orçamento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="validadeOrcamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade do Orçamento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gerenciador de Itens */}
            <ItemOrcamentoManager
              itens={itens}
              onItensChange={setItens}
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
                          field.onChange(Number(e.target.value))
                          handleTotalChange(itens.reduce((sum, item) => sum + (item.subtotal || 0), 0))
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
                      placeholder="Observações do orçamento" 
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
                {orcamento ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
