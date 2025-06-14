
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Trash2 } from "lucide-react"

const parcelaSchema = z.object({
  numeroParcela: z.number().min(1, "Número da parcela deve ser maior que 0"),
  diasVencimento: z.number().min(0, "Dias para vencimento deve ser maior ou igual a 0"),
})

const meioPagamentoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  ativo: z.boolean().default(true),
  taxaJuros: z.number().min(0).optional(),
  parcelas: z.array(parcelaSchema).min(1, "Pelo menos uma parcela é obrigatória"),
})

type MeioPagamentoForm = z.infer<typeof meioPagamentoSchema>

interface MeiosPagamentoFormProps {
  onSubmit: (data: MeioPagamentoForm) => void
  initialData?: Partial<MeioPagamentoForm>
  onCancel?: () => void
}

export function MeiosPagamentoForm({ onSubmit, initialData, onCancel }: MeiosPagamentoFormProps) {
  const form = useForm<MeioPagamentoForm>({
    resolver: zodResolver(meioPagamentoSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      tipo: initialData?.tipo || "",
      ativo: initialData?.ativo ?? true,
      taxaJuros: initialData?.taxaJuros || 0,
      parcelas: initialData?.parcelas || [{ numeroParcela: 1, diasVencimento: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parcelas"
  })

  const handleSubmit = (data: MeioPagamentoForm) => {
    onSubmit(data)
    form.reset()
  }

  const adicionarParcela = () => {
    const proximoParcela = fields.length + 1
    append({ numeroParcela: proximoParcela, diasVencimento: 0 })
  }

  const removerParcela = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? "Editar Meio de Pagamento" : "Novo Meio de Pagamento"}
        </CardTitle>
        <CardDescription>
          Cadastre os meios de pagamento disponíveis no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Dinheiro, PIX, Cartão..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                      <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                      <SelectItem value="Transferência">Transferência</SelectItem>
                      <SelectItem value="Boleto">Boleto</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxaJuros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa de Juros (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Parcelas e Vencimentos</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarParcela}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Parcela
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`parcelas.${index}.numeroParcela`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Parcela</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`parcelas.${index}.diasVencimento`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Dias para Vencimento</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removerParcela(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {initialData ? "Atualizar" : "Cadastrar"}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
