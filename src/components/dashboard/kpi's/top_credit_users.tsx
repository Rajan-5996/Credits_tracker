import ChartInitializer from "@/components/charts/chart_init";
import { AppContext } from "@/context/appContext";
import { UserContext } from "@/context/currentUserContext";
import type { ApexOptions } from "apexcharts";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { TbChevronRight } from "react-icons/tb";

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
                dataLabels: {
                    enabled: false,
                },
                tooltip: {
                    enabled: true,
                },
                colors: ["#d97706"],
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
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-96 rounded-2xl overflow-hidden border border-amber-200/60 bg-linear-to-br from-white via-amber-50/30 to-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer p-5 flex flex-col justify-between backdrop-blur-sm"
        >
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div>
                <ChartInitializer options={options} loading={app?.dataLoading || false} />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-amber-500 h-3 w-3 rounded-full" />
                        <h2>Top Credit Users</h2>
                    </div>

                    <div className="group flex items-center gap-2 cursor-pointer transition-all duration-200">
                        <h1 className="group-hover:underline">
                            view All
                        </h1>
                        <TbChevronRight />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default TopCreditUsage
