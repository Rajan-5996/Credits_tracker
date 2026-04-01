import { AppContext } from "@/context/appContext";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";

const DomainCredits = ({
    name,
    url,
}: {
    name?: string;
    url?: string;
}) => {
    const app = useContext(AppContext);
    const [credits, setCredits] = useState<string>("0");

    useEffect(() => {
        const res = app?.domainCredits();
        if (res) {
            res.then((creditValue) => {
                setCredits(Number(creditValue).toFixed(0).toLocaleString());
            });
        }
    }, [app])

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-96 rounded-2xl overflow-hidden border border-amber-200/60 bg-linear-to-br from-white via-amber-50/30 to-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer p-5 flex flex-col justify-between backdrop-blur-sm"
        >
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center gap-4 relative z-10">
                <img
                    src="Logo.svg"
                    alt="Domain Logo"
                    height={30}
                    width={30}
                    className="object-cover transition-all duration-500 hover:scale-110 hover:rotate-3"
                />

                <div className="flex flex-col overflow-hidden flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 leading-tight truncate tracking-tight">
                        {name ?? "Gwc data.ai"}
                    </h2>

                    <div className="flex items-center gap-1 mt-1.5">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m3.172-3.172a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.102" />
                        </svg>
                        <p className="text-xs text-gray-500 truncate hover:text-gray-700 transition-colors">
                            {url ?? "https://gwcteq-partner.domo.com/"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="my-4 h-px bg-linear-to-r from-transparent via-amber-300 to-transparent relative z-10" />

            <div className="flex items-center justify-end relative z-10">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold bg-linear-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                        {credits}
                    </span>
                    <span className="text-xs text-gray-500">credits</span>
                </div>
            </div>

            <div className="absolute inset-0 pointer-events-none rounded-2xl bg-linear-to-br from-amber-500/0 via-amber-500/0 to-amber-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(251,191,36,0.1)]" />
        </motion.div>
    );
};

export default DomainCredits;