import type { JupyterWorkspaceRecord } from "@/types/details_type";
import { Cpu } from "lucide-react";
import { JupyterDetailDialog } from "@/components/dialog/jupyter-detail";
import jupyterIcon from "@/components/helpers/assets/jupyter.png";

const JupyterWorkflows = ({ data }: { data: JupyterWorkspaceRecord }) => {
    return (
        <div className="group w-full bg-white rounded-xl p-6 transition-all duration-300 hover:bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between gap-5">
                <div className="flex gap-5 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary transition-all shadow-sm overflow-hidden p-3">
                        <img
                            src={jupyterIcon}
                            alt="Jupyter"
                            className="w-full h-full object-contain group-hover:brightness-0 group-hover:invert transition-all"
                        />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-black text-foreground font-heading truncate leading-tight capitalize">
                            {data.name || "Jupyter environment"}
                        </h3>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/5">
                                <Cpu size={12} className="text-primary/60" />
                                <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{data.cpu_cores} vCPU</span>
                                <div className="w-1 h-1 rounded-full bg-primary/20" />
                                <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{data.memory}GB RAM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100">
                    Active
                </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-primary/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-primary/30 capitalize tracking-[0.2em]">Environment ready</span>
                </div>
                <div className="flex items-center gap-3 scale-100 origin-right">
                    <JupyterDetailDialog data={data} />
                    <button
                        onClick={() => {
                            const domoUrl = "https://gwcteq-partner.domo.com";
                            const workspaceId = String(data.workspace_id || "").trim();
                            if (workspaceId) {
                                globalThis.window.open(`${domoUrl}/jupyter/workspaces/${encodeURIComponent(workspaceId)}`, "_blank", "noopener,noreferrer");
                            }
                        }}
                        className="px-4 py-1.5 bg-primary text-white text-[10px] font-black capitalize tracking-widest rounded-lg transition-all shadow-md hover:shadow-primary/20 active:scale-95"
                    >
                        Launch Studio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JupyterWorkflows;


