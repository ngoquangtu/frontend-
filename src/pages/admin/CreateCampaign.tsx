import React, { useEffect, useState } from 'react';
import { useApi } from "../../hooks/api";
import { API } from '../../common/common';
import Page from '../../components/Page';
import '../css/AmazonCampaignCreate.css'; // Import the CSS file
import { toast } from "react-toastify"; // Import toast
import ToggleSwitch from '../../components/ToggleButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from 'antd';



const AmazonCampaignCreate: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [targetingType, setTargetingType] = useState<string>('MANUAL');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>();
    const [budget, setBudget] = useState<number>();
    const [percentage, setPercentage] = useState<number | 0>();
    const [profileID, setProfileID] = useState<string>('');
    const [profiles, setProfiles] = useState<{ profileId: string; name: string, countryCode: string }[]>([]);
    const [campaignId, setCampaignId] = useState<string>('');
    const [asin, setAsin] = useState<string>('');
    const [sku, setSku] = useState<string>('');
    const [defaultBid, setDefaultBid] = useState<number | 0.2>();
    const [keywordText, setKeywordText] = useState<string>('');
    const [bid, setBid] = useState<number>();
    const [adGroupId, setAdGroupId] = useState<string>('');
    const [strategy, setStrategy] = useState<string>('');
    const [placement, setPlacement] = useState<string>('');
    const [matchType, setMatchType] = useState<string>('');
    const [campaignType, setCampaignType] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [skuProfile, setSkuProfile] = useState<{ sku: string; asin: string, name: string, status: string }[]>([]);
    const [portfolioProfile, setPortfolioProfile] = useState<{ portfolioId: string; name: string, porfileId: string }[]>([]);
    const [portfolioId, setPortfolioID] = useState<string>('');

    const [LM_targetId, setLM_targetId] = useState<string>('');
    const [SUB_targetId, setSUB_targetId] = useState<string>('');
    const [CL_targetId, setCL_targetId] = useState<string>('');
    const [COM_targetId, setCOM_targetId] = useState<string>('');

    const [LM_bid, setLM_bid] = useState<number | 0.2>();
    const [SUB_bid, setSUB_bid] = useState<number | 0.2>();
    const [CL_bid, setCL_bid] = useState<number | 0.2>();
    const [COM_bid, setCOM_bid] = useState<number | 0.2>();

    const [LM_state, setLM_state] = useState<'ENABLED' | 'PAUSED'>('ENABLED');
    const [SUB_state, setSUB_state] = useState<'ENABLED' | 'PAUSED'>('ENABLED');
    const [CL_state, setCL_state] = useState<'ENABLED' | 'PAUSED'>('ENABLED');
    const [COM_state, setCOM_state] = useState<'ENABLED' | 'PAUSED'>('ENABLED');
    const [negativeKeyword, setNegativeKeyword] = useState<string>('');
    const [negativeType, setNegativeType] = useState<string>('NONE');
    const [negativeTypeProduct, setNegativeTypeProduct] = useState<string>('NONE');
    const [negativeAsin, setNegativeAsin] = useState<string>('');
    const callApi = useApi(); // Use callApi hook

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
    useEffect(() => {
        const fetchSku = async (profileID: string) => {
            try {
                const response = await callApi(API.GET__PRODUCT__BY__ID, { profileID });
                const skuData = response.productInfo.map((p: any) => ({
                    sku: p.sku,
                    asin: p.asin,
                    name: p.name,
                    status: p.status
                }));
                setSkuProfile(skuData);
            }
            catch (err) {
                toast.error('Lỗi hệ thống');
            }
        }

        const fetchPortfolio = async (profileID: string) => {
            try {
                const response = await callApi(API.GET_PORTFOLIO_ID, { profileID });
                const portfolioData = response.response.map((p: any) => ({
                    profileId: p.profileId,
                    portfolioId: p.portfolioId,
                    name: p.name,
                }));
                setPortfolioProfile(portfolioData);
            }
            catch (err) {
                toast.error('Lỗi hệ thống');
            }
        }

        fetchSku(profileID);
        fetchPortfolio(profileID);
    }, [profileID]);


    useEffect(() => {
        if (CL_targetId && LM_targetId && COM_targetId && SUB_targetId) {
            callApi(API.UPDATE_AUTO_TARGETING_CAMPAIGN, {
                profileID,
                CL_targetId,
                COM_targetId,
                LM_targetId,
                SUB_targetId,
                CL_bid,
                COM_bid,
                LM_bid,
                SUB_bid,
                CL_state,
                COM_state,
                LM_state,
                SUB_state
            })
                .then(() => {
                    toast.success(`Auto Targeting ID saved successfully`);
                })
                .catch((error) => {
                    toast.error(`Error saving Auto Targeting ID: ${error.message}`);
                });
        }
    }, [CL_targetId, LM_targetId, COM_targetId, SUB_targetId]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (keywordText.length > 0 && campaignType === 'KEYWORD' && targetingType === 'MANUAL') {
            const keywords = keywordText.split(',').map(keyword => keyword.trim());
            try {
                for (const keyword of keywords) {
                    // Create the campaign
                    const campaignResponse = await callApi(API.CREATE_SP_CAMPAIGNS, {
                        name: `MANGOAGS_SSP_MANUAL_${matchType}_${keyword}_${asin}_${sku}_${budget}budget_${bid}bid_${startDate}_${name}`,
                        startDate,
                        endDate,
                        budget,
                        percentage,
                        profileID,
                        strategy,
                        placement,
                        targetingType,
                        portfolioId,
                    });
                    setCampaignId(campaignResponse.campaignId);
                    toast.success(`Campaign created successfully: ${`MANGOAGS_SSP_MANUAL_${matchType}_${keyword}_${asin}_${sku}_${budget}budget_${bid}bid_${startDate}_${name}`}`);
                    // Create Ad Group
                    const adGroupResponse = await callApi(API.CREATE__AD__GROUP, {
                        campaignId: campaignResponse.campaignId,
                        name: `MANGOAGS_SSP_MANUAL_${matchType}_${keyword}_${asin}_${sku}_${budget}budget_${bid}bid_${startDate}_${name}`,
                        defaultBid,
                        profileID,
                    });
                    toast.success(`Ad group created successfully: ${adGroupResponse.adGroupId}`);

                    // Create Product Ads
                    await callApi(API.CREATE__PRODUCT__ADS, {
                        profileID,
                        campaignId: campaignResponse.campaignId,
                        sku,
                        adGroupId: adGroupResponse.adGroupId,
                        asin
                    });
                    toast.success(`Product ads created successfully`);
                    // Create Keywords
                    await callApi(API.CREATE__KEYWORD, {
                        profileID,
                        campaignId: campaignResponse.campaignId,
                        adGroupId: adGroupResponse.adGroupId,
                        bid,
                        keywordText: keyword,
                        matchType: matchType,
                    });
                    toast.success(`Keyword created successfully`);
                    if (negativeType !== "NONE") {
                        try {
                            const keywords = negativeKeyword.split(',').map((keyword) => keyword.trim());
                            const response = await callApi(API.CREATE__NEGATIVE__KEYWORD, {
                                profileID,
                                campaignId: campaignResponse.campaignId,
                                adGroupId: adGroupResponse.adGroupId,
                                keywordText: keywords,
                                matchType: negativeType,
                            });
                        } catch (error) {
                            console.error("Error creating negative keywords:", error);
                        }
                    }
                }
            } catch (error) {
                toast.error('Tên campaign bị trùng,hoặc token đã hết hạn !!');
            }
        }
        if (value.length > 0 && campaignType === 'TARGETING') {
            const values = value.split(',').map(val => val.trim());
            try {
                for (const value of values) {
                    // Create the campaign
                    const campaignResponse = await callApi(API.CREATE_SP_CAMPAIGNS, {
                        name: `MANGOAGS_SSP_MANUAL_${matchType}_${value}_${asin}_${sku}_${budget}budget_${bid}bid_${startDate}_${name}`,
                        startDate,
                        endDate,
                        budget,
                        percentage,
                        profileID,
                        strategy,
                        placement,
                        targetingType,
                        portfolioId,
                    });
                    setCampaignId(campaignResponse.campaignId);
                    toast.success(`Campaign created successfully: ${campaignResponse.campaignId}`);
                    // Create Ad Group
                    const adGroupResponse = await callApi(API.CREATE__AD__GROUP, {
                        campaignId: campaignResponse.campaignId,
                        name: `MANGOAGS_SSP_MANUAL_${matchType}_${value}_${asin}_${sku}_${budget}budget_${bid}bid_${startDate}_${name}`,
                        defaultBid,
                        profileID,
                    });
                    toast.success(`Ad group created successfully: ${adGroupResponse.adGroupId}`);

                    // Create Product Ads
                    await callApi(API.CREATE__PRODUCT__ADS, {
                        profileID,
                        campaignId: campaignResponse.campaignId,
                        sku,
                        adGroupId: adGroupResponse.adGroupId,
                        asin
                    });
                    toast.success(`Product ads created successfully`);
                    await callApi(API.CREATE__PRODUCT__TARGET, {
                        profileID,
                        campaignId: campaignResponse.campaignId,
                        bid,
                        adGroupId: adGroupResponse.adGroupId,
                        matchType: matchType,
                        value: value
                    });
                    if (negativeTypeProduct !== "NONE") {
                        try {
                            const negativeAsins = negativeAsin.split(',').map((asin) => asin.trim());
                            const response = await callApi(API.CREATE__NEGATIVE__PRODUCT, {
                                profileID,
                                campaignId: campaignResponse.campaignId,
                                adGroupId: adGroupResponse.adGroupId,
                                value: negativeAsins,
                                type: negativeTypeProduct,
                            });
                        } catch (error) {
                            console.error("Error creating negative product:", error);
                        }
                    }
                    toast.success(`Targeting created successfully`);
                }

            } catch (error) {
                toast.error('Tên campaign bị trùng,hoặc token đã hết hạn !!');
            }

        }
        if (targetingType === 'AUTO') {
            try {
                // Create the campaign
                const campaignResponse = await callApi(API.CREATE_SP_CAMPAIGNS, {
                    name: `MANGOAGS_SSP_AUTO_${matchType}_${asin}_${sku}_${budget}budget_${defaultBid}bid_${startDate}_${name}`,
                    startDate,
                    endDate,
                    budget,
                    percentage,
                    profileID,
                    strategy,
                    placement,
                    targetingType,
                    portfolioId,
                });
                setCampaignId(campaignResponse.campaignId);
                toast.success(`Campaign created successfully: ${campaignResponse.campaignId}`);
                // Create Ad Group
                const adGroupResponse = await callApi(API.CREATE__AD__GROUP, {
                    campaignId: campaignResponse.campaignId,
                    name: `MANGOAGS_SSP_AUTO_${matchType}_${asin}_${sku}_${budget}budget_${defaultBid}bid_${startDate}_${name}`,
                    defaultBid,
                    profileID,
                });
                toast.success(`Ad group created successfully: ${adGroupResponse.adGroupId}`);

                // Create Product Ads
                await callApi(API.CREATE__PRODUCT__ADS, {
                    profileID,
                    campaignId: campaignResponse.campaignId,
                    sku,
                    adGroupId: adGroupResponse.adGroupId,
                    asin
                });
                toast.success(`Product ads created successfully`);
                const response = await callApi(API.CREATE_AUTO_TARGETING_ID, {
                    profileID,
                    campaignId: campaignResponse.campaignId
                })
                const savedTargetIds: string[] = Array.isArray(response.savedTargetIds) ? response.savedTargetIds : [];

                setCL_targetId(savedTargetIds[0] || '');
                setLM_targetId(savedTargetIds[1] || '');
                setCOM_targetId(savedTargetIds[2] || '');
                setSUB_targetId(savedTargetIds[3] || '');
            }

            catch (error) {
                toast.error('Tên campaign bị trùng,hoặc token đã hết hạn !!');
            }
        }
    };

    return (
        <Page title="Tạo Campaign Amazon">
            <div>
                <select value={profileID} onChange={(e) => setProfileID(e.target.value)} required>
                    <option value="">Chọn Account</option>
                    {profiles.map(profile => (
                        <option key={profile.profileId} value={profile.profileId}>
                            {profile.name} - {profile.countryCode}
                        </option>
                    ))}
                </select>
                {portfolioProfile.length > 0 && (
                    <select
                        value={portfolioId}
                        onChange={(e) => {
                            const selectedPortfolioId = e.target.value;
                            setPortfolioID(selectedPortfolioId);

                        }}
                        required
                    >
                        <option value="">Chọn Portfolio</option>
                        {portfolioProfile.map(profolioItem => (
                            <option key={profolioItem.portfolioId} value={profolioItem.portfolioId}>
                                {profolioItem.name}
                            </option>
                        ))}
                    </select>
                )}
                <select value={targetingType} onChange={(e) => setTargetingType(e.target.value)} >
                    <option value="MANUAL">MANUAL</option>
                    <option value="AUTO">AUTO</option>
                </select>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Campaign Name(optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        placeholder="End Date (optional)"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <input
                        type="number"
                        step="0.1"
                        placeholder="Budget"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        required
                    />
                    <select value={strategy} onChange={(e) => setStrategy(e.target.value)} required>
                        <option value="">Chọn Strategy</option>
                        <option value="LEGACY_FOR_SALES">Down Only</option>
                        <option value="AUTO_FOR_SALES">Up and Down</option>
                        <option value="MANUAL">Fixed Bid</option>
                        <option value="RULE_BASED">Rule Base</option>
                    </select>
                    <select value={placement} onChange={(e) => setPlacement(e.target.value)}>
                        <option value="">Chọn Placement</option>
                        <option value="PLACEMENT_TOP">Top of Search</option>
                        <option value="PLACEMENT_REST_OF_SEARCH">Rest of search</option>
                        <option value="PLACEMENT_PRODUCT_PAGE">Product page</option>


                    </select>
                    <input
                        type="number"
                        placeholder="Percentage Strategy"
                        value={percentage}
                        onChange={(e) => setPercentage(Number(e.target.value))}
                    />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Default Bid"
                        value={defaultBid}
                        onChange={(e) => setDefaultBid(parseFloat(e.target.value))}
                        required
                    />
                    {skuProfile.length > 0 && (
                        <select
                            value={sku}
                            onChange={(e) => {
                                const selectedSku = e.target.value;
                                setSku(selectedSku);
                                const selectedSkuItem = skuProfile.find(skuItem => skuItem.sku === selectedSku);
                                if (selectedSkuItem) {
                                    setAsin(selectedSkuItem.asin);
                                }
                            }}
                            
                        >
                            <option value="">Chọn SKU</option>
                            {skuProfile.map(skuItem => (
                                <option key={skuItem.sku} value={skuItem.sku}>
                                    {skuItem.name} - {skuItem.sku} - {skuItem.status}
                                </option>
                            ))}
                        </select>
                    )}

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
                    {targetingType === 'AUTO' && (
                        <>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="substitutes Bid"
                                value={SUB_bid}
                                onChange={(e) => setSUB_bid(parseFloat(e.target.value))}
                            />
                            <ToggleSwitch
                                state={SUB_state}
                                setState={setSUB_state}
                            />


                            <input
                                type="number"
                                step="0.01"
                                placeholder="complements Bid"
                                value={COM_bid}
                                onChange={(e) => setCOM_bid(parseFloat(e.target.value))}
                            />
                            <ToggleSwitch
                                state={COM_state}
                                setState={setCOM_state}
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="close match Bid"
                                value={CL_bid}
                                onChange={(e) => setCL_bid(parseFloat(e.target.value))}
                            />
                            <ToggleSwitch
                                state={CL_state}
                                setState={setCL_state}
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="loose match Bid"
                                value={LM_bid}
                                onChange={(e) => setLM_bid(parseFloat(e.target.value))}
                            />
                            <ToggleSwitch
                                state={LM_state}
                                setState={setLM_state}
                            />
                        </>
                    )}

                    {targetingType === 'MANUAL' && (
                        <>
                            <select value={campaignType} onChange={(e) => setCampaignType(e.target.value)} required>
                                <option value="">Select Campaign Type</option>
                                <option value="KEYWORD">Keyword</option>
                                <option value="TARGETING">Targeting</option>
                            </select>

                            {campaignType === "KEYWORD" && (
                                <>
                                    <select value={matchType} onChange={(e) => setMatchType(e.target.value)} required>
                                        <option value="">Select Match Type for Keyword</option>
                                        <option value="EXACT">Exact</option>
                                        <option value="BROAD">Broad</option>
                                        <option value="PHRASE">Phrase</option>
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Keyword"
                                        value={keywordText} // Bind the keyword state
                                        onChange={(e) => setKeywordText(e.target.value)} // Update keyword state
                                        required
                                    />
                                    <select
                                        value={negativeType}
                                        onChange={(e) => {
                                            setNegativeTypeProduct("NONE");
                                            setNegativeType(e.target.value);


                                        }}
                                    >
                                        <option value="NONE">Select Negative keyword Option,ignore if you don't use</option>
                                        <option value="NEGATIVE_EXACT">EXACT</option>
                                        <option value="NEGATIVE_PHRASE">PHRASE</option>
                                    </select>
                                    {negativeType !== "NONE" && campaignType === "KEYWORD" && (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Fill negative keywood,Split by commas"
                                                value={negativeKeyword}
                                                onChange={(e) => setNegativeKeyword(e.target.value)}
                                            />
                                        </>
                                    )}
                                </>
                            )}

                            {campaignType === "TARGETING" && (
                                <>

                                    <select value={matchType} onChange={(e) => setMatchType(e.target.value)} required>
                                        <option value="">Select Targeting Option</option>
                                        <option value="ASIN_BRAND_SAME_AS">By Brand</option>
                                        <option value="ASIN_CATEGORY_SAME_AS">By Category</option>
                                        <option value="ASIN_SAME_AS">By Asin</option>
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="ASIN or Category ID"
                                        value={value} // Bind the targeting value state
                                        onChange={(e) => setValue(e.target.value)}
                                        required
                                    />
                                    <select
                                        value={negativeTypeProduct}
                                        onChange={(e) => {
                                            setNegativeType("NONE");
                                            setNegativeTypeProduct(e.target.value);
                                        }}
                                    >
                                        <option value="NONE">Select Negative Target Option,ignore if you don't use</option>
                                        <option value="ASIN_SAME_AS">ASIN</option>
                                        <option value="ASIN_BRAND_SAME_AS">By Brand</option>
                                    </select>
                                    {negativeTypeProduct !== "NONE" && (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Fill negative asin or value brand,Split by commas"
                                                value={negativeAsin}
                                                onChange={(e) => setNegativeAsin(e.target.value)}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Bid for Campaign Type"
                                value={bid}
                                onChange={(e) => setBid(parseFloat(e.target.value))}
                                required
                            />
                        </>
                    )}
                    <Button type="default" htmlType="submit" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <FontAwesomeIcon icon={faPlus} />
                        Tạo Campaign
                    </Button>
                </form>
                <div>
                    <div>

                    </div>
                </div>
            </div>

        </Page>
    );
};

export default AmazonCampaignCreate;
