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
    MarkerType,
    type Edge,
    type EdgeProps,
    type Node,
    ReactFlowProvider,
} from "@xyflow/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

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
            style={{ stroke: "#94a3b8", strokeWidth: 2, opacity: 0.6 }}
        />
    );
};

const HubNode = ({ data }: { data: { label: string } }) => {
    return (
        <div className="relative w-20 h-20 rounded-[1.75rem] border-2 border-primary/10 bg-white flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(111,43,139,0.15)] group transition-all">
            <div className="absolute inset-0 bg-primary/5 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
                src={etlImage}
                alt="ETL"
                className="w-11 h-11 rounded-xl object-contain relative z-10"
            />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl whitespace-nowrap border border-white/20 z-20">
                {data.label}
            </div>
            
            <Handle 
                type="target" 
                id="hub-left" 
                position={Position.Left} 
                className="!w-3 !h-3 !bg-primary !border-2 !border-white !-left-1.5 shadow-md hover:scale-125 transition-transform" 
            />
            <Handle 
                type="source" 
                id="hub-right" 
                position={Position.Right} 
                className="!w-3 !h-3 !bg-primary !border-2 !border-white !-right-1.5 shadow-md hover:scale-125 transition-transform" 
            />
        </div>
    );
};

const lineageNodeTypes = {
    ...cardsNodeTypes,
    hubNode: HubNode,
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

const LineageInner = ({ dataflowId, isActive }: LineageProps) => {
    const dataflow = useContext(DataflowLineageContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputDatasets, setInputDatasets] = useState<DatasetInfo[]>([]);
    const [outputDatasets, setOutputDatasets] = useState<DatasetInfo[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useRef<any>(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFS = () => {
            const isFull = !!document.fullscreenElement;
            setIsFullscreen(isFull);
            if (reactFlowInstance.current) {
                setTimeout(() => {
                    reactFlowInstance.current.fitView({ padding: 0.15, duration: 500 });
                }, 100);
            }
        }
        document.addEventListener('fullscreenchange', handleFS);
        return () => document.removeEventListener('fullscreenchange', handleFS);
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
        const leftX = 0;
        const centerX = 420;
        const rightX = 840;
        const baseY = 50;
        const rowHeight = 220; // Increased significantly to prevent overlap

        const rootNodes: Node[] = inputDatasets.map((dataset, index) => ({
            id: `input-${dataset.id}`,
            type: "cardsNode",
            position: { x: leftX, y: baseY + index * rowHeight },
            data: {
                title: dataset.name,
                subtitle: "Source data cluster",
            },
            draggable: false,
            selectable: true,
        }));

        const totalInputHeight = Math.max(0, (inputDatasets.length - 1) * rowHeight);
        const centerY = baseY + totalInputHeight / 2;

        const hubNodeWithImage: Node = {
            id: "hub",
            type: "hubNode",
            position: { x: centerX, y: centerY },
            draggable: false,
            selectable: false,
            data: {
                label: "Logic Hub"
            },
        };

        const totalOutputHeight = Math.max(0, (outputDatasets.length - 1) * rowHeight);
        const outputStartY = centerY - totalOutputHeight / 2;

        const childNodes: Node[] = outputDatasets.map((dataset, index) => ({
            id: `output-${dataset.id}`,
            type: "cardschildNode",
            position: { x: rightX, y: outputStartY + index * rowHeight },
            data: {
                title: dataset.name,
                subtitle: "Destination archive",
                hideSource: true,
            },
            draggable: false,
            selectable: true,
        }));

        const markerEnd = { type: MarkerType.ArrowClosed, color: "#94a3b8" };

        const inputToHubEdges: Edge[] = inputDatasets.map((input) => ({
            id: `edge-${input.id}-hub`,
            source: `input-${input.id}`,
            sourceHandle: "source-right",
            target: "hub",
            targetHandle: "hub-left",
            type: "etlEdge",
            animated: true,
            markerEnd,
        }));

        const hubToOutputEdges: Edge[] = outputDatasets.map((output) => ({
            id: `edge-hub-${output.id}`,
            source: "hub",
            sourceHandle: "hub-right",
            target: `output-${output.id}`,
            targetHandle: "target-left",
            type: "etlEdge",
            animated: true,
            markerEnd,
        }));

        return {
            nodes: [...rootNodes, hubNodeWithImage, ...childNodes],
            edges: [...inputToHubEdges, ...hubToOutputEdges],
        };
    }, [inputDatasets, outputDatasets]);


    if (loading) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/20 bg-primary/5">
                <Loader2 size={24} className="animate-spin text-primary/60" />
                <p className="text-[11px] font-black text-primary/40 uppercase tracking-[0.2em]">Matrix synchronized...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-destructive/25 bg-rose-50/50">
                <AlertCircle size={24} className="text-rose-500" />
                <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em]">{error}</p>
            </div>
        );
    }

    if (nodes.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/30">
                    <GitBranch size={24} />
                </div>
                <div>
                    <p className="text-[11px] font-black text-primary/60 uppercase tracking-[0.2em]">Zero-state detected</p>
                    <p className="mt-1 text-[10px] font-medium text-primary/40 leading-relaxed max-w-[240px]">
                        No input/output dataset lineage relationships found for this operational dataflow.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={containerRef} 
            className={`${isFullscreen ? 'h-[100vh] rounded-none' : 'h-[420px] rounded-2xl shadow-inner border border-primary/10'} w-full bg-[#fafafa] relative overflow-hidden flex flex-col`}
        >
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#fafafa] pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#fafafa] pointer-events-none z-10" />

            
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={lineageNodeTypes}
                edgeTypes={edgeTypes}
                onInit={(instance) => { reactFlowInstance.current = instance; }}
                fitView
                fitViewOptions={{ padding: 0.15 }}
                minZoom={0.35}
                maxZoom={1.2}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable
                proOptions={{ hideAttribution: true }}
            >
                <Panel position="top-right" className="m-3">
                    <button
                        onClick={toggleFullscreen}
                        className="w-10 h-10 bg-white/90 backdrop-blur border border-primary/10 rounded-xl flex items-center justify-center text-primary/60 hover:text-primary hover:bg-white hover:scale-105 transition-all shadow-lg active:scale-95"
                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                </Panel>
                
                <Panel position="bottom-left" className="m-4">
                    <div className="px-3 py-1.5 bg-white/80 backdrop-blur-md border border-primary/10 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest leading-none">Topology secure</span>
                        </div>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
};

const Lineage = (props: LineageProps) => {
    return (
        <ReactFlowProvider>
            <LineageInner {...props} />
        </ReactFlowProvider>
    );
};

export default Lineage;