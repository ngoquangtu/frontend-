import React, { useEffect, useState } from 'react';
import { useApi } from "../../hooks/api";
import { API } from '../../common/common';
import Page from '../../components/Page';
import '../css/AmazonCampaignCreate.css'; // Import the CSS file
import { toast } from "react-toastify"; // Import toast

const PortfolioCreate: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [profileID, setProfileID] = useState<string>('');
    const [profiles, setProfiles] = useState<{ profileId: string; name: string, countryCode: string }[]>([]);


    const callApi = useApi(); // Use callApi hook

    // Fetch profiles from the API
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await callApi(API.GET__AMAZON__INFOR);
                const profilesData = response.profile.map((p: any) => ({
                    profileId: p.profileId.toString(),
                    name: p.name,
                    countryCode: p.countryCode
                }));
                setProfiles(profilesData);
            } catch (error) {
                console.error('Error fetching profiles:', error);
                toast.error('Failed to fetch profiles.'); // Toast notification for error
            }
        };

        fetchProfiles(); 
    }, []); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Create the campaign
            const productResponse = await callApi(API.CREATE__PORTFOLIO, {
                name,
                profileID,
            });
            if(productResponse.message)
            {
                toast.success('Tạo thành công');
            }
            else
            {
                toast.error('Portfolio đã tồn tại trong dữ liệu');
            }
        } catch (error) {
            console.error('Error during campaign creation flow:', error);
            toast.error('Failed create portfolio .'); // General error toast
        }
    };

    return (
        <Page title="Tạo Product  Amazon">
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Campaign Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <select value={profileID} onChange={(e) => setProfileID(e.target.value)} required>
                        <option value="">Chọn Account</option>
                        {profiles.map(profile => (
                            <option key={profile.profileId} value={profile.profileId}>
                                {profile.name} - {profile.countryCode}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Tạo Portfolio</button>
                </form>
            </div>
        </Page>
    );
};
export default PortfolioCreate;
