import ActionFilter from "./action_filter"
import SearchBar from "./searchBar"

type FilterProps = {
    searchValue: string
    onSearchChange: (value: string) => void
    statusValue: string
    onStatusChange: (value: string) => void
}

const Filter = ({ searchValue, onSearchChange, statusValue, onStatusChange }: FilterProps) => {
    return (
        <div className="flex justify-center items-center gap-4 p-4">
            <SearchBar value={searchValue} onChange={onSearchChange} />
            <ActionFilter value={statusValue} onChange={onStatusChange} />
        </div>
    )
}

export default Filter

