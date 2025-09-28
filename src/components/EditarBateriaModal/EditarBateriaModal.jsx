// src/components/EditarBateriaModal.jsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const EditarBateriaModal = ({ veiculo, isOpen, onClose, onSave }) => {
    const [nivelBateria, setNivelBateria] = useState(veiculo?.nivelBateria || 0);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setError('');
        const bateria = parseInt(nivelBateria, 10);
        if (isNaN(bateria) || bateria < 0 || bateria > 100) {
            setError("O nível da bateria deve ser um número entre 0 e 100.");
            return;
        }

        setIsSaving(true);
        try {
            await onSave(veiculo.id, bateria);
            onClose();
        } catch (err) {
            setError(err.message || "Falha ao atualizar a bateria.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!veiculo) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
                <DialogHeader>
                    <DialogTitle>Editar Nível da Bateria</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bateria" className="text-right">
                            Bateria (%)
                        </Label>
                        <Input
                            id="bateria"
                            type="number"
                            min="0"
                            max="100"
                            value={nivelBateria}
                            onChange={(e) => setNivelBateria(e.target.value)}
                            className="col-span-3 bg-gray-700 border-gray-600"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm col-span-4 text-center">{error}</p>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};