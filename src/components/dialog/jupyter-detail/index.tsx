import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { JupyterWorkspaceRecord } from "@/types/details_type";
import {
    Cpu,
    Database,
    User,
    Calendar,
    Terminal,
    Laptop,
} from "lucide-react";
import { useState } from "react";

export function JupyterDetailDialog({
    data,
}: Readonly<{ data: JupyterWorkspaceRecord }>) {
    const [open, setOpen] = useState(false);

    const createdDate = new Date(data.created_date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const specs = [
        { label: "Core Allocation", value: `${data.cpu_cores} vCPU`, icon: <Cpu size={16} /> },
        { label: "Memory Allocation", value: `${data.memory} GB`, icon: <Database size={16} /> },
    ];

    const fields = [
        { label: "Custodian", value: data.owner, icon: <User size={14} /> },
        { label: "Cluster ID", value: data.workspace_id, icon: <div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> },
        { label: "Created On", value: createdDate, icon: <Calendar size={14} /> },
        { label: "Subsystem", value: "JupyterLab 4.0", icon: <Terminal size={14} /> },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="inline-flex cursor-pointer items-center px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:underline active:scale-95">
                    View Specs
                </div>
            </DialogTrigger>

            <DialogContent className="flex max-h-[85vh] w-[96vw] max-w-[96vw] sm:max-w-xl lg:max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-primary/10 bg-[#fafafa] p-0 shadow-2xl">
                <DialogHeader className="shrink-0 bg-white px-8 py-8 border-b border-primary/5 relative">
                    <div className="flex items-center justify-between gap-6">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-primary/5 border border-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                                    Environment Specs
                                </span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                            <DialogTitle className="truncate text-2xl font-black font-heading tracking-tight text-foreground capitalize leading-tight">
                                {data.name || "Jupyter Environment"}
                            </DialogTitle>
                            <p className="mt-2 text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">Matrix Instance: <span className="text-primary/60">{data.workspace_id}</span></p>
                        </div>
                        <div className="shrink-0 w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                            <Laptop size={32} />
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {specs.map((spec) => (
                                <div key={spec.label} className="p-6 rounded-2xl bg-white border border-primary/5 hover:border-primary/20 transition-all group shadow-sm">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-primary/30 uppercase tracking-widest mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            {spec.icon}
                                        </div>
                                        {spec.label}
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-foreground">{spec.value.split(' ')[0]}</span>
                                        <span className="text-[11px] font-black text-primary/40 uppercase tracking-widest">{spec.value.split(' ')[1]}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl border border-primary/5 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 bg-primary/5 border-b border-primary/5 flex items-center justify-between">
                                <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">Operational Parameters</span>
                            </div>
                            <div className="divide-y divide-primary/5">
                                {fields.map(({ label, value, icon }) => (
                                    <div key={label} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-primary/5 transition-colors group">
                                        <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.1em] text-primary/40 group-hover:text-primary transition-colors">
                                            <div className="w-5 flex justify-center">{icon}</div>
                                            {label}
                                        </div>
                                        <span className="text-right text-[12px] font-black text-foreground truncate max-w-[240px]">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                 </div>

                <div className="shrink-0 bg-white border-t border-primary/5 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Protocol Secured</span>
                    </div>
                    <DialogClose asChild>
                        <button className="px-10 py-3.5 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg active:scale-95">
                            Close Console
                        </button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog >
    );
}
