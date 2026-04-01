import ChartInitializer from "@/components/charts/chart_init";
import { AppContext } from "@/context/appContext";
import { UserContext } from "@/context/currentUserContext";
import type { ApexOptions } from "apexcharts";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { TbChevronRight } from "react-icons/tb";

const LowCreditUsage = () => {
    const [options, setOptions] = useState<ApexOptions | null>(null)
    const app = useContext(AppContext);
    const user = useContext(UserContext);

    useEffect(() => {
        let isMounted = true;

        const loadLowCreditUsers = async () => {
            if (!app) {
                return;
            }

            const data = await app.lowCreditUsers();
            const categories = await Promise.all(data.map((item) => user?.getUserName(item.User_ID) ?? Promise.resolve("")));
            const seriesData = data.map((item) => item.total_credits);

            if (!isMounted) {
                return;
            }

            setOptions({
                chart: {
                    type: "area",
                    toolbar: { show: false },
                    zoom: { enabled: false },
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.45,
                        opacityTo: 0.05,
                        stops: [0, 90, 100],
                    },
                },
                markers: {
                    size: 4,
                    strokeWidth: 0,
                    hover: {
                        size: 6,
                    },
                },
                grid: {
                    strokeDashArray: 4,
                    borderColor: "#fcd34d33",
                },
                stroke: {
                    curve: 'smooth',
                },
                xaxis: {
                    categories,
                    labels: {
                        show: false,
                        rotate: -45,
                    },
                    axisBorder: {
                        show: true,
                    },
                    axisTicks: {
                        show: true,
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
                    y: {
                        formatter: (value) => `${value} credits`,
                    },
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

        void loadLowCreditUsers();

        return () => {
            isMounted = false;
        };
    }, [app]);

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-96 rounded-2xl overflow-hidden border border-amber-200/60 bg-linear-to-br from-white via-amber-50/30 to-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer p-5 flex flex-col justify-between backdrop-blur-sm"
        >
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div>
                {options && <ChartInitializer options={options} />}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-red-500 h-3 w-3 rounded-full" />
                        <h2>Low Credit Users</h2>
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

export default LowCreditUsage
