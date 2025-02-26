// File: src/CampaignDetail.tsx
import React, { useEffect, useState } from "react";
import CampaignChart from "../../components/Chart";
import { useParams } from "react-router-dom";
import CampaignDetailByID from "../../components/CampaignDetail";



const CampaignDetail: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();

  if (!campaignId) {
    return <p>Campaign ID is missing!</p>;
  }

  
  return (
    <div>
        <CampaignChart campaignId={parseInt(campaignId, 10)} />
        <CampaignDetailByID campaignId={parseInt(campaignId, 10)} />
    </div>
  );
};


export default CampaignDetail;