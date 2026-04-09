/* eslint-disable react/prop-types */
// @ts-ignore
import { createContext, ReactNode, useCallback, useMemo } from "react";
import domo from "ryuu.js";

export interface DataflowLineageContextType {
    getLineageData: (dataflowId: number) => Promise<any>;
}

export const DataflowLineageContext = createContext<DataflowLineageContextType | undefined>(
    undefined
);

export const DataflowLineageProvider = ({ children }: { children: ReactNode }) => {

    const getLineageData = useCallback(async (dataflowId: number) => {
        const id = Number(dataflowId);

        if (!Number.isFinite(id)) {
            throw new Error(`Invalid dataflowId: ${dataflowId}`);
        }

        const [inputDatasets, outputDatasets] = await Promise.all([
            domo.post('/sql/v1/dataflowinputs',
                `
                    SELECT \`Datasource Input ID\`
                    FROM dataflowinputs
                    WHERE \`Dataflow ID\` = ${id}
                `,
                { contentType: 'text/plain' }
            ),

            domo.post('/sql/v1/dataflowoutputs',
                `
                    SELECT \`Datasource Output ID\`
                    FROM dataflowoutputs
                    WHERE \`Dataflow ID\` = ${id}
                `,
                { contentType: 'text/plain' }
            )
        ]);

        return { inputDatasets, outputDatasets };
    }, []);

    const value = useMemo(() => {
        return {
            getLineageData
        };
    }, [getLineageData]);

    return (
        <DataflowLineageContext.Provider
            value={value}
        >
            {children}
        </DataflowLineageContext.Provider>
    );
};

