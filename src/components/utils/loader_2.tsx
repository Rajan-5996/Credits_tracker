import { motion } from "framer-motion";

const Loader2 = () => {
    return (
        <div className="flex flex-col h-full min-h-[300px] w-full items-center justify-center space-y-6">
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 rounded-full border-4 border-accent/10 border-b-accent"
                />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-primary capitalize tracking-[0.3em] animate-pulse">Syncing intelligence</span>
                <p className="text-[8px] font-black text-primary/30 capitalize tracking-widest mt-2 px-3 py-1 bg-primary/5 rounded-full">Secure node isolation active</p>
            </div>
        </div>
    )
}

export default Loader2
