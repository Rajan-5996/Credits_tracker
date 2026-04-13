import {
    Handle,
    Position,
} from "@xyflow/react";
import { formatCompactNumber } from "@/lib/utils";

const ChildNode = ({ data }: { data: any }) => {
    return (
        <div className="group relative min-w-[380px] bg-white rounded-xl p-9 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:border-primary/30 cursor-pointer border border-primary/20 overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-2.5 h-full bg-primary/10 group-hover:bg-primary transition-colors" />
            
            <Handle
                type="target"
                position={Position.Left}
                className="!w-5 !h-5 !bg-primary !border-4 !border-white !shadow-2xl !-left-2.5"
            />

            <div className="flex flex-col gap-4 text-left pl-5">
                <span className="text-[11px] font-black text-primary/50 capitalize tracking-[0.2em] font-sans">
                    {data.label === "RYUU_APP" ? "Production cluster" : "Intelligence cluster"}
                </span>
                <span className="text-2xl font-black text-foreground capitalize tracking-tight leading-tight truncate">
                    {data.label}
                </span>
                <div className="flex items-center gap-5 pt-5 border-t border-primary/10 mt-2">
                    <span className="text-5xl font-black text-foreground font-heading tracking-tight gwc-text-gradient leading-none">
                        {formatCompactNumber(data.credits)}
                    </span>
                    <div className="px-5 py-2 rounded-full bg-primary/5 border border-primary/10 shadow-sm shrink-0">
                        <span className="text-[10px] font-black text-primary capitalize tracking-widest leading-none">Credits</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildNode;
