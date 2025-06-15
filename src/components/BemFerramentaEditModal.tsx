
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export interface BemFerramenta {
  id: number;
  nome: string;
  tipo: string;
  codigo: string;
  status: string;
}

interface BemFerramentaEditModalProps {
  open: boolean;
  onClose: () => void;
  item: BemFerramenta | null;
  onSave: (item: BemFerramenta) => void;
}

export function BemFerramentaEditModal({ open, onClose, item, onSave }: BemFerramentaEditModalProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (item) {
      setNome(item.nome);
      setTipo(item.tipo);
      setCodigo(item.codigo);
      setStatus(item.status);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    onSave({
      ...item,
      nome,
      tipo,
      codigo,
      status,
    });
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Bem/Ferramenta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
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
            placeholder="Status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            required
          />
          <DialogFooter>
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
