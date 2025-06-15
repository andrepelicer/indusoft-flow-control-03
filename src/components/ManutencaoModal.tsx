
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface Manutencao {
  id: number;
  data: string;
  descricao: string;
  responsavel: string;
}

interface ManutencaoModalProps {
  open: boolean;
  onClose: () => void;
  manutencoes: Manutencao[];
  onAdd: (manutencao: Manutencao) => void;
  itemNome: string;
}

export function ManutencaoModal({ open, onClose, manutencoes, onAdd, itemNome }: ManutencaoModalProps) {
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [responsavel, setResponsavel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !descricao || !responsavel) return;
    onAdd({
      id: Date.now(),
      data,
      descricao,
      responsavel,
    });
    setDescricao("");
    setData("");
    setResponsavel("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manutenção - {itemNome}</DialogTitle>
          <DialogDescription>Registre e acompanhe o histórico de manutenções deste item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Data"
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            required
          />
          <Input
            placeholder="Descrição"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            required
          />
          <Input
            placeholder="Responsável"
            value={responsavel}
            onChange={e => setResponsavel(e.target.value)}
            required
          />
          <DialogFooter>
            <Button type="submit">Adicionar Manutenção</Button>
            <Button variant="secondary" type="button" onClick={onClose}>Fechar</Button>
          </DialogFooter>
        </form>
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Histórico de Manutenções</h4>
          <ul className="max-h-40 overflow-y-auto space-y-2">
            {manutencoes.length === 0 && (
              <li className="text-muted-foreground text-sm">Nenhuma manutenção registrada ainda.</li>
            )}
            {manutencoes.map((m) => (
              <li key={m.id} className="border rounded px-2 py-1">
                <div><span className="font-bold">{m.data}</span> — {m.descricao}</div>
                <div className="text-xs text-muted-foreground">Responsável: {m.responsavel}</div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
