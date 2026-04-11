import { Background, ReactFlow, type ReactFlowInstance, BackgroundVariant } from '@xyflow/react';
import { useDashboard } from '@/hooks/useDashboard';
import { useEffect, useRef } from 'react';
import { nodeTypes } from '../custom_node/entity_nodes/root_node';
import { TbTopologyStar3 } from "react-icons/tb";

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
        <div className="flex flex-col w-full h-full min-h-[720px] rounded-sm shadow-sm relative overflow-hidden"
            style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}
        >
            {/* Header Bar */}
            <div className="flex items-center gap-2 px-4 py-3 shrink-0 relative z-10"
                style={{
                    background: '#f8f9fa',
                    borderBottom: '1px solid #e2e8f0',
                }}
            >
                <TbTopologyStar3 size={18} style={{ color: '#1a73e8' }} />
                <h2 className="text-[13px] font-bold tracking-wider uppercase leading-none"
                    style={{ color: '#1e293b', fontFamily: "'Roboto', sans-serif" }}
                >
                    Relationship Map
                </h2>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm"
                    style={{
                        color: '#1a73e8',
                        background: 'rgba(26,115,232,0.06)',
                        border: '1px solid rgba(26,115,232,0.15)',
                    }}
                >
                    Interactive
                </span>
            </div>

            {/* Graph Canvas */}
            <div className="flex-1 w-full relative">
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
                        color="#4a5568"
                        gap={32}
                        size={1}
                        variant={BackgroundVariant.Dots}
                        style={{ opacity: 0.3 }}
                    />
                </ReactFlow>
            </div>
        </div>
    )
}

export default EntityCard
