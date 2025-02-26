import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useApi } from "../../hooks/api";
import { API } from "../../common/common";

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

interface DesignerStats {
  EmployeeName: string;
  TotalMissions: number;
  TotalEarnings: number;
  Month: number;
  Year: number;
}

const DashBoard: React.FC = () => {
  const callApi = useApi();
  const [designerStats, setDesignerStats] = useState<DesignerStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const fetchDesignerStats = async () => {
      setLoading(true);
      try {
        const response = await callApi(API.CALCULATE__DESIGNER,{
            month,
            year
        });
        setDesignerStats(response.result);
      } catch (error) {
        console.error("Error fetching designer statistics:", error);
        toast.error("Error fetching designer statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDesignerStats();
  }, [ month, year]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4 flex items-center space-x-4">
        <div>
          <label htmlFor="month" className="block font-medium">
            Month
          </label>
          <select
            id="month"
            className="border border-gray-300 rounded p-2"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, index) => (
  <option key={index + 1} value={index + 1}>
    {index + 1}
  </option>
))
}
          </select>
        </div>
        <div>
          <label htmlFor="year" className="block font-medium">
            Year
          </label>
          <input
            id="year"
            type="number"
            className="border border-gray-300 rounded p-2"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : designerStats.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">#</th>
              <th className="border border-gray-300 p-2">Employee Name</th>
              <th className="border border-gray-300 p-2">Total Missions</th>
              <th className="border border-gray-300 p-2">Total Earnings</th>
              <th className="border border-gray-300 p-2">Month</th>
              <th className="border border-gray-300 p-2">Year</th>
            </tr>
          </thead>
          <tbody>
            {designerStats.map((stat, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 p-2">{stat.EmployeeName}</td>
                <td className="border border-gray-300 p-2 text-center">{stat.TotalMissions}</td>
                <td className="border border-gray-300 p-2 text-right">
                  {stat.TotalEarnings} $
                </td>
                <td className="border border-gray-300 p-2 text-center">{stat.Month}</td>
                <td className="border border-gray-300 p-2 text-center">{stat.Year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No data available for the selected month and year.</div>
      )}
    </div>
  );
};

export default DashBoard;
