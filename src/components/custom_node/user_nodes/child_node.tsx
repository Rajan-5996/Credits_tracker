import { Handle, Position } from "@xyflow/react";

const ChildNode = ({ data, selected }: { data?: any; selected?: boolean }) => {
    const isLeftNode = data?.side === "left";
    const isRightNode = data?.side === "right";
    const labelText = String(data?.label || "").toLowerCase();
    const isWorkflowOrDataflow =
        labelText.includes("workflow") || labelText.includes("dataflow");

    const activeCount = Number(data?.activeCount ?? 0);
    const inactiveCount = Number(data?.inactiveCount ?? 0);

    return (
        <div
            className={`
                relative px-6 py-5 min-w-[220px] text-center transition-all duration-300
                bg-white rounded-xl shadow-xl border-2
                ${selected ? "border-primary scale-105" : "border-primary/5"}
                hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1
            `}
        >
            <div className="text-[10px] font-black text-primary/60 capitalize tracking-[0.15em] mb-2 leading-none">
                {data?.label || "Node metric"}
            </div>

            <div className="text-3xl font-black text-foreground font-heading tracking-tight leading-tight">
                {data?.value || data?.description || "0"}
            </div>

            <div className="mt-4">
                {isWorkflowOrDataflow ? (
                    <div className="flex justify-center gap-3">
                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-black capitalize bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                            Active: {activeCount}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-black capitalize bg-rose-50 text-rose-700 border border-rose-100 shadow-sm">
                            Dormant: {inactiveCount}
                        </span>
                    </div>
                ) : (
                    <div className="text-[11px] text-muted-foreground/80 capitalize tracking-wide font-bold">
                        {data?.description || "Sub-system data"}
                    </div>
                )}
            </div>

            <Handle
                type="target"
                id="target-left"
                position={Position.Left}
                className={`${isLeftNode ? "hidden" : "block"} w-3.5 h-3.5 bg-white border-2 border-primary !-left-1.5 shadow-md`}
            />

            <Handle
                type="target"
                id="target-right"
                position={Position.Right}
                className={`${isRightNode ? "hidden" : "block"} w-3.5 h-3.5 bg-white border-2 border-primary !-right-1.5 shadow-md`}
            />
        </div>
    );
};

export default ChildNode;
