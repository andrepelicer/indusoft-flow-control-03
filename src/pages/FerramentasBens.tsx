
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Wrench } from "lucide-react"
import { BemFerramentaEditModal } from "@/components/BemFerramentaEditModal"
import { ManutencaoModal, Manutencao } from "@/components/ManutencaoModal"
import { BemFerramentaDashboard } from "@/components/BemFerramentaDashboard" // NOVO

interface BemFerramenta {
  id: number
  nome: string
  tipo: string
  codigo: string
  status: string
}

type BemFerramentaWithManutencoes = BemFerramenta & { manutencoes: Manutencao[] }

export default function FerramentasBens() {
  const [itens, setItens] = useState<BemFerramentaWithManutencoes[]>([])
  const [nome, setNome] = useState("")
  const [tipo, setTipo] = useState("")
  const [codigo, setCodigo] = useState("")
  const [status, setStatus] = useState("Disponível")

  // Modal gestão
  const [editOpen, setEditOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BemFerramentaWithManutencoes | null>(null)

  // Modal manutenção
  const [manutencaoOpen, setManutencaoOpen] = useState(false)
  const [itemManutencao, setItemManutencao] = useState<BemFerramentaWithManutencoes | null>(null)

  const cadastrar = (e: React.FormEvent) => {
    e.preventDefault()
    setItens(prev => [
      ...prev,
      {
        id: Date.now(),
        nome,
        tipo,
        codigo,
        status,
        manutencoes: [],
      },
    ])
    setNome("")
    setTipo("")
    setCodigo("")
    setStatus("Disponível")
  }

  const handleRemove = (id: number) => {
    setItens(itens.filter(i => i.id !== id))
  }

  const handleEdit = (item: BemFerramentaWithManutencoes) => {
    setSelectedItem(item)
    setEditOpen(true)
  }

  const handleSaveEdit = (edited: BemFerramenta) => {
    setItens(prev =>
      prev.map(i => (i.id === edited.id ? { ...i, ...edited } : i))
    )
  }

  // Manutenção handlers
  const handleOpenManutencao = (item: BemFerramentaWithManutencoes) => {
    setItemManutencao(item)
    setManutencaoOpen(true)
  }

  const handleAddManutencao = (manutencao: Manutencao) => {
    if (!itemManutencao) return
    setItens(prev =>
      prev.map(i =>
        i.id === itemManutencao.id
          ? { ...i, manutencoes: [manutencao, ...(i.manutencoes ?? [])] }
          : i
      )
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <BemFerramentaDashboard itens={itens} />

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Wrench />
              Cadastro de Ferramentas e Bens
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={cadastrar} className="grid gap-4">
            <Input
              placeholder="Nome do bem/ferramenta"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
            <Input
              placeholder="Tipo (ex: Ferramenta, Equipamento, Veículo)"
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              required
            />
            <Input
              placeholder="Código de identificação"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              required
            />
            <Input
              placeholder="Status (ex: Disponível, Em uso, Manutenção)"
              value={status}
              onChange={e => setStatus(e.target.value)}
              required
            />
            <Button type="submit">Cadastrar</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Ferramentas/Bens</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {itens.length === 0 && (
              <li className="text-muted-foreground text-sm">Nenhum item cadastrado ainda.</li>
            )}
            {itens.map(i => (
              <li key={i.id} className="border px-3 py-2 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <strong>{i.nome}</strong> • {i.tipo} • {i.codigo} • {i.status}
                  <div className="text-xs text-muted-foreground mt-1">
                    Última manutenção:{" "}
                    {i.manutencoes && i.manutencoes.length > 0
                      ? `${i.manutencoes[0].data} — ${i.manutencoes[0].descricao}`
                      : "Nunca realizada"}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(i)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenManutencao(i)}
                  >
                    Manutenção
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(i.id)}
                  >
                    Remover
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Modal de edição */}
      <BemFerramentaEditModal
        open={editOpen}
        item={selectedItem}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
      />

      {/* Modal de manutenção */}
      <ManutencaoModal
        open={manutencaoOpen}
        manutencoes={itemManutencao?.manutencoes ?? []}
        itemNome={itemManutencao?.nome ?? ""}
        onAdd={manutencao => {
          handleAddManutencao(manutencao)
        }}
        onClose={() => setManutencaoOpen(false)}
      />
    </div>
  )
}
