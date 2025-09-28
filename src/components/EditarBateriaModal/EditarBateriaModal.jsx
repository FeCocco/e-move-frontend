import { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function EditarBateriaModal({ veiculo, isOpen, onClose, onSave }) {
    const [nivelBateria, setNivelBateria] = useState(0);

    useEffect(() => {
        if (veiculo) {
            setNivelBateria(veiculo.nivelBateria || 0);
        }
    }, [veiculo]);

    if (!veiculo) return null;

    const handleSave = () => {
        onSave(veiculo.id, nivelBateria);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Nível da Bateria</DialogTitle>
                    <DialogDescription>
                        Ajuste o nível atual da bateria do seu {veiculo.marca} {veiculo.modelo}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6">
                    <Label htmlFor="bateria-slider" className="text-lg font-semibold text-center block">
                        {nivelBateria}%
                    </Label>
                    <Slider
                        id="bateria-slider"
                        min={0}
                        max={100}
                        step={1}
                        value={[nivelBateria]}
                        onValueChange={(value) => setNivelBateria(value[0])}
                        className="mt-4"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button variant="botaoazul" onClick={handleSave}>Salvar Alterações</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}