/* eslint-disable react/prop-types */
// @ts-ignore
import type { DomoResponse } from "@/hooks/useDashboard";
import { createContext, type ReactNode, useCallback, useMemo, useState } from "react";
import domo from "ryuu.js";

export interface CardItem {
    Card_ID: string;
    Title: string;
    Card_Type: string;
    Owner_User_ID: string;
    Owner_Name: string;
    Page: string;
    Page_ID: string;
    Last_Modified: string;
    Locked: boolean;
    Description: string;
    Dataset_ID: string;
    Dataset_Name: string;
    Page_Type: string;
    Parent_Page_ID: string;
}

export interface CardsContextType {
    fetchCardData: (datasetId: string) => Promise<CardItem[]>;
    loading: boolean;
}

export const CardsContext = createContext<CardsContextType | undefined>(
    undefined
);

export const CardsProvider = ({ children }: { children: ReactNode }) => {

    const [loading, setLoading] = useState(false);

    const fetchCardData = useCallback(async (datasetId: string) => {
        try {
            setLoading(true);

            const safeDatasetId = String(datasetId ?? "").replaceAll("'", "''").trim();
            if (!safeDatasetId) return [];

            const query = `
                SELECT *
                FROM cardsanddatasets
                WHERE \`Dataset ID\` = '${safeDatasetId}'
            `.trim();

            const res = await domo.post('/sql/v1/cardsanddatasets', query, { contentType: 'text/plain' }) as DomoResponse;

            return res.rows.map((row: any) => ({
                Card_ID: row[0],
                Title: row[1],
                Card_Type: row[2],
                Owner_User_ID: row[3],
                Owner_Name: row[4],
                Page: row[5],
                Page_ID: row[6],
                Last_Modified: row[7],
                Locked: row[8],
                Description: row[9],
                Dataset_ID: row[10],
                Dataset_Name: row[11],
                Page_Type: row[12],
                Parent_Page_ID: row[13]
            }));
        } catch (err) {
            console.error("Error fetching card data:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = useMemo(() => {
        return {
            fetchCardData,
            loading
        };
    }, [
        fetchCardData,
        loading
    ])

    return (
        <CardsContext.Provider
            value={value}
        >
            {children}
        </CardsContext.Provider>
    );
};
