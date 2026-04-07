import { CardsContext } from "@/context/cardsContext";
import { nodeTypes } from "@/components/custom_node/cards_node/root_node";
import { usePoweredCardGraph } from "@/hooks/usePoweredCardGraph";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Background, BackgroundVariant, Controls, ReactFlow } from "@xyflow/react";

const PoweredCard = ({ datasetId }: { datasetId: string }) => {
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
            setIsFullscreen(document.fullscreenElement === containerRef.current);
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

    return (
        <div
            ref={containerRef}
            className="relative w-full"
            style={{ backgroundColor: "#f5f5f5", height: "100%", minHeight: "320px" }}
        >
            <button
                type="button"
                onClick={() => {
                    void toggleFullscreen();
                }}
                className="absolute right-3 top-3 z-20 rounded-md border border-border bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur hover:bg-background"
            >
                {isFullscreen ? "Exit Full Screen" : "Full Screen"}
            </button>
            <ReactFlow
                key={datasetId}
                className="h-full w-full"
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ maxZoom: 1, padding: 0.2 }}
                nodesDraggable
                nodesConnectable={false}
                elementsSelectable={false}
            >
                <Background
                    color="#7030B1"
                    variant={BackgroundVariant.Cross}
                    style={{ opacity: 0.12 }}
                />
                <Controls />
            </ReactFlow>

            {(isLoading || contextLoading) && (
                <div className="absolute bottom-3 left-3 z-20 rounded-md border border-border bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                    Loading powered cards...
                </div>
            )}

            {!isLoading && !contextLoading && cardRows.length === 0 && (
                <div className="absolute bottom-3 left-3 z-20 rounded-md border border-border bg-background/95 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                    No powered cards found for this dataset.
                </div>
            )}
        </div>
    )
}

export default PoweredCard
