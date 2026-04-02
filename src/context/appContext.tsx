/* eslint-disable react/prop-types */
// @ts-ignore
import type { DomoResponse } from "@/hooks/useDashboard";
import { createContext, type ReactNode, useMemo, useState } from "react";
import domo from "ryuu.js";

export interface AppContextType {
    domainCredits: () => Promise<string>;
    topCreditUsers: () => Promise<Array<{ User_ID: string, total_credits: number }>>;
    lowCreditUsers: () => Promise<Array<{ User_ID: string, total_credits: number }>>;
    dataLoading: boolean;
    userTableData: () => Promise<Array<{ User_ID: string, Name: string, Status: string, credits: number }>>;
}

export const AppContext = createContext<AppContextType | undefined>(
    undefined
);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);

    const domainCredits = async (): Promise<string> => {
        const res = await domo.post(
            '/sql/v1/credits_tracker',
            'SELECT domain, SUM(creditsUsed) AS total_credits FROM dataAlias GROUP BY domain',
            { contentType: 'text/plain' }
        ) as DomoResponse;

        if (res) {
            loading && setLoading(false);
        }

        return String(res?.rows?.[0]?.[1] ?? 0);
    }

    const topCreditUsers = async (): Promise<Array<{ User_ID: string, total_credits: number }>> => {
        const res = await domo.post('/sql/v1/credits_tracker',
            'SELECT User_ID, SUM(creditsUsed) AS total_credits FROM dataAlias GROUP BY User_ID ORDER BY total_credits DESC LIMIT 5', {
            contentType: 'text/plain'
        }) as DomoResponse;

        if (res) {
            loading && setLoading(false);
        }

        const rows = res?.rows ?? [];
        return rows.map((row) => ({
            User_ID: String(row?.[0] ?? ""),
            total_credits: Number(row?.[1] ?? 0),
        }));
    }

    const lowCreditUsers = async (): Promise<Array<{ User_ID: string, total_credits: number }>> => {
        const res = await domo.post('/sql/v1/credits_tracker',
            'SELECT User_ID, SUM(creditsUsed) AS total_credits FROM dataAlias GROUP BY User_ID ORDER BY total_credits ASC LIMIT 5', {
            contentType: 'text/plain'
        }) as DomoResponse;

        if (res) {
            loading && setLoading(false);
        }

        const rows = res?.rows ?? [];
        return rows.map((row) => ({
            User_ID: String(row?.[0] ?? ""),
            total_credits: Number(row?.[1] ?? 0),
        }));
    }

    const userTableData = async (): Promise<Array<{ User_ID: string, Name: string, Status: string, credits: number }>> => {
        try {
            const res = await domo.post(
                '/sql/v1/credits_tracker_table',
                `
                    SELECT * FROM dataAlias
                `,
                { contentType: 'text/plain' }
            ) as DomoResponse;

            if (res) {
                loading && setLoading(false);
            }

            const data = res?.rows?.map((row) => ({
                User_ID: String(row?.[0] ?? ""),
                Name: String(row?.[1] ?? ""),
                Status: String(row?.[3] ?? ""),
                credits: Number(row?.[4] ?? 0),
            })) ?? [];

            return data;
        } catch (error) {
            console.error('userTableData error:', error);
            return [];
        }
    };

    const value = useMemo(() => {
        return {
            domainCredits,
            topCreditUsers,
            lowCreditUsers,
            dataLoading: loading,
            userTableData,
        };
    }, [domainCredits, topCreditUsers, lowCreditUsers, loading, userTableData]);

    return (
        <AppContext.Provider
            value={value}
        >
            {children}
        </AppContext.Provider>
    );
};
