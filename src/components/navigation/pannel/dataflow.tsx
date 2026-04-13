import { DataflowDetailDialog } from "@/components/dialog/dataflow-detail";
import type { DataflowRecord } from "@/types/details_type";
import { Activity } from "lucide-react";

const Dataflow = ({
    data,
    status,
}: {
    data: DataflowRecord;
    status: "active" | "inactive";
}) => {
    const lastRunLabel = data.last_executed_date
        ? new Date(data.last_executed_date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : "Pending";

    return (
        <div className="group w-full bg-white rounded-xl p-6 transition-all duration-300 hover:bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between gap-5">
                <div className="flex gap-5 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <Activity size={24} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-black text-foreground font-heading truncate leading-tight capitalize">
                            {data.display_name || "System dataflow"}
                        </h3>
                        <div className="flex items-center gap-2.5 mt-3">
                            <span className="text-[10px] font-black text-primary/30 capitalize tracking-widest whitespace-nowrap">Last sync</span>
                            <span className="text-[11px] font-black text-primary tracking-tight transition-colors">{lastRunLabel}</span>
                        </div>
                    </div>
                </div>

                <div className={`
                    px-3 py-1.5 rounded-full text-[9px] font-black capitalize tracking-widest border
                    ${status === 'active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-primary/5 text-primary/40 border-primary/10'}
                `}>
                    {status}
                </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-primary/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-primary/30 capitalize tracking-[0.2em]">Execution secure</span>
                </div>
                <div className="scale-100 origin-right">
                    <DataflowDetailDialog data={data} />
                </div>
            </div>
        </div>
    );
};

export default Dataflow;
