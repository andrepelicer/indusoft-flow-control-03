
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"

interface EtapaProducao {
  id: number
  nome: string
  descricao?: string
  ordem: number
  ativo: boolean
}

export default function EtapasProducao() {
  const [etapas, setEtapas] = useState<EtapaProducao[]>([
    { id: 1, nome: "Preparação de Material", descricao: "Separação e preparação dos materiais necessários", ordem: 1, ativo: true },
    { id: 2, nome: "Corte", descricao: "Corte das peças conforme especificações", ordem: 2, ativo: true },
    { id: 3, nome: "Usinagem", descricao: "Processo de usinagem das peças", ordem: 3, ativo: true },
    { id: 4, nome: "Soldagem", descricao: "Soldagem de componentes", ordem: 4, ativo: true },
    { id: 5, nome: "Montagem", descricao: "Montagem final do produto", ordem: 5, ativo: true },
    { id: 6, nome: "Acabamento", descricao: "Acabamento e polimento", ordem: 6, ativo: true },
    { id: 7, nome: "Controle de Qualidade", descricao: "Inspeção e controle de qualidade", ordem: 7, ativo: true },
    { id: 8, nome: "Embalagem", descricao: "Embalagem do produto final", ordem: 8, ativo: true }
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedEtapa, setSelectedEtapa] = useState<EtapaProducao | null>(null)
  const [novaEtapa, setNovaEtapa] = useState<Partial<EtapaProducao>>({
    nome: "",
    descricao: "",
    ordem: 0,
    ativo: true
  })

  const handleSalvar = () => {
    if (isEditing && selectedEtapa) {
      setEtapas(etapas.map(etapa => 
        etapa.id === selectedEtapa.id ? { ...selectedEtapa } : etapa
      ))
    } else {
      if (!novaEtapa.nome) return

      const maxOrdem = Math.max(...etapas.map(e => e.ordem), 0)
      const etapa: EtapaProducao = {
        id: Date.now(),
        nome: novaEtapa.nome,
        descricao: novaEtapa.descricao,
        ordem: novaEtapa.ordem || maxOrdem + 1,
        ativo: true
      }
      
      setEtapas([...etapas, etapa])
    }
    
    resetForm()
  }

  const handleEditar = (etapa: EtapaProducao) => {
    setSelectedEtapa(etapa)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleExcluir = (etapaId: number) => {
    setEtapas(etapas.filter(e => e.id !== etapaId))
  }

  const toggleAtivo = (etapaId: number) => {
    setEtapas(etapas.map(etapa =>
      etapa.id === etapaId ? { ...etapa, ativo: !etapa.ativo } : etapa
    ))
  }

  const resetForm = () => {
    setIsDialogOpen(false)
    setIsEditing(false)
    setSelectedEtapa(null)
    setNovaEtapa({
      nome: "",
      descricao: "",
      ordem: 0,
      ativo: true
    })
  }

  const etapasOrdenadas = [...etapas].sort((a, b) => a.ordem - b.ordem)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Etapas de Produção</h1>
          <p className="text-muted-foreground">
            Gerencie as etapas do processo de produção
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditing(false)
              setSelectedEtapa(null)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Etapa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Etapa de Produção" : "Nova Etapa de Produção"}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? "Altere as informações da etapa" : "Preencha as informações para criar uma nova etapa"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Etapa</Label>
                <Input
                  id="nome"
                  value={isEditing ? selectedEtapa?.nome : novaEtapa.nome}
                  onChange={(e) => {
                    if (isEditing && selectedEtapa) {
                      setSelectedEtapa({...selectedEtapa, nome: e.target.value})
                    } else {
                      setNovaEtapa({...novaEtapa, nome: e.target.value})
                    }
                  }}
                  placeholder="Nome da etapa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={isEditing ? selectedEtapa?.descricao : novaEtapa.descricao}
                  onChange={(e) => {
                    if (isEditing && selectedEtapa) {
                      setSelectedEtapa({...selectedEtapa, descricao: e.target.value})
                    } else {
                      setNovaEtapa({...novaEtapa, descricao: e.target.value})
                    }
                  }}
                  placeholder="Descrição da etapa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ordem">Ordem</Label>
                <Input
                  id="ordem"
                  type="number"
                  value={isEditing ? selectedEtapa?.ordem : novaEtapa.ordem}
                  onChange={(e) => {
                    const valor = parseInt(e.target.value) || 0
                    if (isEditing && selectedEtapa) {
                      setSelectedEtapa({...selectedEtapa, ordem: valor})
                    } else {
                      setNovaEtapa({...novaEtapa, ordem: valor})
                    }
                  }}
                  placeholder="Ordem de execução"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={handleSalvar}>
                {isEditing ? "Salvar Alterações" : "Criar Etapa"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total de Etapas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{etapas.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Etapas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {etapas.filter(e => e.ativo).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Etapas Inativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {etapas.filter(e => !e.ativo).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Etapas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Etapas de Produção</CardTitle>
          <CardDescription>
            Gerencie as etapas do processo de produção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {etapasOrdenadas.map((etapa) => (
                <TableRow key={etapa.id}>
                  <TableCell className="font-medium">{etapa.ordem}</TableCell>
                  <TableCell>{etapa.nome}</TableCell>
                  <TableCell>{etapa.descricao || "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant={etapa.ativo ? "default" : "secondary"}
                      size="sm"
                      onClick={() => toggleAtivo(etapa.id)}
                    >
                      {etapa.ativo ? "Ativo" : "Inativo"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditar(etapa)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExcluir(etapa.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
