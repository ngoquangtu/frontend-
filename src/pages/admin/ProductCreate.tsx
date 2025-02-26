import React, { useEffect, useState } from 'react';
import { useApi } from "../../hooks/api";
import { API } from '../../common/common';
import Page from '../../components/Page';
import '../css/AmazonCampaignCreate.css'; // Import the CSS file
import { toast } from "react-toastify"; // Import toast

const ProductCreate: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [profileID, setProfileID] = useState<string>('');
    const [profiles, setProfiles] = useState<{ profileId: string; name: string, countryCode: string }[]>([]);
    const [asin, setAsin] = useState<string>('');
    const [sku, setSku] = useState<string>('');
    const [status,setStatus]=useState<string>('ACTIVE');
    const [file, setFile] = useState<File | null>(null);
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
                const response = await fetch('https://localhost:5678/reactbp/api/amazon/product/upload-asin', {
                    method: 'POST',
                    body: formData
                });
                const responseData = await response.json();
                if ( responseData.error.msg==='OK.') {
                    toast.success('File uploaded successfully!');
                } else {
                    toast.error('Failed to upload the file: ' + (responseData.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error('Failed to upload the file.');
            }
        };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Create the campaign
            const productResponse = await callApi(API.CREATE__ASIN__SKU, {
                name,
                profileID,
                asin,
                sku,
                status
            });
            if(productResponse.message)
            {
                toast.success('Tạo thành công');
            }
            else
            {
                toast.error('Asin đã tồn tại trong dữ liệu');
            }

        } catch (error) {
            console.error('Error during campaign creation flow:', error);
            toast.error('Failed the product creation process.'); // General error toast
        }
    };

    return (
        <Page title="Tạo Product Amazon">
            <div>
            <form onSubmit={hanleUploadCampaignAvaiable} className="upload-form">
                <select value={profileID} onChange={(e) => setProfileID(e.target.value)} required>
                        <option value="">Chọn Account</option>
                        {profiles.map(profile => (
                            <option key={profile.profileId} value={profile.profileId}>
                                {profile.name} - {profile.countryCode}
                            </option>
                        ))}
                    </select>
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
                    Upload Product Avaiable
                </button>
            </form>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Asin"
                        value={asin}
                        onChange={(e) => setAsin(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="SKU"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        required
                    />
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="ACTIVE">Active</option>
                        <option value="OUT_OF_STOCK">Out_of_stock</option>
                    </select>
                    <select value={profileID} onChange={(e) => setProfileID(e.target.value)} required>
                        <option value="">Chọn Account</option>
                        {profiles.map(profile => (
                            <option key={profile.profileId} value={profile.profileId}>
                                {profile.name} - {profile.countryCode}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Tạo Product</button>
                </form>
            </div>
        </Page>
    );
};
export default ProductCreate;
