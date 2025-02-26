import React, { useEffect, useState } from 'react';
import { useApi } from "../../hooks/api";
import { API } from '../../common/common';
import Page from '../../components/Page';
import '../css/AmazonCampaignCreate.css'; // Import the CSS file
import { toast } from "react-toastify"; // Import toast
import styled from "styled-components";
const AmazonBudgetRule: React.FC = () => {
    const [ruleName, setRuleName] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const[startDayTime,setStartDayTime]= useState<string>('');
    const[endDayTime,setEndDayTime]= useState<string>();
    const [value,setValue]=useState<number>();
    const [profileID, setProfileID] = useState<string>('');
    const [profiles, setProfiles] = useState<{ profileId: string; name: string, countryCode: string }[]>([]);
    const [budgetProfiles,setBudgetProfiles]=useState<{budgetRuleIds:string,ruleName:string}[]>([]);
    const [daysOfWeek,setDayofWeek]=useState<string[]>([]);
    const [type,setType]=useState<string>('DAILY');

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
        const fetchBudgetRule=async()=>
        {
            try
            {
                const repsonse =await callApi(API.GET__BUDGET__ID);
                const profilesData=repsonse.budget_infor.map((p:any)=>
                (
                    {
                        budgetRuleIds:p.budgetRuleIds,
                        ruleName:p.ruleName,
                    }
                ));
                setBudgetProfiles(profilesData);
            }
            catch (error) {
                console.error('Error fetching profiles:', error);
                toast.error('Failed to fetch profiles.'); // Toast notification for error
            }
        }

        fetchProfiles(); 
        fetchBudgetRule();
    }, []);
    

    // Fetch campaigns on form submit or when currentPage changes

    const handleDayChange = (day: string) => {
        setDayofWeek((prevDays) => 
            prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
        );
    };
    const formatDate = (date:string) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
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
        return `${String(hours).padStart(2, '0')}:00:00`;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formattedStartTime = formatDate(startDayTime);
            const formattedEndTime = endDayTime && endTime ? formatDate(endDayTime) : undefined;
            const daysOfWeekArray = daysOfWeek.length > 0 ? daysOfWeek : [];
            const response = await callApi(API.CREATE__BUDGET__RULE, {
                profileID,
                name:ruleName,
                startTime:validateFullHour(startTime),
                endTime:validateFullHour(endTime),
                startDate:formattedStartTime,
                endDate:formattedEndTime,
                value:Number(value),
                type
            });
            toast.success('Budget rule created successfully');
        } catch (error) {
            console.error('Error creating bidding rule:', error);
            toast.error('Failed to complete the bidding rule creation process.');
        }
    };
    return (
        <Page title="Tạo Budget Rule">
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Budget Rule Name"
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        required
                    />
                    <input
                        type="time"
                        placeholder="Start Time "
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
                      <select value={type} onChange={(e) => setType(e.target.value)} required>
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
                        placeholder="Value Percentage"
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
                    <button type="submit">Tạo  Budget Rule</button>
                </form>
            </div>
        </Page>
    );
};

export default AmazonBudgetRule;
