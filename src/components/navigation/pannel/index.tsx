import { DetailsContext } from "@/context/detailsContext";
import type { DataflowRecord, DatasetRecord, JupyterWorkspaceRecord, unionDetailsType, WorkflowRecord } from "@/types/details_type";
import JupyterWorkflows from "./jupyter_workspace";
import Workflow from "./workflow";
import type { Node } from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useMemo, useState } from "react";
import { DatasetDetailDialog } from "@/components/dialog/dataset-detail";
import Loader2 from "@/components/utils/loader_2";
import Dataflow from "./dataflow";

interface UserNodeData extends Record<string, unknown> {
    label: string;
    description?: string;
    value?: string;
    activeCount?: number;
    inactiveCount?: number;
    side?: "left" | "right";
}

const CustomPanel = ({
    selectedNode,
    setSelectedNodeId,
    userId
}: {
    selectedNode?: Node<UserNodeData>;
    setSelectedNodeId: (id: string | null) => void;
    userId: string;
}) => {
    const [selectedOption, setSelectedOption] = useState<"active" | "inactive" | null>(null);

    const nodeLabel = String(selectedNode?.data.label ?? "");
    const lowerNodeLabel = nodeLabel.toLowerCase();
    const isWorkflowOrDataflow = useMemo(() => {
        return lowerNodeLabel.includes("workflow") || lowerNodeLabel.includes("dataflow");
    }, [lowerNodeLabel]);

    const [domoData, setDomoData] = useState<unionDetailsType[] | null>(null);

    const detail = useContext(DetailsContext);
    const fetchDataset = detail?.fetchDataset;
    const fetchDataflow = detail?.fetchDataflow;
    const fetchWorkflow = detail?.fetchWorkflow;
    const fetchJupyterWorkspace = detail?.fetchJupyterWorkspace;

    useEffect(() => {
        setSelectedOption(null);
    }, [selectedNode?.id]);

    useEffect(() => {
        if (!selectedNode || !userId) {
            setDomoData(null);
            return;
        }

        if (isWorkflowOrDataflow && !selectedOption) {
            setDomoData(null);
            return;
        }

        let cancelled = false;
        const normalized = String(selectedNode.data.label ?? "").toLowerCase();

        const loadDetails = async () => {
            try {
                let rows: unionDetailsType[] = [];

                if (normalized.includes("dataset")) {
                    if (!fetchDataset) return;
                    rows = await fetchDataset(userId);
                } else if (normalized.includes("dataflow")) {
                    if (!fetchDataflow) return;
                    rows = await fetchDataflow(userId, selectedOption ?? undefined);
                } else if (normalized.includes("workflow")) {
                    if (!fetchWorkflow) return;
                    rows = await fetchWorkflow(userId, selectedOption ?? undefined);
                } else if (normalized.includes("jupyter")) {
                    if (!fetchJupyterWorkspace) return;
                    rows = await fetchJupyterWorkspace(userId);
                }

                if (!cancelled) {
                    setDomoData(rows);
                }
            } catch (error) {
                if (!cancelled) {
                    setDomoData(null);
                }
            }
        };

        loadDetails();
        return () => { cancelled = true; };
    }, [userId, selectedNode?.id, selectedNode?.data.label, selectedOption, isWorkflowOrDataflow, fetchDataset, fetchDataflow, fetchWorkflow, fetchJupyterWorkspace]);

    if (detail?.loading) {
        return (
            <aside className="w-full md:w-[400px] h-full glass-console border-r md:border-l border-primary/10 flex flex-col p-6 overflow-y-auto scrollbar-hide z-[200]">
                <Loader2 />
            </aside>
        )
    }

    return (
        <AnimatePresence mode="wait">
            {selectedNode ? (
                <motion.aside
                    key={selectedNode.id}
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-full md:w-[450px] lg:w-[480px] max-h-[78vh] bg-white border-r md:border-l border-primary/10 flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] z-[200] relative overflow-hidden rounded-xl"
                >
                    <div className="pt-4 px-6 pb-14 flex-1 overflow-y-auto custom-scrollbar bg-white">
                        <div className="flex items-start justify-between gap-6 mb-4">
                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-foreground font-heading tracking-tight leading-none capitalize">
                                    {selectedNode.data.value ? `${selectedNode.data.value} ` : ""}{selectedNode.data.label}
                                </h2>
                                <p className="text-[10px] font-black text-primary/50 capitalize tracking-[0.2em] mt-2 px-3 py-1 bg-primary/5 rounded-full inline-block border border-primary/5">Node intelligence index</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedNodeId(null)}
                                className="w-10 h-10 rounded-2xl bg-primary/5 text-primary hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center font-bold text-xl shadow-sm border border-primary/5"
                                aria-label="Close details panel"
                            >
                                &times;
                            </button>
                        </div>

                        {isWorkflowOrDataflow && (selectedNode.data.activeCount !== undefined || selectedNode.data.inactiveCount !== undefined) && (
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <motion.div
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedOption("active")}
                                    className={`text-center p-5 rounded-[1.8rem] cursor-pointer border-2 transition-all shadow-md group ${selectedOption === "active" ? "bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-100" : "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50"}`}
                                >
                                    <span className="text-[10px] font-black capitalize tracking-widest block mb-1 opacity-80 group-hover:opacity-100">Live system</span>
                                    <div className="text-3xl font-black font-heading leading-tight">{selectedNode.data.activeCount ?? 0}</div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedOption("inactive")}
                                    className={`text-center p-5 rounded-[1.8rem] cursor-pointer border-2 transition-all shadow-md group ${selectedOption === "inactive" ? "bg-rose-500 text-white border-rose-500 shadow-xl shadow-rose-100" : "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100/50"}`}
                                >
                                    <span className="text-[10px] font-black capitalize tracking-widest block mb-1 opacity-80 group-hover:opacity-100">Dormant</span>
                                    <div className="text-3xl font-black font-heading leading-tight">{selectedNode.data.inactiveCount ?? 0}</div>
                                </motion.div>
                            </div>
                        )}

                        {isWorkflowOrDataflow && (
                            <div className="mb-4">
                                <div className="h-px w-24 bg-primary/20 mb-4" />
                                <p className="text-[10px] font-bold text-muted-foreground capitalize tracking-widest leading-relaxed">
                                    Synchronization logic: <span className="text-primary italic">Select node protocol</span> above to reveal internal metrics.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {isWorkflowOrDataflow && lowerNodeLabel.includes("workflow") && selectedOption && domoData && (
                                <div className="flex flex-col gap-3">
                                    {domoData.map((record, index) => (
                                        <Workflow key={index} data={record as WorkflowRecord} status={selectedOption} />
                                    ))}
                                </div>
                            )}

                            {isWorkflowOrDataflow && lowerNodeLabel.includes("dataflow") && selectedOption && domoData && (
                                <div className="flex flex-col gap-3">
                                    {domoData.map((record, index) => (
                                        <Dataflow key={index} data={record as DataflowRecord} status={selectedOption} />
                                    ))}
                                </div>
                            )}

                            {!isWorkflowOrDataflow && (
                                <div className="bg-primary/5 p-6 rounded-[1.8rem] border border-primary/10 mb-6 text-center shadow-inner">
                                    <p className="text-[11px] font-black text-primary capitalize tracking-[0.15em] leading-relaxed opacity-80">
                                        Intelligence core relay: <br />
                                        <span className="text-[9px] opacity-60">This cluster node is monitored directly for peak operational capacity.</span>
                                    </p>
                                </div>
                            )}

                            {!isWorkflowOrDataflow && lowerNodeLabel.includes("dataset") && domoData && (
                                <div className="flex flex-col gap-3">
                                    {domoData.map((record, index) => (
                                        <DatasetDetailDialog key={index} data={record as DatasetRecord} />
                                    ))}
                                </div>
                            )}

                            {!isWorkflowOrDataflow && lowerNodeLabel.includes("jupyter") && domoData && (
                                <div className="flex flex-col gap-3">
                                    {domoData.map((record, index) => (
                                        <JupyterWorkflows key={index} data={record as JupyterWorkspaceRecord} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.aside>
            ) : null}
        </AnimatePresence>
    )
}

export default CustomPanel
