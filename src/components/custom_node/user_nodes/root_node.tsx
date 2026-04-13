import { Handle, Position } from "@xyflow/react";
import ChildNode from "./child_node";

const RootNode = ({ data, selected }: { data?: any; selected?: boolean }) => {
    return (
        <div
            className={`
                relative px-8 py-6 min-w-[260px] text-center transition-all duration-300
                bg-white rounded-xl shadow-2xl border-2
                ${selected ? "border-primary scale-105" : "border-primary/5 hover:border-primary/20"}
            `}
        >
            {/* Top branding bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 gwc-gradient" />

            <div className="text-xl font-black font-heading tracking-tight text-foreground capitalize mb-2">
                {data?.label || "Identity mainframe"}
            </div>

            <div className="text-[11px] font-black gwc-text-gradient capitalize tracking-[0.2em] opacity-80">
                {data?.description || "Network core node"}
            </div>

            <Handle
                type="source"
                id="source-right"
                position={Position.Right}
                className="w-4 h-4 bg-white border-4 border-primary !-right-2 shadow-lg"
            />

            <Handle
                type="source"
                id="source-left"
                position={Position.Left}
                className="w-4 h-4 bg-white border-4 border-primary !-left-2 shadow-lg"
            />
        </div>
    );
};

export default RootNode;

export const nodeTypes = {
    usertNode: RootNode,
    childNode: ChildNode,
};
