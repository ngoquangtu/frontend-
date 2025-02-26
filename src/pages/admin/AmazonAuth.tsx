import { useState } from "react";
import Page from "../../components/Page";
import { API, Roles } from "../../common/common";
import { useAuth } from "../../hooks/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd"
// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const handleAmazonLogin = () => {
    window.location.href = "https://www.amazon.com/ap/oa?scope=advertising::campaign_management&response_type=code&client_id=amzn1.application-oa2-client.53558619f91944a1b9387202ff49a932&state=State&redirect_uri=https://localhost:5678/reactbp/api/amazon/get-token"
  };

  return (
    <Page title="Đăng nhập Amazon">
          <div className="mt-4 mb-4">
            <Button className="btn btn-outline btn-accent" onClick={handleAmazonLogin}>
              Đăng nhập Amazon
            </Button>
          </div>
    </Page>
  );
}
