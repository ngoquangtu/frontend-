// File: src/CampaignChart.tsx
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { API } from "../common/common";
import { useApi } from "../hooks/api";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface CampaignChartProps {
  campaignId: number;
}

const CampaignChart: React.FC<CampaignChartProps> = ({ campaignId }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const callApi = useApi();

  useEffect(() => {
    if (!campaignId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API thông qua useApi hook
        const response = await callApi(API.GET__SP__TRAFFIC, { campaignId });

        // Chuyển đổi object thành mảng và sắp xếp theo ngày tăng dần
        const campaignData = Object.values(response || {}).sort((a: any, b: any) => new Date(a.hour).getTime() - new Date(b.hour).getTime());

        // Chuyển đổi dữ liệu từ API
        const labels = campaignData.map((item: any) => item.hour);
        const impressionsData = campaignData.map((item: any) => parseInt(item.total_impressions, 10));
        const clicksData = campaignData.map((item: any) => parseInt(item.total_clicks, 10));
        const costData = campaignData.map((item: any) => parseFloat(item.total_cost));

        // Cập nhật dữ liệu cho biểu đồ
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Impressions",
              data: impressionsData,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 5,
            },
            {
              label: "Clicks",
              data: clicksData,
              borderColor: "rgba(255, 159, 64, 1)",
              backgroundColor: "rgba(255, 159, 64, 0.2)",
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 5,
            },
            {
              label: "Cost",
              data: costData,
              borderColor: "rgba(153, 102, 255, 1)",
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 5,
            },
          ],
        });
      } catch (err: any) {
        setError(err.message || "Error fetching data from API");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId]);

  // Định nghĩa kiểu cho `options` bằng cách sử dụng Chart.js typings
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Hourly Campaign Data (Line Chart)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hour",
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
        },
      },
    },
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
};

export default CampaignChart;
