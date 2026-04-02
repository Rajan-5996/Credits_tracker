import { useState } from "react"
import { ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

type ActionFilterProps = {
    value: string
    onChange: (value: string) => void
}

const ActionFilter = ({ value, onChange }: ActionFilterProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const filterOptions = [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
    ]

    const currentLabel = filterOptions.find(opt => opt.value === value)?.label || "All"

    const getStatusColor = (value: string) => {
        if (value === "active") return "#10b981"
        if (value === "inactive") return "#ef4444"
        return "transparent"
    }

    const handleSelect = (value: string) => {
        onChange(value)
        setIsOpen(false)
    }

    return (
        <div className="relative z-50 w-48">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                className="w-full justify-between rounded-lg border-amber-300/70 bg-white/70 backdrop-blur-sm hover:bg-white/80"
            >
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm">{currentLabel}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>

            {isOpen && (
                <div className="absolute z-60 top-full mt-2 w-full rounded-lg border border-amber-300/70 bg-white/95 shadow-lg backdrop-blur-sm">
                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`flex w-full items-center px-3 py-2 text-sm transition-colors ${value === option.value
                                ? "bg-amber-100/50 text-foreground font-medium"
                                : "hover:bg-muted text-foreground/80"
                                }`}
                        >
                            <div
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: getStatusColor(option.value) }}
                            />
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ActionFilter
