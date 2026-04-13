import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import CardsChildNode from "./child_node";

const CardsRootNode = ({ data, selected }: { data?: { title?: string; subtitle?: string }; selected?: boolean }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`
                relative px-6 py-6 min-w-[260px] transition-all duration-300
                bg-white rounded-[1.5rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border-2
                ${selected ? "border-primary shadow-2xl shadow-primary/20 scale-105" : "border-primary/5"}
                hover:border-primary/20 hover:shadow-2xl group
            `}
        >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-t-[1.5rem]" />
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.25em] leading-none px-2 py-1 bg-primary/5 rounded-md">
                        {data?.subtitle || "System Core"}
                    </span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
                    </div>
                </div>
                
                <h2 className="text-lg font-black text-foreground font-heading tracking-tight leading-tight capitalize mt-1">
                    {data?.title || "Master Protocol"}
                </h2>
                
                <div className="mt-4 flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary/40">
                                {i}
                            </div>
                        ))}
                    </div>
                    <span className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.1em]">Clusters linked</span>
                </div>
            </div>

            <Handle
                type="target"
                id="target-left"
                position={Position.Left}
                className="w-4 h-4 bg-white border-2 border-primary !-left-2 shadow-xl hover:scale-125 transition-transform"
            />
            <Handle
                type="source"
                id="source-right"
                position={Position.Right}
                className="w-4 h-4 bg-white border-2 border-primary !-right-2 shadow-xl hover:scale-125 transition-transform"
            />
        </motion.div>
    )
}

export default CardsRootNode

export const nodeTypes = {
    cardsNode: CardsRootNode,
    cardschildNode: CardsChildNode,
};


