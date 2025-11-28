"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ onDateChange, selected, placeholder = "Selecione uma data" }) {
    const [open, setOpen] = React.useState(false)

    const [internalDate, setInternalDate] = React.useState(undefined);

    const dateToUse = selected !== undefined ? selected : internalDate;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal p-3 h-10 rounded-lg border border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white truncate",
                        !dateToUse && "text-white/50"
                    )}
                    //ícone removido devido a falta de espaçco, pensar em algo melhor ou deixar assim
                >
                    {dateToUse ? (
                        // Formato curto "dd/MM/yyyy" para caber no espaço
                        format(dateToUse, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                        <span className="truncate">{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                    mode="single"
                    selected={dateToUse}
                    onSelect={(selectedDate) => {
                        if (selected === undefined) setInternalDate(selectedDate);
                        onDateChange(selectedDate)
                        setOpen(false)
                    }}
                    locale={ptBR}
                    toYear={2025}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}