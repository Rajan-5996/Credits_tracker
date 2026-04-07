import { useCallback, useEffect, useMemo, useState } from "react";
import { applyNodeChanges, type Edge, type Node, type NodeChange } from "@xyflow/react";
import type { CardItem } from "@/context/cardsContext";

const CARD_GAP_Y = 96;
const ROOT_X = 110;
const CARDS_X = 520;
const PAGES_X = 1000;
const ROOT_BASE_Y = 100;
const primary = "var(--primary)";

const cardDataCache = new Map<string, CardItem[]>();
const inFlightRequests = new Map<string, Promise<CardItem[]>>();

interface UsePoweredCardGraphParams {
    datasetId: string;
    fetchCardData?: (datasetId: string) => Promise<CardItem[]>;
}

interface UsePoweredCardGraphResult {
    cardRows: CardItem[];
    nodes: Node[];
    onNodesChange: (changes: NodeChange<Node>[]) => void;
    edges: Edge[];
    isLoading: boolean;
}

export const usePoweredCardGraph = ({
    datasetId,
    fetchCardData,
}: UsePoweredCardGraphParams): UsePoweredCardGraphResult => {
    const [cardRows, setCardRows] = useState<CardItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let active = true;

        const normalizedDatasetId = String(datasetId || "").trim();
        if (!normalizedDatasetId || !fetchCardData) {
            setCardRows([]);
            setIsLoading(false);
            return () => {
                active = false;
            };
        }

        const cachedRows = cardDataCache.get(normalizedDatasetId);
        if (cachedRows) {
            setCardRows(cachedRows);
            setIsLoading(false);
            return () => {
                active = false;
            };
        }

        const load = async () => {
            setIsLoading(true);

            try {
                let request = inFlightRequests.get(normalizedDatasetId);
                if (!request) {
                    request = fetchCardData(normalizedDatasetId);
                    inFlightRequests.set(normalizedDatasetId, request);
                }

                const rows = await request;
                if (!active) return;

                cardDataCache.set(normalizedDatasetId, rows);
                setCardRows(rows);
            } catch (error) {
                if (!active) return;
                console.error("Failed to load powered cards:", error);
                setCardRows([]);
            } finally {
                inFlightRequests.delete(normalizedDatasetId);
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, [datasetId, fetchCardData]);

    const cards = useMemo(() => {
        const cardMap = new Map<string, { id: string; title: string }>();

        cardRows.forEach((row) => {
            const cardId = String(row.Card_ID || "").trim();
            if (!cardId || cardMap.has(cardId)) return;

            cardMap.set(cardId, {
                id: cardId,
                title: String(row.Title || cardId).trim(),
            });
        });

        return Array.from(cardMap.values());
    }, [cardRows]);

    const pages = useMemo(() => {
        const pageMap = new Map<string, { id: string; name: string }>();

        cardRows.forEach((row) => {
            const pageId = String(row.Page_ID || "").trim();
            const pageName = String(row.Page || "Unknown Page").trim() || "Unknown Page";
            const key = pageId || pageName;
            if (pageMap.has(key)) return;

            pageMap.set(key, {
                id: key,
                name: pageName,
            });
        });

        return Array.from(pageMap.values());
    }, [cardRows]);

    const graphNodes = useMemo<Node[]>(() => {
        const cardsHeight = (Math.max(cards.length, 1) - 1) * CARD_GAP_Y;
        const rootY = ROOT_BASE_Y + cardsHeight / 2;

        const rootNode: Node = {
            id: "dataset-root",
            type: "cardsNode",
            position: { x: ROOT_X, y: rootY },
            draggable: false,
            data: {
                title: String(datasetId),
                subtitle: "Dataset ID",
            },
        };

        const cardNodes: Node[] = cards.map((card, index) => ({
            id: `card-${card.id}`,
            type: "cardschildNode",
            position: { x: CARDS_X, y: ROOT_BASE_Y + index * CARD_GAP_Y },
            draggable: true,
            data: {
                title: card.title,
                subtitle: "Powered Card",
            },
        }));

        const pageNodes: Node[] = pages.map((page, index) => ({
            id: `page-${page.id}`,
            type: "cardschildNode",
            position: { x: PAGES_X, y: ROOT_BASE_Y + index * CARD_GAP_Y },
            draggable: true,
            data: {
                title: page.name,
                subtitle: "Page",
                hideSource: true,
            },
        }));

        return [rootNode, ...cardNodes, ...pageNodes];
    }, [cards, datasetId, pages]);

    const [nodes, setNodes] = useState<Node[]>(graphNodes);

    useEffect(() => {
        setNodes(graphNodes);
    }, [graphNodes]);

    const onNodesChange = useCallback((changes: NodeChange<Node>[]) => {
        setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
    }, []);

    const edges = useMemo<Edge[]>(() => {
        const graphEdges: Edge[] = [];

        cards.forEach((card) => {
            graphEdges.push({
                id: `dataset-to-card-${card.id}`,
                source: "dataset-root",
                target: `card-${card.id}`,
                style: { stroke: primary, strokeWidth: 2 },
                animated: true,
            });
        });

        const seenCardToPage = new Set<string>();

        cardRows.forEach((row) => {
            const cardId = String(row.Card_ID || "").trim();
            const pageId = String(row.Page_ID || "").trim();
            const pageName = String(row.Page || "Unknown Page").trim() || "Unknown Page";
            const pageKey = pageId || pageName;

            if (!cardId || !pageKey) return;

            const edgeKey = `${cardId}->${pageKey}`;
            if (seenCardToPage.has(edgeKey)) return;

            seenCardToPage.add(edgeKey);
            graphEdges.push({
                id: `card-to-page-${cardId}-${pageKey}`,
                source: `card-${cardId}`,
                style: { stroke: primary, strokeWidth: 2 },
                target: `page-${pageKey}`,
                animated: true,
            });
        });

        return graphEdges;
    }, [cardRows, cards]);

    return {
        cardRows,
        nodes,
        onNodesChange,
        edges,
        isLoading,
    };
};
