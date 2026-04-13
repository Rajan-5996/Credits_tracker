import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

type SearchBarProps = {
    value: string
    onChange: (value: string) => void
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
    const handleClear = () => {
        onChange("")
    }

    return (
        <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-all duration-300 z-10" />
            <Input
                type="text"
                placeholder="Search identity node..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-full border border-primary/10 bg-white/70 pl-10 pr-10 h-10 shadow-sm backdrop-blur-xl transition-all duration-300 focus:border-primary/40 focus:ring-2 focus:ring-primary/5 font-sans font-bold text-[11px] tracking-tight placeholder:text-muted-foreground/30 placeholder:capitalize"
            />
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                    aria-label="Clear search"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </div>
    )
}

export default SearchBar
