import React, { useEffect, useState } from 'react';
import { useApi } from "../../hooks/api";
import { API } from '../../common/common';
import { toast } from "react-toastify";
import Page from "../../components/Page";
import Placeholder from "../../components/Placeholder";
import styled from "styled-components";
import { InfoList } from "../../components/InfoList";
import { DateTime } from 'luxon';
import { useNavigate } from "react-router-dom";
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

const ConfirmDialog = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;
const FilterInput = styled.input`
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    width: 10%;
`;

const ConditionSelect = styled.select`
    padding: 8px;
    margin-left: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    width: 10%;
    margin-right:10px;
`;
const getStrategyDisplayName = (strategy:string) => {
    switch (strategy) {
        case 'LEGACY_FOR_SALES':
            return 'Down Only';
        case 'AUTO_FOR_SALES':
            return 'Up and Down';
        case 'MANUAL':
            return 'Fixed Bid';
        case 'RULE_BASED':
            return 'Rule Base';
        default:
            return 'Unknown Strategy';
    }
};


const getPlacementName = (strategy:string) => {
    switch (strategy) {
        case 'PLACEMENT_TOP':
            return 'Top of Search';
        case 'PLACEMENT_REST_OF_SEARCH':
            return 'Rest of Search';
        case 'MANUAL':
            return 'Rule Base';
        case 'PLACEMENT_PRODUCT_PAGE':
            return 'Product Page';
        default:
            return 'None';
    }
};

export type AmazonCampaign = {
    keywordId:string;
    placement_sale: any;
    placement_impression: any;
    placement_click: any;
    placement_spend: any;
    placement_roas: any;
    placement_type: string;
    campaignId: string;
    profileId: string;
    name: string;
    state: string;
    budget: number;
    budgetType: string;
    startDate: string;
    endDate: string;
    targeting_type: string;
    percentage: number;
    placement: string;
    strategy: string;
    ROAS:number,
    click:number,
    spend:number,
    order:number,
    sale:number,
    ACOS:number,
    CPC:number,
    impression:number,
    matchType:string,
    type:string,
    targetId:string,
    bid:number
};

export default function AmazonCampaignList() {
    const navigateTo = useNavigate();

    const [campaigns, setCampaigns] = useState<AmazonCampaign[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [campaignToDelete, setCampaignToDelete] = useState<{ campaignId: string; profileId: string } | null>(null);
    const [filteredCampaigns, setFilteredCampaigns] = useState<AmazonCampaign[]>([]);
    const [filterName, setFilterName] = useState<string>('');
    const [filterClick, setFilterClick] = useState<string>('');
    const [filterClickCondition, setFilterClickCondition] = useState<string>('eq');
    const [filterSpend, setFilterSpend] = useState<string>('');
    const [filterSpendCondition, setFilterSpendCondition] = useState<string>('eq');
    const [filterACOS, setFilterACOS] = useState<string>('');
    const [filterACOSCondition, setFilterACOSCondition] = useState<string>('eq');
    const [filterROAS, setFilterROAS] = useState<string>('');
    const [filterROASCondition, setFilterROASCondition] = useState<string>('eq');
    const [filterCPC, setFilterCPC] = useState<string>('');
    const [filterCPCCondition, setFilterCPCCondition] = useState<string>('eq');
    const [filterOrder, setFilterOrder] = useState<string>('');
    const [filterOrderCondition, setFilterOrderCondition] = useState<string>('eq');
    const [state,setStateFilter]=useState<string>('ENABLED');
    const [matchType,setMatchType]=useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [placement,setPlacement]=useState<string>('');

    const [profiles, setProfiles] = useState<{ profileId: string; name: string, countryCode: string }[]>([]);
    const [biddingProfiles,setBiddingProfiles]=useState<{optimizationRuleId:string,ruleName:string}[]>([]);
    const [selectedOptimizationRuleIds, setSelectedOptimizationRuleIds] = useState<{ [campaignId: string]: string }>({});

    const [budgetProfiles,setBudgetProfiles]=useState<{budgetRuleIds:string,ruleName:string}[]>([]);
    const [selectedBudgetRuleIds, setSelectedBudgetRuleIds] = useState<{ [campaignId: string]: string }>({});
    const [selectedBudgetRuleId,setSelectedBudgetRuleId]=useState<string>('');
    const [selectedBiddingRule,setSelectedBiddingRule]=useState<string>('');

    const [selectedplacementTop,setSelectedPlacementTop]=useState<number>(0);
    const [selectedplacementProduct,setSelectedProduct]=useState<number>(0);
    const [selectedplacementRest,setSelectedRest]=useState<number>(0);
    const [showPanel, setShowPanel] = useState(false);
    const [selectedfilterPlacementorKeyword,setSelectedfilterPlacementorKeyword]=useState<string>('');
    const [adjustbidType,setAdjustbidType]=useState<string>('');
    const [bidtarget,setBidTarget]=useState<number>(0);
    const [profileID, setProfileID] = useState<string>('');
    const [portfolioArray,setPortfolioArray]=useState<{portfolioId:string,name:string}[]>([]);
    const [portfolioId,setPortfolioId]=useState<string>('');
    
    const [isfetchAll,setFetchAll]=useState<boolean>(false);

    const callApi = useApi();


    useEffect(() => {
        if (selectedfilterPlacementorKeyword === 'keyword') {
            setPlacement(''); 
        }
        else if(selectedfilterPlacementorKeyword === 'placement')
        {
            setMatchType('');
        }
    }, [selectedfilterPlacementorKeyword]);
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
        fetchBiddingRule();
        fetchBudgetRule();
    }, []);
    useEffect(()=>
    {
        const fetchPortfolio=async(profileID:string)=>
            {
                try
                {
                    const response=await callApi(API.GET_PORTFOLIO_ID,{profileID});
                    const portfolioData=response.response.map((p: any) => ({
                        profileId:p.profileId,
                        portfolioId:p.portfolioId,
                        name:p.name,
                    }));
                    setPortfolioArray(portfolioData);
                }
                catch(err)
                {
                    toast.error('Lỗi hệ thống');
                }
            }
            fetchPortfolio(profileID);
    },[profileID]);
    const applyBiddingRule=async(profileID:string,campaignId:string,optimizationRuleIds:string)=>
        {
            try
            {
                const response = await callApi(API.APPLY__BIDING_RULE, {
                    profileID,
                    campaignId,
                    optimizationRuleIds
                });
                if(response)
                {
                    
                    toast.success('Apply bidding rule successfuly');
                }
            }
            catch(error)
            {
                toast.error('Error apply bidding rule to campaign ');
            }
        };
        const applyBudgetRule=async(profileID:string,campaignId:string,budgetRuleIds:string)=>
            {
                try
                {
                    const response = await callApi(API.APPLY__BUDGET_RULE, {
                        profileID,
                        campaignId,
                        budgetRuleIds
                    });
                    if(response)
                    {
                        
                        toast.success('Apply budget rule successfuly');
                    }
                }
                catch(error)
                {
                    toast.error('Error apply budget rule to campaign ');
                }
            };
        const updatePlacementRule=async(profileID:string,campaignId:string,selectedplacementTop:number,selectedplacementRest:number,selectedplacementProduct :number)=>
        {
            try
            {
                const response = await callApi(API.UPDATE__PLACEMENT__RULE, {
                    profileID,
                    campaignId,
                    percentage_top:selectedplacementTop,
                    percentage_rest:selectedplacementRest,
                    percentage_page:selectedplacementProduct
                });
                if(response)
                {
                    toast.success('Apply budget rule successfuly');
                }
            }
            catch(error)
            {
                toast.error('Error apply budget rule to campaign ');
            }
        };
    const handleOptimizationRuleChange = (campaignId: string, optimizationRuleId: string) => {
            setSelectedOptimizationRuleIds(prev => ({
                ...prev,
                [campaignId]: optimizationRuleId
            }));
        };
    const handleBudgetRuleChange = (campaignId: string, budgetRuleIds: string) => {
        setSelectedBudgetRuleIds(prev => ({
                ...prev,
                [campaignId]: budgetRuleIds
            }));
        };
    
    const fetchAmazonCampaigns = async (page: number) => {
        try {
            setLoading(true);
            setCampaigns([]);

            const response = await callApi(API.GET__LIST__CAMPAIGNS_DTB, {
                name: filterName,
                click: filterClick,
                clickCondition: filterClickCondition,
                spend: filterSpend,
                spendCondition: filterSpendCondition,
                ACOS: filterACOS,
                ACOSCondition: filterACOSCondition,
                ROAS: filterROAS,
                ROASCondition: filterROASCondition,
                CPC: filterCPC,
                CPCCondition: filterCPCCondition,
                order: filterOrder,
                orderCondition: filterOrderCondition,
                page:currentPage,
                state,
                matchType,
                placement,
                pageSize: 10,
                profileID,
                portfolioId,
                fetchAll:isfetchAll
            });

            // Check if response data is valid
            if (response.data && Array.isArray(response.data)) {
                
                setCampaigns(response.data);
                setTotalItems(response.pagination.totalItems);
                
            } else {
                setError('No campaigns found');
                toast.warn('No campaigns found');
            }
        } catch (err) {
            console.error('Error during API call:', err);
            setError('Error fetching campaigns');
            toast.error('Error fetching campaigns');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async () => {
        if (campaignToDelete) {
            try {
                await callApi(API.DELETE__SP__CAMPAIGNS, {
                    campaignId: campaignToDelete.campaignId, 
                    profileID: campaignToDelete.profileId 
                });
                toast.success('Campaign deleted successfully');
                fetchAmazonCampaigns(currentPage);
                setConfirmDialogOpen(false);
                setCampaignToDelete(null); 
            } catch (err) {
                console.error('Error deleting campaign:', err);
                toast.error('Failed to delete campaign');
            }
        }
    };

    const openConfirmDialog = (campaignId: string, profileId: string) => {
        setCampaignToDelete({ campaignId, profileId });
        setConfirmDialogOpen(true);
    };

    const closeConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setCampaignToDelete(null);
    };

    const handleUpdate = async (campaignId: string, profileID: string) => {
        try {
            const response = await callApi(API.UPDATE__SP__CAMPAIGNS, {
                campaignId,
                profileID
            });

            if (response && response.error && response.error.length > 0) {
                throw new Error('Update failed');
            }
            toast.success('Campaign updated successfully');
            fetchAmazonCampaigns(currentPage); 
        } catch (err) {
            console.error('Error updating campaign:', err);
            toast.error('Failed to update campaign');
        }
    };
    const ApplyBidKeyWord= async (profileID:string,keywordId:string,bid:number)=>
    {
        try {
            const response = await callApi(API.UPDATE__CAMPAIGN__BIDDING__KEYWORD, {
                profileID,
                keywordId,
                bid
            });

            if (response && response.error && response.error.length > 0) {
                throw new Error('Update failed');
            }
            toast.success('Campaign updated bid successfully');
        } catch (err) {
            console.error('Error updating campaign:', err);
            toast.error('Failed to update campaign');
        }
    };
    const ApplyBidTarget= async (profileID:string,targetId:string,bid:number)=>
    {
        try {
            const response = await callApi(API.UPDATE__CAMPAIGN__BIDDING__TARGETING, {
                profileID,
                targetId,
                bid
            });

            if (response && response.error && response.error.length > 0) {
                throw new Error('Update failed');
            }
            toast.success('Campaign updated bid successfully');
        } catch (err) {
            console.error('Error updating campaign:', err);
            toast.error('Failed to update campaign');
        }
    };

    useEffect(() => {
        fetchAmazonCampaigns(currentPage);
    }, [isfetchAll,profileID,portfolioId,selectedfilterPlacementorKeyword,placement,state,matchType,filterName, filterClick, filterSpend, filterACOS, filterROAS, filterCPC, filterOrder,currentPage,filterClickCondition,filterSpendCondition,filterACOSCondition,filterROASCondition,filterCPCCondition,filterOrderCondition]);

    return (
        <Page title="Danh sách Campaigns Amazon">
            <div>
            <select value={profileID} onChange={(e) => setProfileID(e.target.value)} required>
                <option value="">Chọn Account</option>
                {profiles.map(profile => (
                    <option key={profile.profileId} value={profile.profileId}>
                        {profile.name} - {profile.countryCode}
                    </option>
                ))}
            </select>
            <select 
                value={portfolioId} 
                onChange={(e) => setPortfolioId(e.target.value)} 
                required 
                disabled={!profileID} 
            >
                <option value="">Chọn Portfolio</option>
                {portfolioArray.map(profile => (
                    <option key={profile.portfolioId} value={profile.portfolioId}>
                        {profile.name}
                    </option>
                ))}
            </select>
                <label>Click:</label>
                <FilterInput
                    type="text"
                    value={filterClick}
                    onChange={e => setFilterClick(e.target.value)}
                />
                <ConditionSelect
                    value={filterClickCondition}
                    onChange={e => setFilterClickCondition(e.target.value)}
                >
                    <option value="eq">Bằng</option>
                    <option value="neq">Khác</option>
                    <option value="gt">Lớn Hơn</option>
                    <option value="lt">Nhỏ Hơn</option>``
                    <option value="gte">Lớn hơn bằng</option>
                    <option value="lte">Nhỏ hơn bằng</option>
                </ConditionSelect>
                <label>Spend:</label>
                <FilterInput
                    type="text"
                    value={filterSpend}
                    onChange={e => setFilterSpend(e.target.value)}
                />
                <ConditionSelect
                    value={filterSpendCondition}
                    onChange={e => setFilterSpendCondition(e.target.value)}
                >
                    <option value="eq">Bằng</option>
                    <option value="neq">Khác</option>
                    <option value="gt">Lớn Hơn</option>
                    <option value="lt">Nhỏ Hơn</option>
                    <option value="gte">Lớn hơn bằng</option>
                    <option value="lte">Nhỏ hơn bằng</option>
                </ConditionSelect>
                <label>ACOS:</label>
                <FilterInput
                    type="text"
                    value={filterACOS}
                    onChange={e => setFilterACOS(e.target.value)}
                />
                <ConditionSelect
                    value={filterACOSCondition}
                    onChange={e => setFilterACOSCondition(e.target.value)}
                >
                     <option value="eq">Bằng</option>
                    <option value="neq">Khác</option>
                    <option value="gt">Lớn Hơn</option>
                    <option value="lt">Nhỏ Hơn</option>
                    <option value="gte">Lớn hơn bằng</option>
                    <option value="lte">Nhỏ hơn bằng</option>
                </ConditionSelect>
            </div>
            <div>
                <label>ROAS:</label>
                <FilterInput
                    type="text"
                    value={filterROAS}
                    onChange={e => setFilterROAS(e.target.value)}
                />
                <ConditionSelect
                    value={filterROASCondition}
                    onChange={e => setFilterROASCondition(e.target.value)}
                >
                    <option value="eq">Bằng</option>
                    <option value="neq">Khác</option>
                    <option value="gt">Lớn Hơn</option>
                    <option value="lt">Nhỏ Hơn</option>
                    <option value="gte">Lớn hơn bằng</option>
                    <option value="lte">Nhỏ hơn bằng</option>
                </ConditionSelect>
                <label>CPC:</label>
                <FilterInput
                    type="text"
                    value={filterCPC}
                    onChange={e => setFilterCPC(e.target.value)}
                />
                <ConditionSelect
                    value={filterCPCCondition}
                    onChange={e => setFilterCPCCondition(e.target.value)}
                >
                    <option value="eq">Bằng</option>
                    <option value="neq">Khác</option>
                    <option value="gt">Lớn Hơn</option>
                    <option value="lt">Nhỏ Hơn</option>
                    <option value="gte">Lớn hơn bằng</option>
                    <option value="lte">Nhỏ hơn bằng</option>
                </ConditionSelect>
                <label>Order:</label>
                <FilterInput
                    type="text"
                    value={filterOrder}
                    onChange={e => setFilterOrder(e.target.value)}
                />
                <ConditionSelect
                    value={filterOrderCondition}
                    onChange={e => setFilterOrderCondition(e.target.value)}
                >
                    <option value="eq">Bằng</option>
                    <option value="neq">Khác</option>
                    <option value="gt">Lớn Hơn</option>
                    <option value="lt">Nhỏ Hơn</option>
                    <option value="gte">Lớn hơn bằng</option>
                    <option value="lte">Nhỏ hơn bằng</option>
                </ConditionSelect>
                <ConditionSelect
                    value={state}
                    onChange={e => setStateFilter(e.target.value)}
                >
                    <option value="ENABLED">Enabled</option>
                    <option value="PAUSED">Paused</option>
                </ConditionSelect>
                <div>
                {/* Select between Keyword or Placement */}
                <select value={selectedfilterPlacementorKeyword} onChange={e => setSelectedfilterPlacementorKeyword(e.target.value)}>
                    <option value="">Chọn loại</option>
                    <option value="keyword">Keyword</option>
                    <option value="placement">Placement</option>
                </select>

                {/* Render ConditionSelect for matchType if 'keyword' is chosen */}
                {selectedfilterPlacementorKeyword === 'keyword' && (
                    <ConditionSelect value={matchType} onChange={e => setMatchType(e.target.value)}>
                        <option value="">Chọn Match Type</option>
                        <option value="EXACT">EXACT</option>
                        <option value="BROAD">BROAD</option>
                        <option value="PHRASE">PHRASE</option>
                    </ConditionSelect>
                )}

                {/* Render ConditionSelect for placement if 'placement' is chosen */}
                {selectedfilterPlacementorKeyword === 'placement' && (
                    <ConditionSelect value={placement} onChange={e => setPlacement(e.target.value)}>
                        <option value="">Chọn Placement</option>
                        <option value="PLACEMENT_TOP">Top of Search</option>
                        <option value="PLACEMENT_REST_OF_SEARCH">Rest of Search</option>
                        <option value="PLACEMENT_PRODUCT_PAGE">Product Page</option>
                    </ConditionSelect>
                )}
            </div>
            </div>
            <FilterInput
                type="text"
                placeholder="Tìm theo tên..."
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
            />
            <div>
                <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </Button>
                <span> Page {currentPage} of {Math.ceil(totalItems / 10)} </span>
                <Button onClick={() => setCurrentPage(prev => prev + 1)} disabled={totalItems <= currentPage * 10}>
                    Next
                </Button>
            </div>
            {campaigns.length > 0 && (
                <>
                    <ConditionSelect
                        value={selectedBiddingRule}
                        onChange={(e) => setSelectedBiddingRule(e.target.value)}
                    >
                        <option value="">Select Bidding Rule</option>
                        {biddingProfiles.map((biddingProfile) => (
                            <option 
                                key={biddingProfile.ruleName} 
                                value={biddingProfile.optimizationRuleId}
                            >
                                {biddingProfile.ruleName}
                            </option>
                        ))}
                    </ConditionSelect>
                    <Button 
                        onClick={() => {
                            if (!selectedBiddingRule) {
                                alert('Please select a bidding rule before applying.');
                                return;
                            }
                            setFetchAll(true);
                            campaigns.forEach((campaign) => {
                                applyBiddingRule(
                                    campaign.profileId, 
                                    campaign.campaignId, 
                                    selectedBiddingRule
                                );
                            });
                        }}
                    >
                        Apply Bidding Rule to All
                    </Button>
                    <ConditionSelect
                        value={adjustbidType}
                        onChange={(e) => setAdjustbidType(e.target.value)}
                    >
                        <option value="">Select Bid Type</option>
                        <option value="increase_bid_by__$">Increase bid by $</option>
                        <option value="increase_bid_by__%">Increase bid by %</option>
                        <option value="set_bid_to">Set bid to $</option>
                        <option value="decrease_bid_by_$">Decrease bid by $</option>
                        <option value="decrease_bid_by_%">Decrease bid by %</option>
                    </ConditionSelect>
                     <FilterInput
                                    type="number"
                                    value={bidtarget}
                                    placeholder='Giá trị'
                                    step="0.01"
                                    required
                                    onChange={e => setBidTarget(Number(e.target.value))
                                    }
                         />
                    <Button 
                    onClick={async () => {
                        try {
                        setFetchAll(true);
                        console.log(campaigns);
                        for (const campaign of campaigns) {
                            let updatedBid;

                            switch (adjustbidType) {
                            case 'increase_bid_by__$':
                                updatedBid = campaign.bid + bidtarget;
                                break;
                            case 'increase_bid_by__%':
                                updatedBid = campaign.bid * (1 + bidtarget / 100);
                                break;
                            case 'set_bid_to':
                                updatedBid = bidtarget;
                                break;
                            case 'decrease_bid_by_$':
                                updatedBid = Math.max(0, campaign.bid - bidtarget);
                                break;
                            case 'decrease_bid_by_%':
                                updatedBid = Math.max(0, campaign.bid * (1 - bidtarget / 100));
                                break;
                            default:
                                alert('Invalid bid type selected.');
                                return;
                            }

                            // Apply the bid adjustment based on campaign type
                            if (campaign.matchType === 'KEYWORD') {
                            await ApplyBidKeyWord(campaign.profileId, campaign.keywordId, updatedBid);
                            } else if (campaign.matchType === 'TARGETING') {
                            await ApplyBidTarget(campaign.profileId, campaign.targetId, updatedBid);
                            }
                        }

                        alert('Bid adjustments applied successfully.');
                        } catch (error) {
                        console.error('Error applying bid adjustments:', error);
                        alert('An error occurred while adjusting bids. Please try again.');
                        }
                    }}
                    >
                    Adjust Bid Target
                    </Button>


                </>
            )}


            
            {campaigns.length > 0 && (
                <>
                    <ConditionSelect
                        value={selectedBudgetRuleId}
                        onChange={(e) => setSelectedBudgetRuleId(e.target.value)}
                    >
                        <option value="">Select Budget Rule</option>
                        {budgetProfiles.map((budgetProfile) => (
                            <option 
                                key={budgetProfile.ruleName} 
                                value={budgetProfile.budgetRuleIds} 
                            >
                                {budgetProfile.ruleName}
                            </option>
                        ))}
                    </ConditionSelect>
                    <Button 
                        onClick={async () => {
                            if (!selectedBudgetRuleId) {
                                alert('Please select a budget rule before applying.');
                                return;
                            }
                            try {
                                for (const campaign of campaigns) {
                                    await applyBudgetRule(
                                        campaign.profileId, 
                                        campaign.campaignId, 
                                        selectedBudgetRuleId
                                    );
                                }
                                alert('Budget rule applied to all campaigns successfully.');
                            } catch (error) {
                                console.error('Error applying budget rule:', error);
                                alert('An error occurred while applying the budget rule. Please try again.');
                            }
                        }}
                    >
                        Apply Budget Rule to All
                    </Button>
                </>
            )}
                        {campaigns.length > 0 && (
                <>
                    <ConditionSelect
                        value={selectedBudgetRuleId}
                        onChange={(e) => setSelectedBudgetRuleId(e.target.value)}
                    >
                        <option value="">Select Budget Rule</option>
                        {budgetProfiles.map((budgetProfile) => (
                            <option 
                                key={budgetProfile.ruleName} 
                                value={budgetProfile.budgetRuleIds} 
                            >
                                {budgetProfile.ruleName}
                            </option>
                        ))}
                    </ConditionSelect>
        <Button onClick={() => setShowPanel(true)}>
            Update Placement Rule
        </Button>

        {showPanel && (
            <div className="panel">
                <h2>Set Placement Values</h2>
                <div>
                    <label>Top Placement (%):</label>
                    <input 
                        type="number" 
                        value={selectedplacementTop} 
                        onChange={(e) => setSelectedPlacementTop(Number(e.target.value))} 
                        min="0"
                        step="0.01"
                    />
                </div>
                <div>
                    <label>Rest of Search Placement (%):</label>
                    <input 
                        type="number" 
                        value={selectedplacementRest} 
                        onChange={(e) => setSelectedRest(Number(e.target.value))} 
                        min="0"
                        step="0.01"
                    />
                </div>
                <div>
                    <label>Product Page Placement (%):</label>
                    <input 
                        type="number" 
                        value={selectedplacementProduct} 
                        onChange={(e) => setSelectedProduct(Number(e.target.value))} 
                        min="0"
                        step="0.01"
                    />
                </div>
                <Button 
                    onClick={async () => {
                        setFetchAll(true);
                        
                        try {
                            for (const campaign of campaigns) {
                                await updatePlacementRule(
                                    campaign.profileId, 
                                    campaign.campaignId, 
                                    selectedplacementTop,
                                    selectedplacementRest,
                                    selectedplacementProduct
                                );
                            }
                            setShowPanel(false); 
                        } catch (error) {
                            console.error('Error applying placement rule:', error);
                        }
                    }}
                >
                    Apply to All Campaigns
                </Button>
                <Button onClick={() => setShowPanel(false)}>Cancel</Button>
            </div>
        )}
    </>
)}


            {campaigns.length > 0 ? (
                campaigns.map(campaign => (
                    <CampaignItem key={campaign.campaignId}>
                        <InfoList list={[
                            { key: 'Campaign Name:', value: campaign.name },
                            { key: 'State', value: campaign.state },
                            { key: 'Budget', value: `$${campaign.budget}` },
                            { key: 'Start Date', value: DateTime.fromISO(campaign.startDate).toFormat('dd-MM-yyyy') },
                            { 
                                key: 'End Date', 
                                value: campaign.endDate 
                                    ? DateTime.fromISO(campaign.endDate).toFormat('dd-MM-yyyy') 
                                    : 'No end date' 
                            },
                            {key :'Placement',value:getPlacementName(campaign.placement_type)},
                            { key: 'Targeting Type', value: campaign.targeting_type },
                            { key: 'Strategy', value: getStrategyDisplayName(campaign.strategy) },
                            { key: 'MatchType', value: campaign.matchType},
                            {key:'ROAS ',value:campaign.ROAS},
                            {key:'Spend',value:campaign.spend},
                            {key:'Sale',value:campaign.sale},
                            {key:'Impression',value:campaign.impression},
                            {key:'Click',value: campaign.click},
                            {key:'CPC',value: campaign.CPC},
                            {key:'ACOS',value:campaign.ACOS},
                        ]} />
                        <div>
                            <Button onClick={() => handleUpdate(campaign.campaignId, campaign.profileId)}>
                                Tắt Camp
                            </Button>
                            <Button onClick={() => openConfirmDialog(campaign.campaignId, campaign.profileId)}>
                                Delete
                            </Button>
                            <ConditionSelect
                            value={selectedOptimizationRuleIds[campaign.campaignId] || ''}
                            onChange={(e) => handleOptimizationRuleChange(campaign.campaignId, e.target.value)}
                        >
                            <option value="">Select Bidding Rule</option>
                            {biddingProfiles.map(biddingProfile => (
                                <option key={biddingProfile.ruleName} value={biddingProfile.optimizationRuleId}>
                                    {biddingProfile.ruleName}
                                </option>
                            ))}
                        </ConditionSelect>
                        <Button onClick={() => applyBiddingRule(campaign.profileId, campaign.campaignId, selectedOptimizationRuleIds[campaign.campaignId])}>
                            Apply Bidding Rule
                        </Button>
                        <ConditionSelect
                            value={selectedBudgetRuleIds[campaign.campaignId] || ''}
                            onChange={(e) => handleBudgetRuleChange(campaign.campaignId, e.target.value)}
                        >
                            <option value="">Select Budget Rule</option>
                            {budgetProfiles.map(budgetProfile => (
                                <option key={budgetProfile.ruleName} value={budgetProfile.budgetRuleIds}>
                                    {budgetProfile.ruleName}
                                </option>
                            ))}
                        </ConditionSelect>
                        <Button onClick={() => applyBudgetRule(campaign.profileId, campaign.campaignId, selectedBudgetRuleIds[campaign.campaignId])}>
                            Apply Budget Rule
                        </Button>
                        
                        </div>
                        <Button onClick={() => navigateTo(`/user/amazon/campaign_list/${campaign.campaignId}`)} > Xem chi tiết </Button>
                    </CampaignItem>
                ))
            ) : (
                <Placeholder />
            )}
            {isConfirmDialogOpen && (
                <>
                    <Overlay onClick={closeConfirmDialog} />
                    <ConfirmDialog>
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this campaign?</p>
                        <Button onClick={handleDelete}>Yes, delete</Button>
                        <Button onClick={closeConfirmDialog}>Cancel</Button>
                    </ConfirmDialog>
                </>
            )}
        </Page>
    );
}
