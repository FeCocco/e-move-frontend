import { AppCard } from "@/components/AppCard/AppCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoundPen, LogOut, Check } from 'lucide-react';
import { formatarTelefone } from "@/lib/utils";
import GenderSelector from "@/components/ui/GenderSlector";
import {Controller} from "react-hook-form";

export default function AbaUsuarios({ profileData, isDialogOpen, setIsDialogOpen, formStatus, handleLogout, handleSubmit, EditarUsuarioSubmit, register, errors, apiError, control }) {

    if (!profileData) {
        return null;
    }

    return (
        <div>
            <h2 className="flex justify-center text-2xl font-orbitron text-verde-claro mb-4">Minha Conta</h2>
            <div className="flex justify-center">
                <AppCard className="bg-black/20 p-6 rounded-lg w-full max-w-md text-left">
                    <p className="mb-2"><strong>Nome:</strong> {profileData.nome}</p>
                    <p className="mb-2"><strong>Email:</strong> {profileData.email}</p>
                    <p className="mb-2"><strong>Telefone:</strong> {formatarTelefone(profileData.telefone)}</p>
                    <p><strong>Sexo:</strong> {profileData.sexo}</p>
                    <div className="p-4 flex justify-center">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="botaoazul"><UserRoundPen /> Editar Meus Dados</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                {formStatus === 'success' ? (
                                    <div className="flex flex-col items-center justify-center p-8 h-48">
                                        <Check size={48} className="text-verde-claro mb-4"/>
                                        <DialogTitle className="text-xl">Perfil Atualizado!</DialogTitle>
                                        <DialogDescription>
                                            Seus dados foram salvos com sucesso.
                                        </DialogDescription>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit(EditarUsuarioSubmit)}>
                                        <DialogHeader>
                                            <DialogTitle>Editar Perfil</DialogTitle>
                                            <DialogDescription>
                                                Faça suas modificações aqui e salve quando tiver finalizado.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit_nome">Nome</Label>
                                                <Input id="edit_nome" {...register("nome")} defaultValue={profileData.nome} />
                                                {errors.nome && <p className="text-vermelho-status text-xs mt-1">{errors.nome.message}</p>}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit_email">E-mail</Label>
                                                <Input id="edit_email" {...register("email")} defaultValue={profileData.email} />
                                                {errors.email && <p className="text-vermelho-status text-xs mt-1">{errors.email.message}</p>}
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="edit_telefone" className="mt-3">Telefone</Label>
                                                <Input
                                                    id="edit_telefone"
                                                    defaultValue={formatarTelefone(profileData.telefone)}
                                                    {...register("telefone")}
                                                    onChange={(e) => {
                                                        const formatted = formatarTelefone(e.target.value);
                                                        e.target.value = formatted;
                                                        // Atualiza o hook form
                                                        register("telefone").onChange(e);
                                                    }}
                                                    maxLength={15}
                                                />
                                                {errors.telefone && <p className="text-vermelho-status text-xs mt-1">{errors.telefone.message}</p>}
                                            </div>

                                            <Label htmlFor="sexo" className="mt-3">Gênero</Label>
                                            <Controller
                                                name="sexo"
                                                control={control}
                                                defaultValue={profileData.sexo}
                                                render={({ field }) => (
                                                    <GenderSelector
                                                        value={field.value}
                                                        onChange={(value) => field.onChange(value)}
                                                    />
                                                )}
                                            />

                                        </div>
                                        {apiError && <p className="text-vermelho-status text-center text-sm mb-2">{apiError}</p>}
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="botaoazul">Cancelar</Button>
                                            </DialogClose>
                                            <Button
                                                variant="ghost"
                                                className="text-white"
                                                disabled={formStatus === 'submitting'}
                                            >
                                                {formStatus === 'submitting' ? 'Salvando...' : 'Salvar'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </AppCard>
            </div>
            <div className="text-center mt-6">
                <Button variant="link" onClick={handleLogout} className="text-xl text-azul-botao"> <LogOut size={48}/>Sair da Conta</Button>
            </div>
        </div>
    );
}