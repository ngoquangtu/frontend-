import React, { useEffect, useState } from 'react';
import { useApi } from "../../hooks/api";
import { API } from '../../common/common';
import Page from '../../components/Page';
import '../css/AmazonCampaignCreate.css'; // Import the CSS file
import { toast } from "react-toastify"; // Import toast
import { InfoList } from "../../components/InfoList";
import { DateTime } from 'luxon';
import styled from "styled-components";
import Placeholder from "../../components/Placeholder";
import { Button } from "antd"

const CampaignItem = styled.div`
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
const AmazonBiddingRule: React.FC = () => {
    const [ruleName, setRuleName] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const[startDayTime,setStartDayTime]= useState<string>('');
    const[endDayTime,setEndDayTime]= useState<string>();
    const [value,setValue]=useState<number>();
    const [profileID, setProfileID] = useState<string>('');
    const [profiles, setProfiles] = useState<{ profileId: string; name: string, countryCode: string }[]>([]);
    const [biddingProfiles,setBiddingProfiles]=useState<{optimizationRuleId:string,ruleName:string}[]>([]);
    const [daysOfWeek,setDayofWeek]=useState<string[]>([]);
    const [type,setType]=useState<string>('DAILY');


    const callApi = useApi(); // Use callApi hook
    type BiddingInfor = {
        optimizationRuleId: string;
        name:string;

    };
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
        const fetchBiddingRule=async()=>
        {
            try
            {
                const repsonse =await callApi(API.GET__BIDDING_ID);
                const profilesData=repsonse.bidding_info.map((p:any)=>
                (
                    {
                        optimizationRuleId:p.optimizationRuleId,
                        ruleName:p.ruleName
                    }
                ));
                setBiddingProfiles(profilesData);
            }
            catch (error) {
                console.error('Error fetching profiles:', error);
                toast.error('Failed to fetch profiles.'); // Toast notification for error
            }
        }

        fetchProfiles(); 
        fetchBiddingRule();
    }, []);
    
    const handleSelectChange = (value:any) => {
        setDayofWeek([]);
        setType(value);  
    };
    


    const handleDayChange = (day: string) => {
        setDayofWeek((prevDays) => 
            prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
        );
    };
    const validateFullHour = (time: string): string => {
        // Regex to check the time format HH:MM
        const timePattern = /^([01]?\d|2[0-3]):([0-5]\d)$/;
    
        // Validate input time format
        if (!timePattern.test(time)) {
            throw new Error("Invalid time format. Use HH:MM.");
        }
    
        // Split the time into hours and minutes
        const [hours, minutes] = time.split(':').map(Number);
    
        // Adjust the minutes to 00 if not already
        return `${String(hours).padStart(2, '0')}:00`;
    };
    const formatDateTime = (date: string) => {
        return `${date}T00:00:00Z`;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formattedStartTime = formatDateTime(startDayTime);
            const formattedEndTime = endDayTime && endTime ? formatDateTime(endDayTime) : undefined;

            const response = await callApi(API.CREATE__BIDDING__RULE, {
                profileID,
                ruleName,
                startTime:validateFullHour(startTime),
                endTime:validateFullHour(endTime),
                startDayTime:formattedStartTime,
                endDayTime:formattedEndTime,
                value,
                type,
                daysOfWeek
            });
            toast.success('Bidding rule created successfully');

            
        } catch (error) {
            console.error('Error creating bidding rule:', error);
            toast.error('Failed to complete the bidding rule creation process.');
        }
    };
    return (
        <Page title="Tạo Bidding Rule">
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Bidding Rule Name"
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        required
                    />
                    <input
                        type="time"
                        placeholder="State Time "
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                    <input
                        type="time"
                        placeholder="End Time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={startDayTime}
                        onChange={(e) => setStartDayTime(e.target.value)}
                        required
                    />  
                   <input
                        type="date"
                        placeholder="End Date"
                        value={endDayTime}
                        onChange={(e) => setEndDayTime(e.target.value)}
                    />
                      <select value={type} onChange={(e) => handleSelectChange(e.target.value)} required>
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                    </select>

                    {/* Days of the Week Selection */}
                    {type === 'WEEKLY' && (
                        <div>
                            <h4>Select Days of the Week:</h4>
                            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => (
                                <label key={day}>
                                    <input
                                        type="checkbox"
                                        checked={daysOfWeek.includes(day)}
                                        onChange={() => handleDayChange(day)}
                                    />
                                    {day}
                                </label>
                            ))}
                        </div>
                    )}
                         
                    <input
                        type="number"
                        placeholder="Value (%)"
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
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
                    <button type="submit">Tạo  Bidding Rule</button>
                </form>
            </div>
        </Page>
    );
};

export default AmazonBiddingRule;
