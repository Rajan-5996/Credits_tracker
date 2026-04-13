import { AppContext } from "@/context/appContext";
import { useContext, useEffect, useState } from "react";
import { TbUsers, TbActivity } from "react-icons/tb";
import { motion } from "framer-motion";

const TotalUsersKpi = () => {
    const app = useContext(AppContext);
    const [totalUsers, setTotalUsers] = useState<number>(0);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await app?.userTableData();
            if (users) {
                setTotalUsers(users.length);
            }
        };
        void fetchUsers();
    }, [app]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative h-56 w-full bg-white border border-primary/5 p-8 flex flex-col justify-between overflow-hidden rounded-xl hover:scale-[1.02] transition-all duration-500 shadow-xl hover:bg-white/90"
        >
            <div className="flex items-center justify-between relative z-20 w-full">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-secondary text-primary flex items-center justify-center shadow-md group-hover:-rotate-12 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <TbUsers size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-foreground font-heading tracking-tight leading-none capitalize">Registry</h2>
                        <p className="text-[10px] font-black text-primary/40 capitalize tracking-[0.2em] mt-2 leading-none">Intelligence nodes</p>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full gwc-gradient p-0.5 animate-spin-slow shadow-lg shadow-primary/20">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <TbActivity size={16} className="text-primary" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col relative z-20 pt-5 border-t border-primary/10">
                <span className="text-[10px] font-black text-primary/40 capitalize tracking-widest block mb-1">Active nodes indexed</span>
                <div className="flex items-baseline gap-3">
                    <span className="text-foreground text-3xl font-black font-heading tracking-tight leading-none">
                        {totalUsers}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100/50">
                        <span className="text-emerald-600 font-black text-[10px] leading-none">+12.5%</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[10px] font-black text-emerald-500 capitalize tracking-widest leading-none">Synchronized</span>
                    </div>
                    <span className="text-[9px] font-black text-primary/20 capitalize tracking-widest leading-none">REAL-TIME</span>
                </div>
            </div>

            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-accent/5 rounded-full blur-[80px] pointer-none opacity-50" />
        </motion.div>
    );
};

export default TotalUsersKpi;
