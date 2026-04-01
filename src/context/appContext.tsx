/* eslint-disable react/prop-types */
// @ts-ignore
import type { DomoResponse } from "@/hooks/useDashboard";
import { createContext, type ReactNode, useMemo } from "react";
import domo from "ryuu.js";

export interface AppContextType {
    domainCredits: () => Promise<string>;
    topCreditUsers: () => Promise<Array<{ User_ID: string, total_credits: number }>>;
}

export const AppContext = createContext<AppContextType | undefined>(
    undefined
);

export const AppProvider = ({ children }: { children: ReactNode }) => {

    const domainCredits = async (): Promise<string> => {
        const res = await domo.post(
            '/sql/v1/credits_tracker',
            'SELECT domain, SUM(creditsUsed) AS total_credits FROM dataAlias GROUP BY domain',
            { contentType: 'text/plain' }
        ) as DomoResponse;

        return String(res?.rows?.[0]?.[1] ?? 0);
    }

    const topCreditUsers = async (): Promise<Array<{ User_ID: string, total_credits: number }>> => {
        const res = await domo.post('/sql/v1/credits_tracker',
            'SELECT User_ID, SUM(creditsUsed) AS total_credits FROM dataAlias GROUP BY User_ID ORDER BY total_credits DESC LIMIT 5', {
            contentType: 'text/plain'
        }) as DomoResponse;

        const rows = res?.rows ?? [];
        return rows.map((row) => ({
            User_ID: String(row?.[0] ?? ""),
            total_credits: Number(row?.[1] ?? 0),
        }));
    }


    const value = useMemo(() => {
        return {
            domainCredits,
            topCreditUsers
        };
    }, [domainCredits, topCreditUsers]);

    return (
        <AppContext.Provider
            value={value}
        >
            {children}
        </AppContext.Provider>
    );
};
