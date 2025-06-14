
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"

interface EtapaProducao {
  id: number
  nome: string
  ordem: number
  concluida: boolean
  dataConclusao?: string
  responsavel: string
  observacoes?: string
}

interface EtapasProducaoManagerProps {
  etapas: EtapaProducao[]
  onEtapasChange: (etapas: EtapaProducao[]) => void
  responsaveis: string[]
  etapasDisponiveis: string[]
}

export default function EtapasProducaoManager({ 
  etapas, 
  onEtapasChange, 
  responsaveis, 
  etapasDisponiveis 
}: EtapasProducaoManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [novaEtapa, setNovaEtapa] = useState<Partial<EtapaProducao>>({
    nome: "",
    responsavel: "",
    observacoes: ""
  })

  const adicionarEtapa = () => {
    if (!novaEtapa.nome || !novaEtapa.responsavel) return

    const etapa: EtapaProducao = {
      id: Date.now(),
      nome: novaEtapa.nome,
      ordem: etapas.length + 1,
      concluida: false,
      responsavel: novaEtapa.responsavel,
      observacoes: novaEtapa.observacoes
    }

    onEtapasChange([...etapas, etapa])
    setNovaEtapa({ nome: "", responsavel: "", observacoes: "" })
    setIsDialogOpen(false)
  }

  const removerEtapa = (etapaId: number) => {
    const novasEtapas = etapas.filter(e => e.id !== etapaId)
    onEtapasChange(novasEtapas)
  }

  const marcarConcluida = (etapaId: number) => {
    const novasEtapas = etapas.map(etapa =>
      etapa.id === etapaId 
        ? { 
            ...etapa, 
            concluida: !etapa.concluida,
            dataConclusao: !etapa.concluida ? format(new Date(), 'yyyy-MM-dd') : undefined
          }
        : etapa
    )
    onEtapasChange(novasEtapas)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Etapas de Produção</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Etapa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Etapa de Produção</DialogTitle>
                <DialogDescription>
                  Adicione uma nova etapa ao processo de produção
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Etapa</Label>
                  <Select 
                    value={novaEtapa.nome} 
                    onValueChange={(value) => setNovaEtapa({...novaEtapa, nome: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {etapasDisponiveis.map((etapa) => (
                        <SelectItem key={etapa} value={etapa}>
                          {etapa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Responsável</Label>
                  <Select 
                    value={novaEtapa.responsavel} 
                    onValueChange={(value) => setNovaEtapa({...novaEtapa, responsavel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {responsaveis.map((responsavel) => (
                        <SelectItem key={responsavel} value={responsavel}>
                          {responsavel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Input
                    value={novaEtapa.observacoes}
                    onChange={(e) => setNovaEtapa({...novaEtapa, observacoes: e.target.value})}
                    placeholder="Observações sobre a etapa"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={adicionarEtapa}>
                  Adicionar Etapa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {etapas.length > 0 ? (
            etapas.map((etapa) => (
              <div key={etapa.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => marcarConcluida(etapa.id)}
                  >
                    {etapa.concluida ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <div className={`font-medium ${etapa.concluida ? 'line-through text-muted-foreground' : ''}`}>
                      {etapa.nome}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Responsável: {etapa.responsavel}
                      {etapa.dataConclusao && (
                        <span className="ml-2">
                          - Concluída em {format(new Date(etapa.dataConclusao), 'dd/MM/yyyy')}
                        </span>
                      )}
                    </div>
                    {etapa.observacoes && (
                      <div className="text-xs text-muted-foreground">
                        {etapa.observacoes}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={etapa.concluida ? "default" : "secondary"}>
                    {etapa.concluida ? "Concluída" : "Pendente"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removerEtapa(etapa.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Nenhuma etapa definida
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
