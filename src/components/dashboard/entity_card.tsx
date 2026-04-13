import { Background, ReactFlow, type ReactFlowInstance, BackgroundVariant, useNodesInitialized, ReactFlowProvider } from '@xyflow/react';
import { useDashboard } from '@/hooks/useDashboard';
import { useEffect, useRef, useState } from 'react';
import { nodeTypes } from '../custom_node/entity_nodes/root_node';
import { TbTopologyStar3, TbFocusCentered, TbArrowsMaximize, TbArrowsMinimize } from "react-icons/tb";
import { motion } from 'framer-motion';

const FlowContent = ({ isFullscreen, toggleFS }: { isFullscreen: boolean; toggleFS: () => void }) => {
    const { nodes, onNodesChange, edges } = useDashboard();
    const flowRef = useRef<ReactFlowInstance<any, any> | null>(null);
    const nodesInitialized = useNodesInitialized();
    const [hasFitted, setHasFitted] = useState(false);

    useEffect(() => {
        if (flowRef.current && nodesInitialized && !hasFitted && nodes.length > 0) {
            const timer = setTimeout(() => {
                flowRef.current?.fitView({ 
                    padding: 0.2, 
                    duration: 1000,
                    maxZoom: 0.8
                });
                setHasFitted(true);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [nodesInitialized, nodes.length, hasFitted]);

    useEffect(() => {
        setHasFitted(false);
    }, [nodes.length, edges.length]);

    // Re-fit when entering/exiting fullscreen
    useEffect(() => {
        if (flowRef.current) {
            setTimeout(() => {
                flowRef.current?.fitView({ duration: 500, padding: 0.2 });
            }, 100);
        }
    }, [isFullscreen]);

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="flex items-center gap-4 px-8 py-6 shrink-0 relative z-10 border-b border-primary/5">
                <div className="w-10 h-10 rounded-xl gwc-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <TbTopologyStar3 size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-black tracking-tight text-foreground font-heading leading-tight capitalize">
                        Relationship network
                    </h2>
                    <p className="text-[10px] font-black text-primary/60 capitalize tracking-[0.15em] mt-1 leading-none">Intelligence distribution topology</p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] font-black text-foreground capitalize tracking-widest leading-none">Live nodes</span>
                        <span className="text-[8px] font-black text-emerald-500 capitalize tracking-widest mt-1">Active sync</span>
                    </div>
                    <div className="w-[1px] h-8 bg-primary/10" />
                    <button 
                        onClick={toggleFS}
                        className="w-10 h-10 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-primary/10 shadow-sm"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <TbArrowsMinimize size={16} /> : <TbArrowsMaximize size={16} />}
                    </button>
                    <div className="w-[1px] h-8 bg-primary/10" />
                    <button 
                        onClick={() => {
                            setHasFitted(false);
                            flowRef.current?.fitView({ duration: 800, padding: 0.2 });
                        }}
                        className="text-[10px] font-black capitalize tracking-widest px-6 py-2 rounded-full gwc-gradient text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <TbFocusCentered size={14} />
                        Auto Fit
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full relative bg-[#fafafc]/30">
                <ReactFlow
                    onInit={(instance) => {
                        flowRef.current = instance;
                    }}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    nodeTypes={nodeTypes}
                    minZoom={0.2}
                    maxZoom={1.5}
                    zoomOnScroll={true}
                    panOnScroll={false}
                    panOnDrag={true}
                >
                    <Background
                        color="#6F2B8B"
                        gap={40}
                        size={1}
                        variant={BackgroundVariant.Dots}
                        style={{ opacity: 0.05 }}
                    />
                </ReactFlow>
            </div>
            
            <div className="absolute bottom-4 right-8 z-10">
                <p className="text-[9px] font-black text-primary/20 capitalize tracking-widest">Interactive mainframe panned view</p>
            </div>
        </div>
    );
};

const EntityCard = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFS = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFS);
        return () => document.removeEventListener('fullscreenchange', handleFS);
    }, []);

    const toggleFS = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <motion.div 
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col w-full ${isFullscreen ? 'h-screen' : 'h-[550px]'} bg-white border border-primary/5 rounded-xl relative overflow-hidden shadow-xl`}
        >
            <ReactFlowProvider>
                <FlowContent isFullscreen={isFullscreen} toggleFS={toggleFS} />
            </ReactFlowProvider>
        </motion.div>
    )
}

export default EntityCard

