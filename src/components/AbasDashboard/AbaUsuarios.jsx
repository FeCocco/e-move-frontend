import {AppCard} from "@/components/AppCard/AppCard";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Check, Edit2, LogOut, Mail, Phone, User, UserRound} from 'lucide-react';
import {formatarTelefone} from "@/lib/utils";
import GenderSelector from "@/components/ui/GenderSlector";
import {Controller} from "react-hook-form";

export default function AbaUsuarios({
                                        profileData,
                                        isDialogOpen,
                                        setIsDialogOpen,
                                        formStatus,
                                        handleLogout,
                                        handleSubmit,
                                        EditarUsuarioSubmit,
                                        register,
                                        errors,
                                        apiError,
                                        control
                                    }) {

    if (!profileData) {
        return null;
    }

    return (
        <div className="w-full flex justify-center fade-in-up pb-20 md:pb-0"> {/* Padding bottom extra no mobile */}
            <AppCard className="bg-black/20 border-white/10 w-full max-w-4xl overflow-hidden rounded-2xl flex flex-col md:flex-row">

                {/* --- COLUNA DA ESQUERDA (Mobile: Topo) --- */}
                <div className="w-full md:w-1/3 bg-white/5 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 text-center gap-4 relative">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-azul-claro to-verde-claro p-1 shadow-lg shadow-azul-claro/20">
                        <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                            <UserRound size={64} className="text-white/80" />
                        </div>
                    </div>

                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-white mb-1">{profileData.nome}</h2>
                        <p
                            className="text-sm text-texto-claro/60 truncate"
                            title={profileData.email}
                        >
                            {profileData.email}
                        </p>
                    </div>

                    {/* Botão de Logout (Desktop): Só aparece em telas médias ou maiores */}
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="hidden md:flex mt-4 text-vermelho-status hover:bg-vermelho-status/10 hover:text-vermelho-status w-full"
                    >
                        <LogOut size={18} className="mr-2"/> Sair da Conta
                    </Button>
                </div>

                {/* --- COLUNA DA DIREITA (Mobile: Meio) --- */}
                <div className="flex-1 p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-orbitron text-verde-claro">Informações Pessoais</h3>

                        {/* BOTÃO DE EDITAR (Modal) */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="border-azul-claro/50 text-azul-claro hover:bg-azul-claro/10">
                                    <Edit2 size={16} className="mr-2"/> Editar
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-white/10 text-white w-[95%] max-h-[90vh] overflow-y-auto">
                                {formStatus === 'success' ? (
                                    <div className="flex flex-col items-center justify-center p-8 h-64">
                                        <div className="w-16 h-16 bg-verde-claro/20 rounded-full flex items-center justify-center mb-4">
                                            <Check size={32} className="text-verde-claro"/>
                                        </div>
                                        <DialogTitle className="text-xl font-bold mb-2">Perfil Atualizado!</DialogTitle>
                                        <DialogDescription className="text-center text-texto-claro/70">
                                            Seus dados foram salvos com sucesso.
                                        </DialogDescription>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit(EditarUsuarioSubmit)}>
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold text-azul-claro">Editar Perfil</DialogTitle>
                                            <DialogDescription>
                                                Atualize suas informações pessoais abaixo.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="grid gap-5 py-6">
                                            {/* Nome */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit_nome">Nome Completo</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-texto-claro/50" />
                                                    <Input id="edit_nome" className="pl-9 bg-white/5 border-white/20" {...register("nome")} defaultValue={profileData.nome} />
                                                </div>
                                                {errors.nome && <p className="text-vermelho-status text-xs">{errors.nome.message}</p>}
                                            </div>

                                            {/* Email */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="edit_email">Endereço de E-mail</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-texto-claro/50" />
                                                    <Input id="edit_email" className="pl-9 bg-white/5 border-white/20" {...register("email")} defaultValue={profileData.email} />
                                                </div>
                                                {errors.email && <p className="text-vermelho-status text-xs">{errors.email.message}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                {/* Telefone */}
                                                <div className="grid gap-2">
                                                    <Label htmlFor="edit_telefone">Telefone</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-texto-claro/50" />
                                                        <Input
                                                            id="edit_telefone"
                                                            className="pl-9 bg-white/5 border-white/20"
                                                            defaultValue={formatarTelefone(profileData.telefone)}
                                                            {...register("telefone")}
                                                            onChange={(e) => {
                                                                e.target.value = formatarTelefone(e.target.value);
                                                                register("telefone").onChange(e);
                                                            }}
                                                            maxLength={15}
                                                        />
                                                    </div>
                                                    {errors.telefone && <p className="text-vermelho-status text-xs">{errors.telefone.message}</p>}
                                                </div>

                                                {/* Gênero */}
                                                <div className="grid gap-2">
                                                    <Label htmlFor="sexo" className="mt-0 md:mt-0">Gênero</Label>
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
                                            </div>

                                            {/* Senhas (Opcional) */}
                                            <div className="border-t border-white/10 pt-4 mt-2">
                                                <p className="text-xs text-texto-claro/50 mb-3 uppercase font-bold tracking-wider">Segurança (Opcional)</p>

                                                <div className="grid gap-3">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="edit_senha">Nova Senha</Label>
                                                        <Input
                                                            id="edit_senha"
                                                            type="password"
                                                            placeholder="Deixe vazio para manter"
                                                            {...register("senha")}
                                                            className="bg-white/5 border-white/20"
                                                        />
                                                        {errors.senha && <p className="text-vermelho-status text-xs">{errors.senha.message}</p>}
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="edit_conf_senha">Confirmar Nova Senha</Label>
                                                        <Input
                                                            id="edit_conf_senha"
                                                            type="password"
                                                            placeholder="Repita a nova senha"
                                                            {...register("confirmar_senha")}
                                                            className="bg-white/5 border-white/20"
                                                        />
                                                        {errors.confirmar_senha && <p className="text-vermelho-status text-xs">{errors.confirmar_senha.message}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {apiError && <p className="text-vermelho-status text-center text-sm mb-4 bg-vermelho-status/10 p-2 rounded">{apiError}</p>}

                                        <DialogFooter className="gap-2 sm:gap-0 flex-col-reverse sm:flex-row">
                                            <DialogClose asChild>
                                                <Button type="button" variant="ghost" className="hover:bg-white/10 w-full sm:w-auto mt-2 sm:mt-0">Cancelar</Button>
                                            </DialogClose>
                                            <Button
                                                type="submit"
                                                variant="botaoazul"
                                                disabled={formStatus === 'submitting'}
                                                className="min-w-[120px] w-full sm:w-auto"
                                            >
                                                {formStatus === 'submitting' ? 'Salvando...' : 'Salvar Alterações'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* GRID DE INFORMAÇÕES (Card Principal) */}
                    <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
                        <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-start gap-3">
                            <div className="p-2 bg-azul-claro/10 rounded text-azul-claro">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-texto-claro/50 uppercase font-bold">Telefone</p>
                                <p className="text-white font-medium">{formatarTelefone(profileData.telefone)}</p>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-start gap-3">
                            <div className="p-2 bg-verde-claro/10 rounded text-verde-claro">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-texto-claro/50 uppercase font-bold">Gênero</p>
                                <p className="text-white font-medium">{profileData.sexo || "Não informado"}</p>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-start gap-3">
                            <div className="p-2 bg-purple-500/10 rounded text-purple-400">
                                <Mail size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-texto-claro/50 uppercase font-bold">Email</p>
                                <p
                                    className="text-white font-medium truncate"
                                    title={profileData.email}
                                >
                                    {profileData.email}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-start gap-3 opacity-50">
                            <div className="p-2 bg-white/10 rounded text-white">
                                <UserRound size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-texto-claro/50 uppercase font-bold">Senha</p>
                                <p className="text-white font-medium">********</p>
                            </div>
                        </div>
                    </div>

                    {/* Botão de Logout (Mobile): Só aparece em telas pequenas, abaixo de tudo */}
                    <div className="md:hidden mt-auto pt-4 border-t border-white/10">
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full text-vermelho-status hover:bg-vermelho-status/10 hover:text-vermelho-status py-6 text-lg"
                        >
                            <LogOut size={20} className="mr-2"/> Sair da Conta
                        </Button>
                    </div>
                </div>
            </AppCard>
        </div>
    );
}