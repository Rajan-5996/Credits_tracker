import etlImage from "@/assets/ETL.png";
import { nodeTypes as cardsNodeTypes } from "@/components/custom_node/cards_node/root_node";
import { DataflowLineageContext } from "@/context/dataflow_lineage";
import type { DomoResponse } from "@/hooks/useDashboard";
import domo from "ryuu.js";
import { AlertCircle, GitBranch, Loader2, Maximize2, Minimize2 } from "lucide-react";
import {
    BaseEdge,
    Handle,
    Position,
    Panel,
    ReactFlow,
    getBezierPath,
    type Edge,
    type EdgeProps,
    type Node,
} from "@xyflow/react";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type LineageProps = {
    dataflowId: number;
    isActive: boolean;
};

type DatasetInfo = {
    id: string;
    name: string;
};

const ETLEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
}: EdgeProps) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <BaseEdge
            id={id}
            path={edgePath}
            markerEnd={markerEnd}
            style={{ stroke: "#cbd5e1", strokeWidth: 1.5, strokeDasharray: "6 3" }}
        />
    );
};

const edgeTypes = {
    etlEdge: ETLEdge,
};

const normalizeIds = (rows: any[][]): string[] => {
    return (rows ?? [])
        .map((row) => String(row?.[0] ?? "").trim())
        .filter((id) => id.length > 0);
};

const fetchDatasetNames = async (ids: string[]): Promise<DatasetInfo[]> => {
    if (ids.length === 0) {
        return [];
    }

    const uniqueIds = Array.from(new Set(ids));
    const sqlIds = uniqueIds
        .map((id) => `'${id.replace(/'/g, "''")}'`)
        .join(",");

    const response = (await domo.post(
        "/sql/v1/datasets",
        `
            SELECT ID, Name
            FROM datasets
            WHERE ID IN (${sqlIds})
        `,
        { contentType: "text/plain" }
    )) as DomoResponse;

    return (response?.rows ?? []).map((row: any[]) => ({
        id: String(row[0]),
        name: String(row[1] ?? `Dataset ${row[0]}`),
    }));
};

const Lineage = ({ dataflowId, isActive }: LineageProps) => {
    const dataflow = useContext(DataflowLineageContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputDatasets, setInputDatasets] = useState<DatasetInfo[]>([]);
    const [outputDatasets, setOutputDatasets] = useState<DatasetInfo[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = useCallback(async () => {
        if (!containerRef.current) return;

        try {
            if (!document.fullscreenElement) {
                const elem = containerRef.current as any;
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    await elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    await elem.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if ((document as any).webkitExitFullscreen) {
                    await (document as any).webkitExitFullscreen();
                } else if ((document as any).msExitFullscreen) {
                    await (document as any).msExitFullscreen();
                }
            }
        } catch (err) {
            console.error("Fullscreen toggle failed:", err);
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
            document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        const lineageContext = dataflow;

        if (!isActive || !lineageContext || !Number.isFinite(dataflowId)) {
            return;
        }

        const safeLineageContext = lineageContext;

        let isCancelled = false;

        async function loadLineage() {
            setLoading(true);
            setError(null);

            try {
                const lineage = await safeLineageContext.getLineageData(dataflowId);
                const inputIds = normalizeIds(lineage?.inputDatasets?.rows ?? []);
                const outputIds = normalizeIds(lineage?.outputDatasets?.rows ?? []);

                const [inputs, outputs] = await Promise.all([
                    fetchDatasetNames(inputIds),
                    fetchDatasetNames(outputIds),
                ]);

                if (!isCancelled) {
                    setInputDatasets(inputs);
                    setOutputDatasets(outputs);
                }
            } catch (err) {
                if (!isCancelled) {
                    setError("Unable to load lineage data.");
                    setInputDatasets([]);
                    setOutputDatasets([]);
                }
                console.error("Failed to load lineage", err);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }

        loadLineage();

        return () => {
            isCancelled = true;
        };
    }, [dataflow, dataflowId, isActive]);

    const { nodes, edges } = useMemo(() => {
        const leftX = 40;
        const centerX = 320;
        const rightX = 600;
        const baseY = 30;
        const rowHeight = 115;

        const rootNodes: Node[] = inputDatasets.map((dataset, index) => ({
            id: `input-${dataset.id}`,
            type: "cardsNode",
            position: { x: leftX, y: baseY + index * rowHeight },
            data: {
                title: dataset.name,
                subtitle: "Input Dataset",
            },
            draggable: false,
            selectable: true,
        }));

        const totalInputHeight = (inputDatasets.length - 1) * rowHeight;
        const centerY = baseY + totalInputHeight / 2;

        const hubNode: Node = {
            id: "hub",
            type: "default",
            position: { x: centerX, y: centerY },
            data: { label: "" },
            draggable: false,
            selectable: false,
            style: {
                width: 58,
                height: 58,
                borderRadius: "50%",
                border: "2px solid #e2e8f0",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                padding: 0,
                overflow: "visible",
            },
        };

        const hubNodeWithImage = {
            ...hubNode,
            data: {
                label: (
                    <div style={{ width: "100%", height: "100%", position: "relative" }}>
                        <img
                            src={etlImage}
                            alt="ETL"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />
                        <Handle type="source" id="hub-right" position={Position.Right}
                            style={{ background: "#94a3b8", width: 8, height: 8, border: "2px solid #fff", borderRadius: "50%", right: -5 }}
                        />
                        <Handle type="target" id="hub-left" position={Position.Left}
                            style={{ background: "#94a3b8", width: 8, height: 8, border: "2px solid #fff", borderRadius: "50%", left: -5 }}
                        />
                    </div>
                ),
            },
        };

        const totalOutputHeight = outputDatasets.length > 1 ? (outputDatasets.length - 1) * rowHeight : 0;
        const outputStartY = centerY - totalOutputHeight / 2;

        const childNodes: Node[] = outputDatasets.map((dataset, index) => ({
            id: `output-${dataset.id}`,
            type: "cardschildNode",
            position: { x: rightX, y: outputStartY + index * rowHeight },
            data: {
                title: dataset.name,
                subtitle: "Output Dataset",
                hideSource: true,
            },
            draggable: false,
            selectable: true,
        }));

        const inputToHubEdges: Edge[] = inputDatasets.map((input) => ({
            id: `edge-${input.id}-hub`,
            source: `input-${input.id}`,
            target: "hub",
            targetHandle: "hub-left",
            type: "etlEdge",
            animated: true,
        }));

        const hubToOutputEdges: Edge[] = outputDatasets.map((output) => ({
            id: `edge-hub-${output.id}`,
            source: "hub",
            sourceHandle: "hub-right",
            target: `output-${output.id}`,
            type: "etlEdge",
            animated: true,
        }));

        return {
            nodes: [...rootNodes, hubNodeWithImage, ...childNodes],
            edges: [...inputToHubEdges, ...hubToOutputEdges],
        };
    }, [inputDatasets, outputDatasets]);

    if (loading) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/20 bg-secondary/20">
                <Loader2 size={18} className="animate-spin text-primary/60" />
                <p className="text-[13px] font-semibold text-foreground/65">Loading lineage</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-destructive/25 bg-destructive/5">
                <AlertCircle size={18} className="text-destructive/70" />
                <p className="text-[13px] font-semibold text-destructive/90">{error}</p>
            </div>
        );
    }

    if (nodes.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/20 bg-secondary/20">
                <GitBranch size={18} className="text-primary/35" />
                <p className="text-[13px] font-semibold text-foreground/65">No lineage found</p>
                <p className="max-w-64 text-center text-[11.5px] leading-relaxed text-muted-foreground">
                    This dataflow does not have input/output dataset lineage yet.
                </p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="h-105 w-full rounded-sm border border-gray-300 bg-white relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={cardsNodeTypes}
                edgeTypes={edgeTypes}
                fitView
                fitViewOptions={{ padding: 0.25 }}
                minZoom={0.35}
                maxZoom={1.5}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable
                proOptions={{ hideAttribution: true }}
            >
                <Panel position="top-right">
                    <button
                        onClick={toggleFullscreen}
                        style={{
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "4px",
                            padding: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                            transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f8f9fa"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 size={14} color="#64748b" /> : <Maximize2 size={14} color="#64748b" />}
                    </button>
                </Panel>
            </ReactFlow>
        </div>
    );
};

export default Lineage;