import React, { useState, useEffect } from 'react';
import { useApi } from "../../hooks/api";
import Page from '../../components/Page';
import '../css/AmazonCampaignCreate.css';
import { toast } from "react-toastify";
import { API } from '../../common/common';
export default function CampaignUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [profiles, setProfiles] = useState<{ profileId: string; name: string, countryCode: string }[]>([]);
    const [profileID, setProfileID] = useState<string>('');
    const [typeUpload, setTypeUpLoad] = useState<string>('');

    const callApi = useApi();
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };



    const hanleUploadCampaignAvaiable = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
            toast.error('Please select a file to upload.');
            return;
        }
        if (!profileID) {
            toast.error('Please select a profile.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('profileID', profileID);

        try {
            const response = await fetch('https://localhost:5678/reactbp/api/amazon/campaign/upload-available', {
                method: 'POST',
                body: formData
            });
            const responseData = await response.json();
            if (responseData.error.msg === 'OK.') {
                toast.success('File uploaded successfully!');
            } else {
                toast.error('Failed to upload the file: ' + (responseData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload the file.');
        }
    };

    const handleUpdateCampaignReport = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
            toast.error('Please select a file to upload.');
            return;
        }
        if (!profileID) {
            toast.error('Please select a profile.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('profileID', profileID);

        try {
            const response = await fetch('https://localhost:5678/reactbp/api/amazon/campaign/update-available', {
                method: 'POST',
                body: formData
            });
            const responseData = await response.json();
            if (responseData.error.msg === 'OK.') {
                toast.success('File uploaded successfully!');
            } else {
                toast.error('Failed to upload the file: ' + (responseData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload the file.');
        }
    };

    return (
        <Page title="Upload Campaign Report">
            <select value={profileID} onChange={(e) => setProfileID(e.target.value)} required>
                <option value="">Chọn Account</option>
                {profiles.map(profile => (
                    <option key={profile.profileId} value={profile.profileId}>
                        {profile.name} - {profile.countryCode}
                    </option>
                ))}
            </select>
            <div>
                {/* Select between Keyword or Placement */}
                <select value={typeUpload} onChange={e => setTypeUpLoad(e.target.value)}>
                    <option value="">Chọn loại</option>
                    <option value="create">Up campaign có sẵn của khách(Lần đầu tiên )</option>
                    <option value="update">Update report data từ campaign</option>
                </select>
            </div>
            {typeUpload === 'create' && (
                <form onSubmit={hanleUploadCampaignAvaiable} className="upload-form">
                    <div className="form-group">
                        <label htmlFor="file-upload" className="file-upload-label">
                            Select a file:
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            accept=".xlsx, .xls,.csv"
                            onChange={handleFileChange}
                            className="file-upload-input"
                        />
                    </div>
                    <button type="submit" className="upload-button">
                        Upload Campaign Avaiable
                    </button>
                </form>
            )}
            {typeUpload === 'update' && (
                <form onSubmit={handleUpdateCampaignReport} className="upload-form">
                    <div className="form-group">
                        <label htmlFor="file-upload" className="file-upload-label">
                            Select a file:
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            accept=".xlsx, .xls,.csv"
                            onChange={handleFileChange}
                            className="file-upload-input"
                        />
                    </div>
                    <button type="submit" className="upload-button">
                        Update Report Campaign
                    </button>
                </form>
            )}


        </Page>
    );
}
