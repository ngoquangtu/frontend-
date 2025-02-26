import React, { useEffect, useState } from 'react';
import { useApi } from "../../hooks/api";
import { API } from '../../common/common';
import { toast } from "react-toastify";
import Page from "../../components/Page";
import Placeholder from "../../components/Placeholder";
import styled from "styled-components"; // Import styled-components
import { InfoList } from "../../components/InfoList";
const ProfileItem = styled.div`
    border: 1px solid #e0e0e0; /* Đường viền xung quanh mỗi profile */
    border-radius: 8px; /* Bo góc */
    padding: 16px; /* Khoảng cách bên trong */
    margin-bottom: 16px; /* Khoảng cách giữa các profile */
    background-color: #ffffff; /* Màu nền trắng */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
    transition: transform 0.2s; /* Hiệu ứng khi hover */

    &:hover {
        transform: scale(1.02); /* Tăng kích thước một chút khi hover */
    }
`;

type AmazonProfile = {
  profileId: number;
  countryCode: string;
  currencyCode: string;
  name: string;
  validPaymentMethod: number;
  type: string;
  marketplaceStringId: string;
  user_id: number;
};

export default function AmazonProfile() {
  const [profiles, setProfiles] = useState<AmazonProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const callApi = useApi();

  useEffect(() => {
    const fetchAmazonProfiles = async () => {
      try {
        const response = await callApi(API.GET__AMAZON__INFOR);
        if (response.error.code === 0) {
          setProfiles(response.profile);
        } else {
          setError(response.error.msg);
        }
      } catch (err) {
        setError('Lỗi khi gọi API');
      }
    };

    fetchAmazonProfiles();
  }, []);

  return (
    <Page title="Danh sách Profiles Amazon">
        {profiles.length > 0 ? (
            profiles.map(profile => (
                <ProfileItem key={profile.profileId}>
                    <InfoList list={[
                            { key: 'Name', value: profile.name },
                            { key: 'Profile ID', value: profile.profileId },
                            { key: 'Country Code', value: profile.countryCode },
                            { key: 'Currency Code', value: profile.currencyCode },
                            { key: 'Type',value: profile.type },
                            { key: 'Market ID', value: profile.marketplaceStringId },
                        ]} />
                </ProfileItem>
            ))
        ) : (
            <Placeholder />
        )}
    </Page>
);
}
