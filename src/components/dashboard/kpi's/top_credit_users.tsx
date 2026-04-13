import ChartInitializer from "@/components/charts/chart_init";
import { AppContext } from "@/context/appContext";
import { UserContext } from "@/context/currentUserContext";
import type { ApexOptions } from "apexcharts";
import { useContext, useEffect, useState } from "react";
import { TbTrendingUp } from "react-icons/tb";
import { formatCompactNumber } from "@/lib/utils";
import { motion } from "framer-motion";

const TopCreditUsage = () => {
    const [options, setOptions] = useState<ApexOptions | undefined>()
    const app = useContext(AppContext);
    const user = useContext(UserContext);

    useEffect(() => {
        let isMounted = true;

        const loadTopCreditUsers = async () => {
            if (!app) return;

            const data = await app.topCreditUsers();
            if (!data) return;

            const categories = await Promise.all(
                data.map((item) => user?.getUserName(item.User_ID).then(name => name.split(' ')[0]) ?? Promise.resolve(item.User_ID))
            );
            const seriesData = data.map((item) => item.total_credits);

            if (!isMounted) return;

            setOptions({
                chart: {
                    type: "area",
                    toolbar: { show: false },
                    sparkline: { enabled: true },
                    animations: { enabled: true, speed: 1000 },
                    background: 'transparent'
                },
                stroke: { curve: 'smooth', width: 3, colors: ['#6F2B8B'] },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.5,
                        opacityTo: 0.1,
                        stops: [0, 90, 100],
                        colorStops: [
                            { offset: 0, color: "#6F2B8B", opacity: 0.4 },
                            { offset: 100, color: "#F26722", opacity: 0 }
                        ]
                    }
                },
                xaxis: { categories, labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
                yaxis: { show: false },
                grid: { show: false },
                tooltip: {
                    theme: 'dark',
                    y: { formatter: (val) => `${formatCompactNumber(val)} CR` }
                },
                series: [{ name: "Usage", data: seriesData }],
            });
        };

        void loadTopCreditUsers();
        return () => { isMounted = false; };
    }, [app, user]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative h-56 w-full bg-white border border-primary/5 p-8 flex flex-col overflow-hidden rounded-xl hover:scale-[1.02] transition-all duration-500 shadow-xl hover:bg-white/90"
        >
            <div className="flex items-center justify-between relative z-10 w-full mb-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gwc-gradient text-white flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110">
                        <TbTrendingUp size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-foreground font-heading tracking-tight leading-none capitalize">Power</h2>
                        <p className="text-[10px] font-black text-primary/50 capitalize tracking-[0.15em] mt-2 leading-none">Utilization</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xl font-black text-foreground font-heading italic gwc-text-gradient leading-none capitalize tracking-tighter">Peak</span>
                </div>
            </div>

            <div className="flex-1 w-full relative h-[140px] mt-auto opacity-80 group-hover:opacity-100 transition-opacity">
                <ChartInitializer options={options} loading={app?.dataLoading || false} height={140} />
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
        </motion.div>
    );
};

export default TopCreditUsage;
