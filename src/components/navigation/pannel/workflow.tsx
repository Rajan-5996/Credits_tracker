import type { WorkflowRecord } from "@/types/details_type";
import { formatCompactNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import { WorkflowDetailDialog } from "@/components/dialog/workflow-detail";

const Workflow = ({ data, status }: { data: WorkflowRecord; status: "active" | "inactive" }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative p-5 bg-white border border-primary/10 hover:border-primary/30 transition-all shadow-md hover:shadow-xl rounded-xl"
        >
            <div className="flex items-center justify-between mb-5">
                <div className="flex flex-col min-w-0 flex-1 mr-4">
                    <span className="text-[11px] font-black text-primary/50 capitalize tracking-[0.2em] mb-2 leading-none">Intelligence flow</span>
                    <h3 className="text-base font-black text-foreground capitalize tracking-tight leading-tight truncate">{data.workflow_name || "System workflow"}</h3>
                </div>
                <div className={`shrink-0 px-3 py-1.5 rounded-full text-[9px] font-black capitalize tracking-widest border ${status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    {status}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col p-4 rounded-xl bg-primary/5 border border-primary/5">
                    <span className="text-[10px] font-black text-primary/40 capitalize tracking-widest mb-1.5 leading-none">Qualifying tasks</span>
                    <div className="text-2xl font-black text-foreground font-heading leading-none mt-1">
                        {formatCompactNumber(data.qualifying_tasks)}
                    </div>
                </div>
                <div className="flex flex-col p-4 rounded-xl bg-primary/5 border border-primary/5">
                    <span className="text-[10px] font-black text-primary/40 capitalize tracking-widest mb-1.5 leading-none">Model version</span>
                    <div className="text-2xl font-black text-foreground font-heading leading-none mt-1 truncate">
                        {data.workflow_version || "V.1.0"}
                    </div>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-primary/5 flex items-center justify-between">
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--sidebar-primary)]" />
                   <span className="text-[9px] font-black text-primary/60 uppercase">Sync</span>
               </div>
               <div className="scale-100 origin-right transition-transform hover:scale-105 active:scale-95">
                    <WorkflowDetailDialog data={data} />
               </div>
            </div>
        </motion.div>
    );
};

export default Workflow;

