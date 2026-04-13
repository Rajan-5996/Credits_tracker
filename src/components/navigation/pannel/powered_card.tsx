import { CardsContext } from "@/context/cardsContext";
import { nodeTypes } from "@/components/custom_node/cards_node/root_node";
import { usePoweredCardGraph } from "@/hooks/usePoweredCardGraph";
import { useCallback, useContext, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Background, BackgroundVariant, Controls, ReactFlow, type Node, ReactFlowProvider } from "@xyflow/react";
import { Loader2 } from "lucide-react";

const DOMO_BASE_URL = "https://gwcteq-partner.domo.com";

interface PoweredCardNodeData extends Record<string, unknown> {
    pageId?: string;
}

const PoweredCardInner = ({ datasetId }: { datasetId: string }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const cardsContext = useContext(CardsContext);
    const fetchCardData = cardsContext?.fetchCardData;
    const contextLoading = cardsContext?.loading ?? false;

    const {
        cardRows,
        nodes,
        onNodesChange,
        edges,
        isLoading,
    } = usePoweredCardGraph({
        datasetId,
        fetchCardData,
    });

    useEffect(() => {
        const onFullscreenChange = () => {
            const isFull = document.fullscreenElement === containerRef.current
            setIsFullscreen(isFull);
            if (reactFlowInstance.current) {
                setTimeout(() => {
                    reactFlowInstance.current.fitView({ padding: 0.15, duration: 500 });
                }, 100);
            }
        };

        document.addEventListener("fullscreenchange", onFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);


    const toggleFullscreen = useCallback(async () => {
        const el = containerRef.current;
        if (!el) return;

        try {
            if (document.fullscreenElement === el) {
                await document.exitFullscreen();
                return;
            }

            await el.requestFullscreen();
        } catch (error) {
            console.error("Failed to toggle fullscreen:", error);
        }
    }, []);

    const handleNodeClick = useCallback((_event: ReactMouseEvent, node: Node<PoweredCardNodeData>) => {
        if (!node.id.startsWith("page-")) return;

        const pageId = String(node.data?.pageId || "").trim();
        if (!pageId) return;

        globalThis.window.open(`${DOMO_BASE_URL}/page/${encodeURIComponent(pageId)}`, "_blank", "noopener,noreferrer");
    }, []);

    const reactFlowInstance = useRef<any>(null);

    return (
        <div
            ref={containerRef}
            className={`group relative w-full ${isFullscreen ? 'h-[100vh] bg-[#fafafa] rounded-none' : 'h-full min-h-[450px] bg-[#fafafa] rounded-2xl border border-primary/10 shadow-inner'} overflow-hidden flex flex-col`}
        >
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => {
                        void toggleFullscreen();
                    }}
                    className="px-4 py-2 bg-white/90 backdrop-blur border border-primary/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary hover:bg-white hover:scale-105 transition-all shadow-lg active:scale-95"
                >
                    {isFullscreen ? "Exit Full Screen" : "Full Screen"}
                </button>
            </div>

            <ReactFlow
                key={datasetId}
                className="h-full w-full"
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                onInit={(instance) => { reactFlowInstance.current = instance; }}
                fitView
                fitViewOptions={{ maxZoom: 1, padding: 0.15 }}
                nodesDraggable
                nodesConnectable={false}
                elementsSelectable={false}
            >
                <Background
                    color="oklch(var(--primary))"
                    variant={BackgroundVariant.Dots}
                    style={{ opacity: 0.05 }}
                    gap={20}
                />
                <Controls className="!bg-white !border-primary/10 !shadow-lg !rounded-xl overflow-hidden" />
            </ReactFlow>

            {(isLoading || contextLoading) && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                    <Loader2 size={24} className="animate-spin text-primary/60 mb-3" />
                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">Synchronizing card nodes...</p>
                </div>
            )}

            {!isLoading && !contextLoading && cardRows.length === 0 && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center bg-primary/5">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/30 mb-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-primary/60 uppercase tracking-[0.2em]">No powered cards</p>
                        <p className="mt-1 text-[10px] font-medium text-primary/40 leading-relaxed max-w-[240px]">
                            This dataset is not currently powering any visualizations.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

const PoweredCard = (props: { datasetId: string }) => {
    return (
        <ReactFlowProvider>
            <PoweredCardInner {...props} />
        </ReactFlowProvider>
    );
};

export default PoweredCard


