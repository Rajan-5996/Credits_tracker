import { AppContext } from "@/context/appContext";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { formatCompactNumber } from "@/lib/utils";

import { GiPayMoney } from "react-icons/gi";

const DomainCredits = ({
    name = "Instance Usage",
    url = "https://gwcteq-partner.domo.com/",
}: {
    name?: string;
    url?: string;
}) => {
    const app = useContext(AppContext);
    const [credits, setCredits] = useState<number>(0);

    useEffect(() => {
        const res = app?.domainCredits();
        if (res) {
            res.then((creditValue) => {
                setCredits(Number(creditValue));
            });
        }
    }, [app])

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative h-64 w-full min-w-80 rounded-md overflow-hidden border border-white/40 bg-white/60 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer p-5 flex flex-col justify-between backdrop-blur-xl"
        >
            <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />

            <div className="flex items-center gap-3 relative z-10">
                <GiPayMoney
                    size={35}
                    className="text-[#7030B1]"
                    style={{
                        fill: 'url(#icon-gradient)',
                        filter: 'drop-shadow(0 2px 4px rgba(112, 48, 177, 0.2))'
                    }}
                />
                <svg width="0" height="0" className="absolute">
                    <linearGradient id="icon-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop stopColor="#7030B1" offset="0%" />
                        <stop stopColor="#B56DD3" offset="50%" />
                        <stop stopColor="#F99C5D" offset="100%" />
                    </linearGradient>
                </svg>


                <div className="flex flex-col overflow-hidden flex-1">
                    <h2 className="text-lg font-bold text-foreground leading-tight truncate tracking-tight capitalize">
                        {name}
                    </h2>

                    <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <p className="text-[10px] font-bold text-muted-foreground truncate capitalize tracking-widest opacity-60">
                            {url.replace("https://", "")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col relative z-10 mt-auto">
                <span
                    style={{ color: 'rgb(112, 48, 176)' }}
                    className="text-[0.6rem] font-black uppercase tracking-[0.2em] leading-none mb-1.5 ml-1 opacity-70"
                >
                    Accumulated Consumption
                </span>
                <div className="flex items-baseline gap-2 font-outfit">
                    <span
                        style={{
                            backgroundImage: 'linear-gradient(135deg, #7030B1 0%, #B56DD3 45%, #F99C5D 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                        className="text-6xl font-black tracking-tighter drop-shadow-sm"
                    >
                        {formatCompactNumber(credits)}
                    </span>
                    <span
                        style={{
                            backgroundImage: 'linear-gradient(135deg, #7030B1 0%, #B56DD3 45%, #F99C5D 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                        className="text-sm font-black uppercase tracking-tighter opacity-90 drop-shadow-sm"
                    >
                        Credits
                    </span>
                </div>
            </div>

            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.62-.26-3.23-1.08-4.47-2.45l1.49-1.49c1 1.03 2.1 1.61 3.25 1.73v-3.08L7.43 11.8c-1.39-.77-2.02-2.21-2.02-3.32 0-2.2 1.65-3.89 3.86-4.3V2h2.82v2.19c1.21.2 2.34.8 3.39 1.62l-1.56 1.56c-.84-.52-1.66-.75-2.45-.82v2.85l3.43.91c1.58.42 2.6 1.83 2.6 3.42 0 2.25-1.55 3.96-3.86 4.31l.01.2zM10.82 10.7V8.16c-.53.13-.9.46-.9.84.01.44.37.76.9.84l3.18-.84v2.79c.65-.21 1.1-.64 1.1-1.12s-.47-1.12-1.15-1.3l-3.18.84-2.26 1.51L10.82 10.7z" />
                </svg>
            </div>
        </motion.div>
    );
};

export default DomainCredits;
