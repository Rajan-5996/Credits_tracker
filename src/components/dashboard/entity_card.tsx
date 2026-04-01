import { Background, Controls, ReactFlow } from '@xyflow/react';
import { useDashboard } from '@/hooks/useDashboard';
import { nodeTypes } from '../custom_node/root_node';

const EntityCard = () => {
    const { nodes, onNodesChange, edges } = useDashboard();

    return (
        <div style={{ width: '100%', height: '100%', background: '#fafaf5' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background color="#d4a800" gap={24} size={1} style={{ opacity: 0.12 }} />
                <Controls />
            </ReactFlow>
        </div>
    )
}

export default EntityCard
