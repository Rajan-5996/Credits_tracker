/* eslint-disable react/prop-types */
// @ts-ignore
import { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import domo from "ryuu.js";

export interface DataflowLineageContextType {
    getLineageData: (dataflowId: number) => Promise<any>;
}

export const DataflowLineageContext = createContext<DataflowLineageContextType | undefined>(
    undefined
);

export const DataflowLineageProvider = ({ children }: { children: ReactNode }) => {

    const getLineageData = async (dataflowId: number) => {
        const [inputDatasets, outputDatasets] = await Promise.all([
            domo.post('/sql/v1/dataflowinputs',
                `SELECT \`Datasource Input ID\` FROM dataflowinputs WHERE dataflow_id = ${dataflowId}`
            ),

            domo.post('/sql/v1/dataflowoutputs',
                `SELECT \`Datasource Output ID\` FROM dataflowoutputs WHERE dataflow_id = ${dataflowId}`
            )
        ]);

        console.log('Input Datasets:', inputDatasets);
        console.log('Output Datasets:', outputDatasets);
        return { inputDatasets, outputDatasets };
    }

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

