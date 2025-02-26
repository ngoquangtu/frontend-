import React, { useEffect, useState } from 'react';
import { useApi } from "../../hooks/api";
import { API } from '../../common/common';
import Page from '../../components/Page';
import '../css/AmazonCampaignCreate.css';
import { toast } from "react-toastify";
import Placeholder from "../../components/Placeholder";
import styled from "styled-components";
import { InfoList } from "../../components/InfoList";

const Container = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    margin-bottom: 8px;
    font-weight: 500;
`;

const Input = styled.input`
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    &:focus {
        border-color: #00bcd4;
    }
`;

const Select = styled.select`
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    &:focus {
        border-color: #00bcd4;
    }
`;

const Button = styled.button`
    padding: 12px 20px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    background-color: #00bcd4;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
        background-color: #0097a7;
    }
    &:disabled {
        background-color: #ddd;
        cursor: not-allowed;
    }
    &:not(:last-child) {
        margin-right: 10px;
    }
`;

const ProfileItem = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.02);
    }
`;

const AmazonReport: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [profileID, setProfileID] = useState<string>('');
    const [profiles, setProfiles] = useState<{ profileId: string; name: string, countryCode: string }[]>([]);
    const [reportName, setReportName] = useState<string>('');
    const [reportProfile, setReportProfile] = useState<{ reportId: string; status: string; url: string; name: string }[]>([]);
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
                toast.error('Failed to fetch profiles.');
            }
        };
        fetchProfiles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const campaignResponse = await callApi(API.CREATE__REPORT, {
                profileID,
                name,
                startDate,
                endDate,
            });
            toast.success(`Campaign created successfully: ${campaignResponse.campaignId}`);
        } catch (error) {
            console.error('Error during campaign creation flow:', error);
            toast.error('Failed to complete the campaign creation process.');
        }
    };

    const getReportInfor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await callApi(API.GET__REPORT__STATUS);
            const reportResponse = await callApi(API.GET__REPORT, { name: reportName });
            const reportsData = reportResponse.reports.map((r: any) => ({
                reportId: r.reportId.toString(),
                name: r.name,
                status: r.status,
                url: r.url
            }));
            setReportProfile(reportsData);
            toast.success('Report information fetched successfully.');
        } catch (err) {
            console.error('Error fetching report information:', err);
            toast.error('Failed to get report.');
        }
    };

    const deleteReport = async () => {
        try {
            await callApi(API.DELETE__EXPIRES__REPORT);
            toast.success('Expired reports deleted successfully.');
        } catch (err) {
            console.error('Error deleting expired reports:', err);
            toast.error('Failed to delete reports.');
        }
    }

    return (
        <Page title="Create Amazon Report by Date">
            <Container>
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Report Name</Label>
                        <Input
                            type="text"
                            placeholder="Report Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Start Date</Label>
                        <Input
                            type="date"
                            placeholder="Start Date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>End Date</Label>
                        <Input
                            type="date"
                            placeholder="End Date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Select Account</Label>
                        <Select value={profileID} onChange={(e) => setProfileID(e.target.value)} required>
                            <option value="">Select Account</option>
                            {profiles.map(profile => (
                                <option key={profile.profileId} value={profile.profileId}>
                                    {profile.name} - {profile.countryCode}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                    <Button type="submit">Create Report</Button>
                </form>

                <form onSubmit={getReportInfor}>
                    <FormGroup>
                        <Label>Search Report</Label>
                        <Input
                            type="text"
                            placeholder="Report Name"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                        />
                    </FormGroup>
                    <Button type="submit">Search Report</Button>
                </form>

                {reportProfile.length > 0 ? (
                    reportProfile.map(report => (
                        <ProfileItem key={report.reportId}>
                            <InfoList list={[
                                { key: 'Report Name:', value: report.name },
                                { key: 'Report Status', value: report.status },
                            ]} />
                           <button onClick={() => window.open(report.url, '_blank')}>
                                Download Report
                            </button>
                        </ProfileItem>
                    ))
                ) : <Placeholder />}

                <Button onClick={deleteReport}>Delete Expired Reports</Button>
            </Container>
        </Page>
    );
}

export default AmazonReport;
