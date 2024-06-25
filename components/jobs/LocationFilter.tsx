"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import {cn, formUrlQuery, locationFilter} from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";



interface Props {
    otherClasses?: string;
}
export function LocationFilter({otherClasses}: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paramFilter = searchParams.get('location');

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(paramFilter || "")


    const handleUpdateParams = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'location',
            value
        })

        router.push(newUrl, { scroll: false })
    }

    return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[220px] justify-around"
                    >
                        <Image src={"/assets/icons/carbon-location.svg"} alt={"location logo"} width={18} height={18}/>
                        {value
                            ? locationFilter.find((location) => location.value === value)?.label
                            : "Select Location"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
                    <Command>
                        <CommandInput placeholder="Search Location..." />
                        <CommandEmpty>No Location found.</CommandEmpty>
                        <CommandGroup>
                            {locationFilter.map((location, index) => (
                                <CommandItem
                                    key={index}
                                    value={location.value}
                                    className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        handleUpdateParams(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === location.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {location.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
    )
}
