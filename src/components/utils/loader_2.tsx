import { Loader } from "lucide-react"

const Loader2 = () => {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Loader className="text-primary animate-spin" size={45} />
        </div>
    )
}

export default Loader2
