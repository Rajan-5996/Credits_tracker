import { AppContext } from "@/context/appContext";
import { useContext, useEffect, useState } from "react";
import { formatCompactNumber } from "@/lib/utils";
import { TbGlobe } from "react-icons/tb";
import { motion } from "framer-motion";

const DomainCredits = () => {
    const app = useContext(AppContext);
    const [credits, setCredits] = useState<number>(0);
    const domainName = "Gwc intelligence";

    useEffect(() => {
        let isMounted = true;
        const fetchCredits = async () => {
            try {
                if (app?.domainCredits) {
                    const val = await app.domainCredits();
                    if (isMounted && val !== undefined) {
                        setCredits(Number(val));
                        return;
                    }
                }
            } catch (error) {
                console.error("DomainCredits fetch error:", error);
            }
        };
        void fetchCredits();
        return () => { isMounted = false; };
    }, [app]);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="group relative h-56 w-full bg-white border border-primary/5 p-7 flex flex-col justify-between overflow-hidden rounded-xl hover:scale-[1.02] transition-all duration-500 shadow-xl hover:bg-white/90"
        >
            <div className="flex items-center justify-between relative z-20">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <TbGlobe size={28} />
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/50">
                    <span className="text-[10px] font-black text-emerald-600 capitalize tracking-widest leading-none">Active</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                </div>
            </div>

            <div className="flex flex-col justify-end flex-1 relative z-20 mt-2">
                <div className="mb-2">
                    <span className="text-[9px] font-black text-primary/40 capitalize tracking-[0.25em] block mb-1">Intelligence domain</span>
                    <h2 className="text-xl font-black text-foreground font-heading tracking-tight leading-none truncate gwc-text-gradient capitalize">
                        {domainName}
                    </h2>
                </div>
                
                <div className="flex flex-col border-t border-primary/10 pt-3">
                    <span className="text-[9px] font-black capitalize tracking-[0.2em] text-primary/40 mb-2">
                        Total consumption
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-foreground text-3xl font-black font-heading tracking-tighter leading-none">
                            {formatCompactNumber(credits) || "0"}
                        </span>
                        <span className="text-primary/60 font-black text-[10px] capitalize tracking-widest leading-none">
                            Credits
                        </span>
                    </div>
                </div>
            </div>

            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-primary/10 rounded-full blur-[70px] pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-[60px] pointer-events-none opacity-20" />
        </motion.div>
    );
};

export default DomainCredits;
