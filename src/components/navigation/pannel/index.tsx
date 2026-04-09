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
                    if (!fetchDataset) {
                        return;
                    }
                    rows = await fetchDataset(userId);
                } else if (normalized.includes("dataflow")) {
                    if (!fetchDataflow) {
                        return;
                    }
                    rows = await fetchDataflow(userId, selectedOption ?? undefined);
                } else if (normalized.includes("workflow")) {
                    if (!fetchWorkflow) {
                        return;
                    }
                    rows = await fetchWorkflow(userId, selectedOption ?? undefined);
                } else if (normalized.includes("jupyter")) {
                    if (!fetchJupyterWorkspace) {
                        return;
                    }
                    rows = await fetchJupyterWorkspace(userId);
                }

                if (!cancelled) {
                    setDomoData(rows);
                    console.log("Panel details fetched:", rows);
                }
            } catch (error) {
                if (!cancelled) {
                    setDomoData(null);
                }
                console.error("Error loading panel details:", error);
            }
        };

        loadDetails();

        return () => {
            cancelled = true;
        };
    }, [
        userId,
        selectedNode?.id,
        selectedNode?.data.label,
        selectedOption,
        isWorkflowOrDataflow,
        fetchDataset,
        fetchDataflow,
        fetchWorkflow,
        fetchJupyterWorkspace,
    ]);

    if (detail?.loading) {
        return (
            <aside
                style={{
                    width: 360,
                    height: "100vh",
                    borderRadius: 0,
                    background: "rgba(255, 255, 255, 0.92)",
                    borderLeft: "1px solid rgba(112, 48, 177, 0.16)",
                    boxShadow: "-18px 0 50px rgba(15, 23, 42, 0.10)",
                    padding: "24px 20px",
                    backdropFilter: "blur(14px)",
                    color: "#0f172a",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                } as React.CSSProperties}
                className="[&::-webkit-scrollbar]:hidden"
            >
                <Loader2 />
            </aside>
        )
    }

    return (
        <AnimatePresence mode="wait">
            {selectedNode ? (
                <motion.aside
                    key={selectedNode.id}
                    initial={{ x: -28, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -28, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.7 }}
                    style={{
                        width: 360,
                        height: "100vh",
                        borderRadius: 0,
                        background: "rgba(255, 255, 255, 0.92)",
                        borderLeft: "1px solid rgba(112, 48, 177, 0.16)",
                        boxShadow: "-18px 0 50px rgba(15, 23, 42, 0.10)",
                        padding: "24px 20px",
                        backdropFilter: "blur(14px)",
                        color: "#0f172a",
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    } as React.CSSProperties}
                    className="[&::-webkit-scrollbar]:hidden"
                >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ marginTop: 6, lineHeight: 1.2 }} className="font-semibold text-gray-700 text-xl">
                            {selectedNode.data.value}{" "}{selectedNode.data.label}
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedNodeId(null)}
                            style={{
                                border: "none",
                                background: "rgba(112, 48, 177, 0.1)",
                                color: "#7030B1",
                                width: 30,
                                height: 30,
                                borderRadius: 999,
                                cursor: "pointer",
                                fontSize: 16,
                                fontWeight: 700,
                            }}
                            aria-label="Close details panel"
                        >
                            &times;
                        </button>
                    </div>

                    {isWorkflowOrDataflow && (selectedNode.data.activeCount !== undefined || selectedNode.data.inactiveCount !== undefined) && (
                        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                            <motion.div
                                whileHover={{ y: -4, scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 360, damping: 20 }}
                                onClick={() => setSelectedOption("active")}
                                className={`text-center text-green-600 font-bold bg-green-50 px-2 py-3 rounded-md cursor-pointer border transition-all ${selectedOption === "active" ? "border-green-500 shadow-md shadow-green-100" : "border-transparent"}`}
                            >
                                Active
                                <div style={{ marginTop: 4, fontSize: 18, lineHeight: 1 }}>{selectedNode.data.activeCount ?? 0}</div>
                            </motion.div>
                            <motion.div
                                whileHover={{ y: -4, scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 360, damping: 20 }}
                                onClick={() => setSelectedOption("inactive")}
                                className={`text-center text-red-600 font-bold bg-red-50 px-2 py-3 rounded-md cursor-pointer border transition-all ${selectedOption === "inactive" ? "border-red-500 shadow-md shadow-red-100" : "border-transparent"}`}
                            >
                                Inactive
                                <div style={{ marginTop: 4, fontSize: 18, lineHeight: 1 }}>{selectedNode.data.inactiveCount ?? 0}</div>
                            </motion.div>
                        </div>
                    )}

                    {isWorkflowOrDataflow && (
                        <>
                            <div style={{ marginTop: 14, height: 1, background: "rgba(15, 23, 42, 0.12)" }} />
                            <p style={{ marginTop: 10, fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
                                Select an option to see {lowerNodeLabel.includes("dataflow") ? "dataflow" : "workflow"} details.
                            </p>
                        </>
                    )}

                    {isWorkflowOrDataflow && lowerNodeLabel.includes("workflow") && selectedOption && domoData && (
                        <div style={{ marginTop: 14 }}>
                            {domoData.map((record, index) => (
                                <Workflow key={index} data={record as WorkflowRecord} status={selectedOption} />
                            ))}
                        </div>
                    )}

                    {isWorkflowOrDataflow && lowerNodeLabel.includes("dataflow") && selectedOption && domoData && (
                        <div style={{ marginTop: 14 }} className="flex flex-col gap-2">
                            {domoData.map((record, index) => (
                                <Dataflow key={index} data={record as DataflowRecord} status={selectedOption} />
                            ))}
                        </div>
                    )}

                    {!isWorkflowOrDataflow && (
                        <p style={{ marginTop: 12, fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
                            This metric is shown directly for quick review.
                        </p>
                    )}

                    {!isWorkflowOrDataflow && lowerNodeLabel.includes("dataset") && domoData && (
                        <div style={{ marginTop: 14 }} className="flex flex-col gap-2">
                            {domoData.map((record, index) => (
                                <DatasetDetailDialog key={index} data={record as DatasetRecord} />
                            ))}
                        </div>
                    )}

                    {!isWorkflowOrDataflow && lowerNodeLabel.includes("jupyter") && domoData && (
                        <div style={{ marginTop: 14 }}>
                            {domoData.map((record, index) => (
                                <JupyterWorkflows key={index} data={record as JupyterWorkspaceRecord} />
                            ))}
                        </div>
                    )}
                </motion.aside>
            ) : null}
        </AnimatePresence>
    )
}

export default CustomPanel

