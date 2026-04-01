import ApexCharts, { type ApexOptions } from "apexcharts";
import { useEffect, useRef } from "react";

const ChartInitializer = ({ options }: { options: ApexOptions }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<ApexCharts | null>(null);

  useEffect(() => {
    const hasValidConfig = !!options?.chart?.type && Array.isArray(options?.series);
    if (!chartRef.current || !hasValidConfig) {
      return;
    }

    if (instanceRef.current) {
      instanceRef.current.destroy();
    }

    const chart = new ApexCharts(chartRef.current, options);
    instanceRef.current = chart;
    chart.render();

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [options]);

  return (
    <div ref={chartRef}></div>
  )
}

export default ChartInitializer
