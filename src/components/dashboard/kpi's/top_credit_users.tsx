import ChartInitializer from "@/components/charts/chart_init";
import { AppContext } from "@/context/appContext";
import { UserContext } from "@/context/currentUserContext";
import type { ApexOptions } from "apexcharts";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { TbChevronRight } from "react-icons/tb";
import { formatCompactNumber } from "@/lib/utils";

const TopCreditUsage = () => {
    const [options, setOptions] = useState<ApexOptions | undefined>()
    const app = useContext(AppContext);
    const user = useContext(UserContext);

    useEffect(() => {
        let isMounted = true;

        const loadTopUsers = async () => {
            if (!app) {
                return;
            }

            const data = await app.topCreditUsers();
            const categories = await Promise.all(data.map((item) => user?.getUserName(item.User_ID) ?? Promise.resolve("")));
            const seriesData = data.map((item) => item.total_credits);

            if (!isMounted) {
                return;
            }

            setOptions({
                chart: {
                    type: "bar",
                    toolbar: { show: false },
                },
                xaxis: {
                    categories,
                    labels: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                },
                yaxis: {
                    labels: {
                        show: false,
                    },
                },
                grid: {
                    show: false,
                },
                dataLabels: {
                    enabled: false,
                },
                tooltip: {
                    enabled: true,
                    y: {
                        formatter: (val) => formatCompactNumber(val)
                    }
                },
                colors: ["#7030B1"],
                series: [
                    {
                        name: "Credits",
                        data: seriesData,
                    },
                ],
            });
        };

        void loadTopUsers();

        return () => {
            isMounted = false;
        };
    }, [app, user]);

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative h-64 w-full min-w-80 rounded-md overflow-hidden border border-white/40 bg-white/60 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer p-5 flex flex-col justify-between backdrop-blur-xl"
        >
            <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500" />

            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-red-500 h-3.5 w-3.5 rounded-full" />
                        <h2 className="text-base font-bold text-foreground tracking-tight capitalize">Top Credit Users</h2>
                    </div>

                    <div className="flex items-center gap-1 text-primary opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider">view All</span>
                        <TbChevronRight className="text-base" />
                    </div>
                </div>
                <div className="flex-1 min-h-0 bg-primary/5 rounded-2xl overflow-hidden mt-1">
                    <ChartInitializer options={options} loading={app?.dataLoading || false} height={180} />
                </div>
            </div>
        </motion.div>
    )
}


export default TopCreditUsage
