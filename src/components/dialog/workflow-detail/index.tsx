import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { WorkflowRecord } from "@/types/details_type";
import {
    Activity,
    User,
    Clock,
    Calendar,
    Settings,
    Shield,
    Terminal,
} from "lucide-react";
import { useState } from "react";

export function WorkflowDetailDialog({
    data,
}: Readonly<{ data: WorkflowRecord }>) {
    const [open, setOpen] = useState(false);

    const startTime = new Date(data.start_time).toLocaleString();
    const updatedTime = data.updated_on ? new Date(data.updated_on).toLocaleString() : "N/A";
    const endTime = data.end_time ? new Date(data.end_time).toLocaleString() : "Running/Aborted";

    const fields = [
        { label: "Architecture", value: data.workflow_version, icon: <Shield size={12} className="text-primary" /> },
        { label: "Custodian", value: data.owner, icon: <User size={12} className="text-primary" /> },
        { label: "Operational State", value: data.workflow_status, icon: <Activity size={12} className="text-primary" /> },
        { label: "Trigger Protocol", value: data.trigger_type || "Direct Request", icon: <Terminal size={12} className="text-primary" /> },
        { label: "Initialization", value: startTime, icon: <Clock size={12} className="text-primary" /> },
        { label: "Termination", value: endTime, icon: <Clock size={12} className="text-primary" /> },
        { label: "Registry Sync", value: updatedTime, icon: <Calendar size={12} className="text-primary" /> },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="inline-flex cursor-pointer items-center px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-primary transition-all hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/10">
                    View Details
                </div>
            </DialogTrigger>

            <DialogContent className="flex max-h-[90vh] w-[96vw] max-w-[96vw] sm:max-w-xl lg:max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-primary/10 bg-white p-0 shadow-2xl">
                <DialogHeader className="shrink-0 border-b border-primary/5 bg-white px-10 py-8 relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 gwc-gradient" />
                    <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0">
                            <DialogTitle className="truncate text-2xl font-black font-heading tracking-tight text-foreground capitalize">
                                {data.workflow_name || "System workflow"}
                            </DialogTitle>
                            <div className="mt-3 text-[10px] font-black text-primary/40 uppercase tracking-[0.25em] flex items-center gap-2.5">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(111,43,139,0.4)]" />
                               Protocol: <span className="font-mono text-primary/60">{data.execution_id}</span>
                            </div>
                        </div>
                        <div className="shrink-0 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 text-center">
                            <span className="text-[9px] font-black text-primary/30 uppercase tracking-widest block mb-0.5">Tasks</span>
                            <span className="text-xl font-black text-primary leading-none">{data.qualifying_tasks ?? 0}</span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-[1.8rem] bg-primary/5 border border-primary/5 hover:border-primary/20 transition-all group">
                                <span className="text-[9px] font-black text-primary/30 uppercase tracking-widest block mb-2">Intelligence ID</span>
                                <span className="text-[13px] font-bold text-foreground font-mono truncate block group-hover:text-primary transition-colors">{data.model_id}</span>
                            </div>
                            <div className="p-5 rounded-[1.8rem] bg-secondary/10 border border-primary/5 hover:border-primary/20 transition-all group">
                                <span className="text-[9px] font-black text-primary/30 uppercase tracking-widest block mb-2">Cycle Efficiency</span>
                                <span className="text-[13px] font-bold text-foreground block group-hover:text-primary transition-colors">{data.cycle_time ? `${data.cycle_time}ms` : "Optimized Linear"}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-primary/5 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 bg-secondary/5 border-b border-primary/5 flex items-center justify-between">
                                <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Logic Registry</span>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 rounded-full bg-primary/20" />
                                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                                    <div className="w-1 h-1 rounded-full bg-primary/60" />
                                </div>
                            </div>
                            <div className="divide-y divide-primary/5">
                                {fields.map(({ label, value, icon }) => (
                                    <div key={label} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-primary/[0.02] transition-colors group">
                                        <div className="flex items-center gap-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 group-hover:text-primary/60 transition-colors">
                                            <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary/30 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                {icon}
                                            </div>
                                            {label}
                                        </div>
                                        <span className="text-right text-[12.5px] font-black text-foreground/80 truncate max-w-[240px]">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transition-transform group-hover:rotate-0">
                                <Settings size={48} className="text-primary" />
                            </div>
                            <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary/60 mb-4">
                                <Settings size={14} className="animate-spin-slow" />
                                Runtime Profile
                            </h4>
                            <p className="text-[12px] font-medium text-foreground/60 leading-relaxed italic z-10 relative">
                                Optimized for {data.workflow_version} neural architecture. Triggered via <span className="text-primary font-bold">{data.trigger_name || "Enterprise Hub"}</span> using {data.trigger_type || "Internal"} state machine.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 border-t border-primary/5 bg-secondary/5 px-10 py-6 flex justify-end">
                    <DialogClose asChild>
                        <button className="px-12 py-3.5 rounded-full bg-white border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.25em] hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95">
                            Close Logic Monitor
                        </button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog >
    );
}

