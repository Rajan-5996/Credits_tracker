/* eslint-disable react/prop-types */
// @ts-ignore
import type { DomoResponse } from "@/hooks/useDashboard";
import type { DataflowRecord, DatasetRecord, JupyterWorkspaceRecord, WorkflowRecord } from "@/types/details_type";
import { createContext, type ReactNode, useCallback, useMemo, useState } from "react";
import domo from "ryuu.js";

export interface DetailsContextType {
    fetchdatasetCount: (userId: string) => Promise<{
        datasets: { userId: string; count: number; cardsPowered: number };
        dataflows: {
            userId: string;
            count: number;
            activeCount: number;
            inactiveCount: number;
        };
        workflows: {
            userId: string;
            count: number;
            activeCount: number;
            inactiveCount: number;
        };
        jupyter: { userId: string; count: number };
    }>;

    fetchDataset: (userId: string) => Promise<DatasetRecord[]>;

    fetchDataflow: (userId: string, status?: "active" | "inactive") => Promise<DataflowRecord[]>;

    fetchWorkflow: (userId: string, status?: "active" | "inactive") => Promise<WorkflowRecord[]>;

    fetchJupyterWorkspace: (userId: string) => Promise<JupyterWorkspaceRecord[]>;

    loading: boolean;
}

export const DetailsContext = createContext<DetailsContextType | undefined>(
    undefined
);

export const DetailsProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);

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
                    SELECT 
                        COUNT(DISTINCT ID) AS dataflow_count,

                        COUNT(DISTINCT CASE 
                            WHEN \`Last Executed Date\` >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR) 
                            THEN ID 
                        END) AS active_dataflows,

                        COUNT(DISTINCT CASE 
                            WHEN \`Last Executed Date\` < DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR) 
                            THEN ID 
                        END) AS inactive_dataflows

                    FROM dataflows
                    WHERE \`Owner ID\` = '${uid}'
                `, { contentType: 'text/plain' }),

                domo.post('/sql/v1/workflows', `
                    SELECT 
                        COUNT(DISTINCT \`Model ID\`) AS total_workflows,

                        COUNT(DISTINCT CASE 
                            WHEN \`Start Time\` >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR) 
                            THEN \`Model ID\` 
                        END) AS active_workflows,

                        COUNT(DISTINCT CASE 
                            WHEN \`Start Time\` < DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR) 
                            THEN \`Model ID\` 
                        END) AS inactive_workflows

                    FROM workflows
                    WHERE Owner = '${uid}'
                `, { contentType: 'text/plain' }),

                domo.post('/sql/v1/jupyterworkspace', `
                SELECT COUNT(DISTINCT \`Workspace ID\`) AS jupyter_count
                FROM jupyterworkspace
                WHERE Owner = ${uid}
            `, { contentType: 'text/plain' }),

            ]) as [DomoResponse, DomoResponse, DomoResponse, DomoResponse];

            return {
                datasets: {
                    userId,
                    count: Number(datasetsRes?.rows[0][0]),
                    cardsPowered: Number(datasetsRes?.rows[0][1] || 0)
                },
                dataflows: {
                    userId,
                    count: Number(dataflowsRes?.rows[0][0]),
                    inactiveCount: Number(dataflowsRes?.rows[0][2]),
                    activeCount: Number(dataflowsRes?.rows[0][1])
                },
                workflows: {
                    userId,
                    count: Number(workflowsRes?.rows[0][0]),
                    inactiveCount: Number(workflowsRes?.rows[0][2]),
                    activeCount: Number(workflowsRes?.rows[0][1])
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

    const fetchDataset = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            const res = await domo.post('/sql/v1/datasets', `
                SELECT DISTINCT *
                FROM datasets
                WHERE Owner_User_ID = ${Number(userId)}
                ORDER BY Cards_Powered DESC
                LIMIT 50
            `, { contentType: 'text/plain' }) as DomoResponse;

            return res.rows.map(row => ({
                ID: row[0],
                Name: row[1],
                Link: row[2],
                Owner_User_ID: row[3],
                Created_Date: row[4],
                Last_Run_Date: row[5],
                Status: row[6],
                Schedule: row[7],
                Import_Type: row[8],
                Data_Provider: row[9],
                Source_Type: row[10],
                Cards_Powered: row[11],
                PDP_Enabled: row[12],
                Shared: row[13],
                Account_ID: row[14],
                Data_Warehouse: row[15],
                Cloud_Engine: row[16],
            }));
        } catch (err) {
            console.error("Error fetching dataset count:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDataflow = useCallback(async (userId: string, status?: "active" | "inactive") => {
        console.log("Fetching dataflows with status:", status);
        try {
            setLoading(true);
            var condition = "";

            if (status === "active") {
                condition = `AND \`Last Executed Date\` >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)`;
            } else if (status === "inactive") {
                condition = `AND \`Last Executed Date\` < DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)`;
            }

            console.log(condition)

            const res = await domo.post('/sql/v1/dataflows', `
                SELECT DISTINCT *
                FROM dataflows
                WHERE \`Owner ID\` = ${Number(userId)}
                ${condition}
                LIMIT 50
            `, { contentType: 'text/plain' }) as DomoResponse;

            return res.rows.map(row => ({
                id: row[0],
                display_name: row[1],
                description: row[2],
                link: row[3],
                type: row[4],
                status: row[5],
                inputs: row[6],
                outputs: row[7],
                owner_id: row[8],
                current_version: row[9],
                last_executed_date: row[10],
                last_updated_date: row[11],
                last_updated_by: row[12],
            }));
        } catch (err) {
            console.error("Error fetching dataflow count:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchWorkflow = useCallback(async (userId: string, status?: "active" | "inactive") => {
        try {
            setLoading(true);
            let condition = "";

            if (status === "active") {
                condition = `AND \`Start Time\` >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)`;
            } else if (status === "inactive") {
                condition = `AND \`Start Time\` < DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)`;
            }

            const res = await domo.post('/sql/v1/workflows', `
                SELECT DISTINCT *
                FROM workflows
                WHERE Owner = ${Number(userId)}
                ${condition}
                LIMIT 50
            `, { contentType: 'text/plain' }) as DomoResponse;

            return res.rows.map(row => ({
                workflow_name: row[0],
                workflow_version: row[1],
                model_id: row[2],
                created_by: row[3],
                owner: row[4],
                deployed_by: row[5],
                execution_id: row[6],
                workflow_status: row[7],
                trigger_name: row[8],
                trigger_type: row[9],
                trigger_id: row[10],
                started_by: row[11],
                start_time: row[12],
                end_time: row[13],
                updated_on: row[14],
                cycle_time: row[15],
                qualifying_tasks: row[16],
            }));
        } catch (err) {
            console.error("Error fetching workflow count:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchJupyterWorkspace = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            const res = await domo.post('/sql/v1/jupyterworkspace', `
                SELECT DISTINCT *
                FROM jupyterworkspace
                WHERE Owner = ${Number(userId)}
                LIMIT 50
            `, { contentType: 'text/plain' }) as DomoResponse;

            return res.rows.map(row => ({
                workspace_id: row[0],
                name: row[1],
                description: row[2],
                created_date: row[3],
                owner: row[4],
                cpu_cores: row[5],
                memory: row[6],
            }));
        } catch (err) {
            console.error("Error fetching jupyter workspace count:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = useMemo(() => {
        return {
            fetchdatasetCount: fetchAllCounts,
            fetchDataset,
            fetchDataflow,
            fetchWorkflow,
            fetchJupyterWorkspace,
            loading
        };
    }, [
        fetchAllCounts,
        fetchDataset,
        fetchDataflow,
        fetchWorkflow,
        fetchJupyterWorkspace,
        loading,
    ]);

    return (
        <DetailsContext.Provider
            value={value}
        >
            {children}
        </DetailsContext.Provider>
    );
};

