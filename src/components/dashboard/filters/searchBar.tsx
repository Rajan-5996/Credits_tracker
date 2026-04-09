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
        <div className="relative w-full">
            <div className="relative flex items-center group">
                <Search className="absolute left-4 h-4.5 w-4.5 text-primary/40 group-focus-within:text-primary transition-colors" />
                <Input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-white/60 pl-11 pr-11 h-12 shadow-sm backdrop-blur-md transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                />
                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 rounded-xl p-1 bg-muted/50 hover:bg-muted transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default SearchBar


