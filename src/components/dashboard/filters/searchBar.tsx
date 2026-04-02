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
            <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-lg border border-amber-300/70 bg-white/70 pl-10 pr-10 py-2 shadow-sm backdrop-blur-sm transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:ring-offset-2"
                />
                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 rounded-md p-1 hover:bg-muted"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default SearchBar
