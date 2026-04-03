import { Background, ReactFlow, type ReactFlowInstance, BackgroundVariant } from '@xyflow/react';
import { useDashboard } from '@/hooks/useDashboard';
import { useEffect, useRef } from 'react';
import { nodeTypes } from '../custom_node/entity_nodes/root_node';

const EntityCard = () => {
    const { nodes, onNodesChange, edges } = useDashboard();
    const flowRef = useRef<ReactFlowInstance<any, any> | null>(null);

    useEffect(() => {
        if (!flowRef.current || nodes.length === 0) {
            return;
        }

        const frame = globalThis.requestAnimationFrame(() => {
            flowRef.current?.fitView({ maxZoom: 1, padding: 0.12 });
        });

        return () => globalThis.cancelAnimationFrame(frame);
    }, [nodes.length, edges.length]);

    return (
        <div style={{ width: '100%', height: '100%', minHeight: 720, background: 'transparent' }} className="relative group">
            <div className="absolute top-6 left-6 z-20 flex flex-col pointer-events-none select-none bg-white px-6 py-3 rounded-md">
                <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-primary/40 leading-none mb-1.5 ml-0.5">RELATIONSHIP VIEW</span>
                <h2 className="text-2xl font-black tracking-tighter text-[#7030B1] drop-shadow-sm uppercase">
                    Powered <span className="text-foreground">Entity</span>
                </h2>
            </div>
            <ReactFlow
                onInit={(instance) => {
                    flowRef.current = instance;
                }}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ maxZoom: 1, padding: 0.2, duration: 0 }}
                preventScrolling={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                panOnScroll={false}
                panOnDrag={false}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
            >
                <Background
                    color="#7030B1"
                    gap={32}
                    size={5}
                    variant={BackgroundVariant.Cross}
                    style={{ opacity: 0.12 }}
                />
            </ReactFlow>
        </div>
    )
}

export default EntityCard
