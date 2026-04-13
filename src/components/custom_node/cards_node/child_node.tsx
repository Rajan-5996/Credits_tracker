import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";

const CardsChildNode = ({
    data,
    selected,
}: {
    data?: { title?: string; subtitle?: string; hideSource?: boolean };
    selected?: boolean;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                relative px-5 py-4 min-w-[220px] transition-all duration-300
                bg-white rounded-[1.25rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] border-2
                ${selected ? "border-primary shadow-xl shadow-primary/10 -translate-y-1" : "border-primary/5"}
                hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 group
            `}
        >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 rounded-t-[1.25rem] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] leading-none">
                        {data?.subtitle || "Endpoint"}
                    </span>
                </div>
                
                <h3 className="text-[13px] font-black text-foreground font-heading tracking-tight leading-snug capitalize">
                    {data?.title || "Operational Node"}
                </h3>
            </div>

            <Handle
                type="target"
                id="target-left"
                position={Position.Left}
                className="w-3 h-3 bg-white border-2 border-primary !-left-1.5 shadow-md hover:scale-125 transition-transform"
            />
            {!data?.hideSource && (
                <Handle
                    type="source"
                    id="source-right"
                    position={Position.Right}
                    className="w-3 h-3 bg-white border-2 border-primary !-right-1.5 shadow-md hover:scale-125 transition-transform"
                />
            )}
            
            <div className="mt-3 pt-3 border-t border-primary/5 flex items-center justify-between">
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1.5 h-0.5 rounded-full bg-primary/10" />
                    ))}
                </div>
                <div className="text-[8px] font-black text-primary/20 uppercase tracking-widest">Active</div>
            </div>
        </motion.div>
    )
}

export default CardsChildNode

