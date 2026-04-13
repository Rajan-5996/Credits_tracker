import {
    Handle,
    Position,
} from "@xyflow/react";

import { formatCompactNumber } from "@/lib/utils";
import ChildNode from "./child_node";

const CreditNode = ({ data, selected }: { data: any; selected: boolean }) => {
    return (
        <div className={`
            w-[480px] bg-white rounded-xl overflow-hidden transition-all duration-500 shadow-2xl border border-primary/20
            ${selected ? "ring-[8px] ring-primary/20 scale-105" : "hover:scale-[1.02]"}
        `}>
            {/* Top accent bar */}
            <div className="h-2.5 w-full gwc-gradient" />

            {/* Header */}
            <div className="flex items-center gap-7 p-8 border-b border-primary/5">
                <div className="w-20 h-20 rounded-xl gwc-gradient p-4.5 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <img src="/Logo.svg" alt={data.label} className="brightness-0 invert h-full w-full object-contain" />
                </div>

                <div className="min-w-0">
                    <h3 className="text-3xl font-black text-foreground font-heading leading-tight truncate capitalize tracking-tighter">
                        {data.label || "System core"}
                    </h3>
                    <p className="text-[12px] font-black text-primary/60 capitalize tracking-[0.2em] mt-2.5 leading-none">
                        {data.description || "Active intelligence mainframe"}
                    </p>
                </div>
            </div>

            {/* Credits Display */}
            <div className="m-8 mt-0 pt-8 pb-10 px-10 bg-primary/5 rounded-xl border border-primary/5 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[80px] group-hover:bg-accent/20 transition-colors" />

                <span className="text-[11px] font-black text-primary/40 capitalize tracking-[0.3em] block mb-4">
                    Intelligence capacity
                </span>
                <div className="flex items-baseline justify-center gap-3">
                    <span className="text-7xl font-black text-foreground font-heading tracking-tighter gwc-text-gradient">
                        {formatCompactNumber(data.credits || 0)}
                    </span>
                    <span className="text-[12px] font-black text-primary/40 capitalize tracking-[0.2em]">Credits</span>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="!w-5 !h-5 !bg-primary !border-4 !border-white !shadow-2xl !-right-2.5"
            />
        </div>
    );
};

export default CreditNode;

export const nodeTypes = {
    creditNode: CreditNode,
    childNode: ChildNode,
};
