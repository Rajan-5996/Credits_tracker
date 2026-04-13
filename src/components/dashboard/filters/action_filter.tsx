import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutGrid, Check } from "lucide-react"

const options = [
    { label: "Global inventory", value: "all" },
    { label: "Active nodes", value: "active" },
    { label: "Dormant nodes", value: "inactive" },
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return '#10b981';
        case 'inactive': return '#ef4444';
        default: return '#6F2B8B';
    }
}

const ActionFilter = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const selectedOption = options.find(o => o.value === value)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center justify-between w-full h-11 px-6 rounded-full glass-console border-none shadow-lg bg-white/70 backdrop-blur-2xl hover:bg-white/95 hover:shadow-xl transition-all duration-300 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <LayoutGrid size={14} />
                        </div>
                        <span className="text-[11px] font-black text-foreground capitalize tracking-widest">{selectedOption?.label}</span>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-console rounded-[1.5rem] border-none p-2 shadow-2xl animate-in fade-in zoom-in duration-300 translate-y-3">
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`
                            flex items-center justify-between px-4 py-3 rounded-xl mb-1 last:mb-0 cursor-pointer transition-all duration-200
                            ${value === option.value 
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                                : "hover:bg-primary/5 text-muted-foreground hover:text-primary"}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div 
                                className={`w-2 h-2 rounded-full ${value === option.value ? 'bg-white shadow-[0_0_8px_white]' : ''}`} 
                                style={{ backgroundColor: value === option.value ? undefined : getStatusColor(option.value) }}
                            />
                            <span className="text-[10px] font-black capitalize tracking-widest">{option.label}</span>
                        </div>
                        {value === option.value && <Check size={12} className="text-white" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ActionFilter
