/* eslint-disable react/prop-types */
// @ts-ignore
import type { DomoResponse } from "@/hooks/useDashboard";
import { createContext, type ReactNode, useCallback, useMemo, useState } from "react";
import domo from "ryuu.js";

export interface AppContextType {
    domainCredits: () => Promise<string>;
    topCreditUsers: () => Promise<Array<{ User_ID: string, total_credits: number }>>;
    lowCreditUsers: () => Promise<Array<{ User_ID: string, total_credits: number }>>;
    dataLoading: boolean;
    loader2: boolean;
    userTableData: () => Promise<Array<{ User_ID: string, Name: string, Status: string, credits: number }>>;
    getUserCredits: (userId: string) => Promise<number | { totalCredits: number; name: string }>;
    resetLoader2: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(
    undefined
);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [loader2, setLoader2] = useState(true);

    const domainCredits = useCallback(async (): Promise<string> => {
        const res = await domo.post(
            '/sql/v1/creditstracker',
            'SELECT domain, SUM(creditsUsed) AS total_credits FROM dataAlias GROUP BY domain',
            { contentType: 'text/plain' }
        ) as DomoResponse;

        if (res) {
            setLoading(false);
        }

        return String(res?.rows?.[0]?.[1] ?? 0);
    }, []);

    const topCreditUsers = useCallback(async (): Promise<Array<{ User_ID: string, total_credits: number }>> => {
        const res = await domo.post('/sql/v1/creditstracker',
            'SELECT User_ID, SUM(creditsUsed) AS total_credits FROM dataAlias GROUP BY User_ID ORDER BY total_credits DESC LIMIT 5', {
            contentType: 'text/plain'
        }) as DomoResponse;

        if (res) {
            setLoading(false);
        }

        const rows = res?.rows ?? [];
        return rows.map((row) => ({
            User_ID: String(row?.[0] ?? ""),
            total_credits: Number(row?.[1] ?? 0),
        }));
    }, [])

    const lowCreditUsers = useCallback(async (): Promise<Array<{ User_ID: string, total_credits: number }>> => {
        const res = await domo.post('/sql/v1/creditstracker',
            'SELECT User_ID, SUM(creditsUsed) AS total_credits FROM dataAlias GROUP BY User_ID ORDER BY total_credits ASC LIMIT 5', {
            contentType: 'text/plain'
        }) as DomoResponse;

        if (res) {
            setLoading(false);
        }

        const rows = res?.rows ?? [];
        return rows.map((row) => ({
            User_ID: String(row?.[0] ?? ""),
            total_credits: Number(row?.[1] ?? 0),
        }));
    }, [])

    const userTableData = useCallback(async (): Promise<Array<{ User_ID: string, Name: string, Status: string, credits: number }>> => {
        try {
            const res = await domo.post(
                '/sql/v1/creditstrackertable',
                `
                    SELECT * FROM dataAlias
                `,
                { contentType: 'text/plain' }
            ) as DomoResponse;

            if (res) {
                setLoading(false);
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
    }, []);

    const getUserCredits = useCallback(async (userId: string): Promise<number | { totalCredits: number, name: string }> => {
        try {
            const res = await domo.post(
                '/sql/v1/creditstrackertable',
                `
                    SELECT Name, total_credits_used
                    FROM dataAlias
                    WHERE User_ID = '${userId}'
                `,
                { contentType: 'text/plain' }
            ) as DomoResponse;

            if (res) {
                setLoading(false);
            }

            const totalCredits = Number(res?.rows?.[0]?.[1] ?? 0);
            const name = String(res?.rows?.[0]?.[0] ?? "User Name");

            return {
                totalCredits,
                name,
            };

        } catch (error) {
            setLoader2(false);
            console.error('getUserCredits error:', error);
            return 0;
        } finally {
            setLoader2(false);
        }
    }, []);

    const resetLoader2 = useCallback(() => {
        setLoader2(true);
    }, []);

    const value = useMemo(() => {
        return {
            domainCredits,
            topCreditUsers,
            lowCreditUsers,
            dataLoading: loading,
            loader2,
            userTableData,
            getUserCredits,
            resetLoader2,
        };
    }, [domainCredits, topCreditUsers, lowCreditUsers, loading, loader2, userTableData, getUserCredits, resetLoader2]);

    return (
        <AppContext.Provider
            value={value}
        >
            {children}
        </AppContext.Provider>
    );
};
