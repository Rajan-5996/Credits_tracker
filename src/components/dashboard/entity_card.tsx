import { Background, ReactFlow, type ReactFlowInstance } from '@xyflow/react';
import { useDashboard } from '@/hooks/useDashboard';
import { useEffect, useRef } from 'react';
import { nodeTypes } from '../custom_node/root_node';

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
        <div style={{ width: '100%', height: '100%', minHeight: 640, background: '#fafaf5' }}>
            <ReactFlow
                onInit={(instance) => {
                    flowRef.current = instance;
                }}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                fitViewOptions={{ maxZoom: 1, padding: 0.2 }}
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
                <Background color="#d4a800" gap={24} size={1} style={{ opacity: 0.12 }} />
            </ReactFlow>
        </div>
    )
}

export default EntityCard
