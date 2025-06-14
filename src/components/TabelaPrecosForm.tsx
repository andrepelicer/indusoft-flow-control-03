import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
import { tabelaPrecoSchema, type TabelaPreco } from "@/lib/validations"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

interface TabelaPrecosFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tabela?: TabelaPreco & { id: number }
  onSave: (tabela: TabelaPreco) => void
}

export function TabelaPrecosForm({ open, onOpenChange, tabela, onSave }: TabelaPrecosFormProps) {
  const { toast } = useToast()
  
  const form = useForm<TabelaPreco>({
    resolver: zodResolver(tabelaPrecoSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      ativa: true,
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: ""
    }
  })

  useEffect(() => {
    if (open) {
      if (tabela) {
        form.reset(tabela)
      } else {
        form.reset({
          nome: "",
          descricao: "",
          ativa: true,
          dataInicio: new Date().toISOString().split('T')[0],
          dataFim: ""
        })
      }
    }
  }, [tabela, form, open])

  const onSubmit = (data: TabelaPreco) => {
    onSave(data)
    toast({
      title: tabela ? "Tabela atualizada" : "Tabela criada",
      description: "As informações foram salvas com sucesso.",
    })
    onOpenChange(false)
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {tabela ? "Editar Tabela de Preços" : "Nova Tabela de Preços"}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações da tabela de preços abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Tabela</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da tabela" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição opcional da tabela" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataFim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ativa"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Tabela Ativa
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {tabela ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
