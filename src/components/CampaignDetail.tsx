// File: src/CampaignChart.tsx
import React, { useState, useEffect } from "react";
import { API } from "../common/common";
import { useApi } from "../hooks/api";

interface CampaignChartProps {
  campaignId: number;
}

type AmazonCampaign = {
  name: string;
  budget: string;
  state: string;
  startDate: string;
  endDate: string | null;
  targeting_type: string;
  strategy: string;
  optimizationRuleId: string | null;
  budgetRuleId: string | null;
  defaultBid: string;
  keywordId: number;
  targetId: number | null;
  keywordText: string;
  matchType: string;
  value: string | null;
};

const CampaignDetailByID: React.FC<CampaignChartProps> = ({ campaignId }) => {
  const callApi = useApi();
  const [campaign, setCampaign] = useState<AmazonCampaign | null>(null);

  useEffect(() => {
    if (!campaignId) return;

    const fetchCampaignById = async () => {
      try {
        const response = await callApi(API.GET__SP__CAMPAIGN__DETAIL, { campaignId });
        if (response && response["0"]) {
          setCampaign(response["0"]);
        }
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      }
    };

    fetchCampaignById();
  }, [campaignId]);

  if (!campaign) {
    return <div>Loading campaign details...</div>;
  }

  return (
    <div>
      <h2>Campaign Details</h2>
      <ul>
        {Object.entries(campaign).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value ? value.toString() : "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignDetailByID;
