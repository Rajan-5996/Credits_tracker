/* eslint-disable react/prop-types */
// @ts-ignore
import type { DomoResponse } from "@/hooks/useDashboard";
import { createContext, type ReactNode, useCallback, useMemo } from "react";
import domo from "ryuu.js";

export interface DetailsContextType {
    fetchdatasetCount: (userId: string) => Promise<{
        datasets: { userId: string; count: number; cardsPowered: number };
        dataflows: { userId: string; count: number };
        workflows: { userId: string; count: number };
        jupyter: { userId: string; count: number };
    }>;
}

export const DetailsContext = createContext<DetailsContextType | undefined>(
    undefined
);

export const DetailsProvider = ({ children }: { children: ReactNode }) => {

    const fetchAllCounts = useCallback(async (userId: string) => {
        const uid = Number(userId);

        try {
            const [datasetsRes, dataflowsRes, workflowsRes, jupyterRes] = await Promise.all([

                domo.post('/sql/v1/datasets', `
                SELECT 
                    COUNT(DISTINCT ID) AS dataset_count,
                    SUM(Cards_Powered) AS cards_powered
                FROM datasets
                WHERE Owner_User_ID = ${uid}
            `, { contentType: 'text/plain' }),

                domo.post('/sql/v1/dataflows', `
                    SELECT COUNT(DISTINCT ID) AS dataflow_count
                    FROM dataflows
                    WHERE \`Owner ID\` = ${uid}
                `, { contentType: 'text/plain' }),

                domo.post('/sql/v1/workflows', `
                    SELECT COUNT(DISTINCT \`Model ID\`) AS workflow_count
                    FROM workflows
                    WHERE Owner = ${uid}
                `, { contentType: 'text/plain' }),

                domo.post('/sql/v1/jupyterworkspace', `
                SELECT COUNT(DISTINCT \`Workspace ID\`) AS jupyter_count
                FROM jupyterworkspace
                WHERE Owner = ${uid}
            `, { contentType: 'text/plain' }),

            ]) as [DomoResponse, DomoResponse, DomoResponse, DomoResponse];

            console.log("Counts fetched:", {
                workflows: workflowsRes,
            });

            return {
                datasets: {
                    userId,
                    count: Number(datasetsRes?.rows[0][0]),
                    cardsPowered: Number(datasetsRes?.rows[0][1] || 0)
                },
                dataflows: {
                    userId,
                    count: Number(dataflowsRes?.rows[0][0])
                },
                workflows: {
                    userId,
                    count: Number(workflowsRes?.rows[0][0])
                },
                jupyter: {
                    userId,
                    count: Number(jupyterRes?.rows[0][0])
                }
            };

        } catch (err) {
            console.error("Error fetching counts:", err);
            throw err;
        }
    }, []);

    const value = useMemo(() => {
        return {
            fetchdatasetCount: fetchAllCounts
        };
    }, [fetchAllCounts])

    return (
        <DetailsContext.Provider
            value={value}
        >
            {children}
        </DetailsContext.Provider>
    );
};
