import { useState } from "react"
import { ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

type ActionFilterProps = {
    value: string
    onChange: (value: string) => void
}

const ActionFilter = ({ value, onChange }: ActionFilterProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const filterOptions = [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
    ]

    const selectedOption = filterOptions.find(opt => opt.value === value)

    const getStatusColor = (val: string) => {
        if (val === "active") return "#10b981"
        if (val === "inactive") return "#ef4444"
        return "transparent"
    }

    const handleSelect = (val: string) => {
        onChange(val)
        setIsOpen(false)
    }

    return (
        <div className="relative z-50 w-full min-w-44">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                className="w-full h-12 justify-between rounded-2xl border-border bg-white/60 backdrop-blur-md hover:bg-white/80 transition-all focus:ring-4 focus:ring-primary/10 px-4"
            >
                <div className="flex items-center gap-2.5">
                    <Filter className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground tracking-tight">{selectedOption?.label}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsOpen(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute z-50 top-full mt-2 w-full rounded-2xl border border-border bg-white/95 shadow-2xl backdrop-blur-xl overflow-hidden p-1.5"
                        >
                            {filterOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`flex w-full items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all border ${value === option.value
                                        ? "bg-primary/20 text-primary border-primary/30 shadow-sm backdrop-blur-md"
                                        : "hover:bg-white/20 text-foreground/70 border-transparent"
                                        }`}
                                >
                                    <div
                                        className={`w-2 h-2 rounded-full mr-2.5 ${value === option.value ? 'bg-white' : ''}`}
                                        style={{ backgroundColor: value === option.value ? undefined : getStatusColor(option.value) }}
                                    />
                                    {option.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ActionFilter
