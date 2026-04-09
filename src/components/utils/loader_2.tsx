import { Loader } from "lucide-react"

const Loader2 = () => {
    return (
        <div className="flex h-full min-h-30 w-full items-center justify-center py-3 px-6">
            <Loader className="text-primary animate-spin" size={45} />
        </div>
    )
}

export default Loader2

