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

export function DatePicker({ onDateChange }) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState(undefined)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal p-3 h-12 rounded-lg border border-white/30 bg-white/5 text-white hover:bg-white/5 hover:text-white",
                        !date && "text-white/50"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="top">
                <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                        setDate(selectedDate)
                        setOpen(false)
                        onDateChange(selectedDate)
                    }}
                    locale={ptBR}
                    toYear={2025}
                />
            </PopoverContent>
        </Popover>
    )
}