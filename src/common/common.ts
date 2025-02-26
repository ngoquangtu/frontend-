/**
 * This file contains shared constants between the front and the ends.
 */




export enum SettingKeys {
    PRINT_DATE_FORMAT = 'PRINT_DATE_FORMAT',
    PRINT_TIME_FORMAT = 'PRINT_TIME_FORMAT',
    PRINT_DATETIME_FORMAT = 'PRINT_DATETIME_FORMAT',
}

export const LIST_ITEMS_PER_PAGE = 10;



// Constants in this enum must correspond to those in `role` table in the database.
export enum Roles {
	UNAUTHENTICATED = 0,
	SYSTEM_ADMIN = 1,
	NORMAL_USER = 2,
}


export function getRoleName(role: Roles): string {
	const role2Name: { [key: number] : string } = {
		[Roles.SYSTEM_ADMIN]: 'Quản trị viên',
		[Roles.NORMAL_USER]: 'Thành viên thường',
	};
	
	return role2Name[role] ?? null;
}


export enum HttpMethods {
	GET = 'get',
	POST = 'post'
}

export interface WebApi {
	url: string,
	method: HttpMethods,
	roles: Roles[]
}


export const AUTHENTICATED_ROLES: Roles[] = [Roles.SYSTEM_ADMIN, Roles.NORMAL_USER];
export const ALL_ROLES: Roles[] = [Roles.UNAUTHENTICATED, ...AUTHENTICATED_ROLES];



export enum ErrorCodes {
	OK,
	USER_NOT_LOGGED_IN,
	NO_PERMISSION,
	WRONG_USERNAME_OR_PASSWORD,
	WRONG_OLD_PASSWORD,
	USERNAME_IN_USE,
	INVALID_PASSWORD,
	INVALID_PARAMETERS,
	INTERNAL_ERROR,
	INVALID_UPLOAD_FILE_TYPE,
	PAGE_OUT_OF_RANGE,
	DATABASE_ERROR,

	// other codes to come...
}



export enum WebSocketMessages {
	SUBSCRIBE = 'subscribe',
	NEW_NOTIFICATION = 'new-notification',
	CONFIRM_MISSION = 'confirm-notification'
};


export const API: { [key: string]: WebApi } = {
	STATUS: {
		url: '/status',
		method: HttpMethods.GET,
		roles: [Roles.UNAUTHENTICATED]
	},
	SETTINGS__GET: {
		url: '/settings/get',
		method: HttpMethods.POST,
		roles: ALL_ROLES
	},

	SADMIN__TOGGLE_DEBUG_MODE: {
		url: '/sadmin/toggle-debug-mode',
		method: HttpMethods.GET,
		roles: [Roles.SYSTEM_ADMIN]
	},
	SADMIN__BACKUP__CREATE: {
		url: '/sadmin/backup/create',
		method: HttpMethods.GET,
		roles: [Roles.SYSTEM_ADMIN]
	},
	SADMIN__BACKUP__RESTORE: {
		url: '/sadmin/backup/restore',
		method: HttpMethods.POST,
		roles: [Roles.SYSTEM_ADMIN]
	},
	SADMIN__BACKUP__LIST: {
		url: '/sadmin/backup/list',
		method: HttpMethods.GET,
		roles: [Roles.SYSTEM_ADMIN]
	},

	USER__LOGIN: {
		url: '/user/login',
		method: HttpMethods.POST,
		roles: [Roles.UNAUTHENTICATED]
	},
	USER__LOGOUT: {
		url: '/user/logout',
		method: HttpMethods.GET,
		roles: AUTHENTICATED_ROLES
	},
	USER__CREATE: {
		url: '/user/create',
		method: HttpMethods.POST,
		roles: [Roles.SYSTEM_ADMIN]
	},
	USER__UPDATE_INFO: {
		url: '/user/update-info',
		method: HttpMethods.POST,
		roles: AUTHENTICATED_ROLES
	},
	USER__UPDATE_PASSWORD: {
		url: '/user/update-password',
		method: HttpMethods.POST,
		roles: AUTHENTICATED_ROLES
	},
	USER__ENABLE: {
		url: '/user/enable',
		method: HttpMethods.POST,
		roles: [Roles.SYSTEM_ADMIN]
	},
	USER__LIST: {
		url: '/user/list',
		method: HttpMethods.GET,
		roles: [Roles.SYSTEM_ADMIN]
	},
	USER__GET: {
		url: '/user/get',
		method: HttpMethods.GET,
		roles: AUTHENTICATED_ROLES
	},
	USER__NOTIFICATION__UNREAD_COUNT: {
		url: '/user/notification/unread-count',
		method: HttpMethods.GET,
		roles: AUTHENTICATED_ROLES
	},
	USER__NOTIFICATION__LIST: {
		url: '/user/notification/list',
		method: HttpMethods.GET,
		roles: AUTHENTICATED_ROLES
	},
	USER__NOTIFICATION__GET: {
		url: '/user/notification/get',
		method: HttpMethods.GET,
		roles: AUTHENTICATED_ROLES
	},
	USER__NOTIFICATION__MARK_READ: {
		url: '/user/notification/mark-read',
		method: HttpMethods.POST,
		roles: AUTHENTICATED_ROLES
	},
	USER__NOTIFICATION__MARK_READ_ALL: {
		url: '/user/notification/mark-read-all',
		method: HttpMethods.POST,
		roles: AUTHENTICATED_ROLES
	},
	GET__AMAZON__URL:
	{
		url: '/amazon/url',
		method: HttpMethods.GET,
		roles: AUTHENTICATED_ROLES
	},
	GET__AMAZON__TOKEN:
	{
		url: '/amazon/get-token',
		method: HttpMethods.GET,
		roles: AUTHENTICATED_ROLES
	},
	GET__TOKEN__REFRESH:
	{
		url: '/amazon/refresh-token',
		method: HttpMethods.POST,
		roles: AUTHENTICATED_ROLES
	},
	GET__LIST__SP__CAMPAIGNS:
	{
		url: '/amazon/campaign/sp-list',
		method: HttpMethods.POST,
		roles: AUTHENTICATED_ROLES
	},
	GET__LIST__CAMPAIGNS_DTB:
	{
		url: '/amazon/campaign/sp-list-dtb',
		method: HttpMethods.GET,
		roles: AUTHENTICATED_ROLES
	},
	CREATE_SP_CAMPAIGNS:
	{
		url: '/amazon/campaign/create',
		method: HttpMethods.POST,
		roles: AUTHENTICATED_ROLES
	},
	DELETE__SP__CAMPAIGNS:
	{
		url:'/amazon/campaign/delete',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	GET__AMAZON__INFOR:
	{
		url:'/amazon/profile/infor',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	UPDATE__SP__CAMPAIGNS:
	{
		url:'/amazon/campaign/update',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__AD__GROUP:
	{
		url:'/amazon/ad-group/create',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__PRODUCT__ADS:
	{
		url:'/amazon/product-ads/create',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__KEYWORD:
	{
		url:'/amazon/keyword/create',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__REPORT:
	{
		url:'/amazon/report/create',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	GET__REPORT__STATUS:
	{
		url:'/amazon/report/status',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	GET__REPORT:
	{
		url:'/amazon/report/get',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	DELETE__EXPIRES__REPORT:
	{
		url:'/amazon/report/delete',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__PRODUCT__TARGET:
	{
		url:'/amazon/campaign/target',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__RULE__CAMPAIGN:
	{
		url:'/amazon/rule/create',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	GET__RULE__CAMPAIGN:
	{
		url:'/amazon/rule/get',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__BIDDING__RULE:
	{
		url:'/amazon/bidding/rule',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	APPLY__BIDING_RULE:
	{
		url:'/amazon/bidding/apply',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	GET__BIDDING_ID:
	{
		url:'/amazon/bidding/get',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__BUDGET__RULE:
	{
		url:'/amazon/budget/create',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	CREATE_BUDGET__WEEKLY__RULE:
	{
		url:'/amazon/budget/create-weekly',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	APPLY__BUDGET_RULE:
	{
		url:'/amazon/budget/apply',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},

	GET__BUDGET__ID:
	{
		url:'/amazon/budget/get',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	UPLOAD__FILE__CAMPAIGN:
	{
		url:'/amazon/campaign/upload',
		method: HttpMethods.POST,
		roles:[Roles.UNAUTHENTICATED]
	},
	CREATE__ASIN__SKU:
	{
		url:'/amazon/product/asin',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	UPLOAD_ASIN_SKU:
	{
		url:'/amazon/product/upload-asin',
		method: HttpMethods.POST,
		roles:[Roles.UNAUTHENTICATED]
	},
	
	GET__PRODUCT__BY__ID:
	{
		url:'/amazon/product/get',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	UPDATE__PLACEMENT__RULE:
	{
		url:'/amazon/placement/update',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	UPLOAD__CAMPAIGN__AVAILABLE:
	{
		url:'/amazon/campaign/upload-available',
		method: HttpMethods.POST,
		roles:[Roles.UNAUTHENTICATED]
	},
	UPDATE__CAMPAIGN__REPORT:
	{
		url:'/amazon/campaign/update-available',
		method: HttpMethods.POST,
		roles:[Roles.UNAUTHENTICATED]
	},
	UPDATE__CAMPAIGN__BIDDING__KEYWORD:
	{
		url:'/amazon/campaign/update-bidding',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	UPDATE__CAMPAIGN__BIDDING__TARGETING:
	{
		url:'/amazon/campaign/update-bidding-target',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__PORTFOLIO:
	{
		url:'/amazon/portfolio/create',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	GET_PORTFOLIO_ID:
	{
		url:'/amazon/portfolio/get',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	CREATE_AUTO_TARGETING_ID:
	{
		url:'/amazon/campaign/auto-targeting',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	UPDATE_AUTO_TARGETING_CAMPAIGN:
	{
		url:'/amazon/campaign/update-auto-targeting',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__BID__SUGGESTION__BY__AUTO__CAMPAIGN:
	{
		url:'/amazon/campaign/bid-suggestion-auto-campaign',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	GET_CPC:
	{
		url:'/amazon/campaign/get-cpc',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__NEGATIVE__KEYWORD:
	{
		url:'/amazon/campaign/create-negative-keyword',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__NEGATIVE__PRODUCT:
	{
		url:'/amazon/campaign/create-negative-product',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},

	USER__NOTIFICATION__GET_TOP:
	{
		url:'/notification/get-top',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	UPLOAD__FILE:
	{
		url:'/user/upload_file',
		method: HttpMethods.POST,
		roles:[Roles.UNAUTHENTICATED]
	},

	CREATE__STREAM__SUBCRIPTION:
	{
		url:'/admin/streams/subscriptions',
		method: HttpMethods.POST,
		roles:[Roles.SYSTEM_ADMIN]
	},
	GET__SP__TRAFFIC:
	{
		url:'/user/get/sp_traffic',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	GET__SP__CAMPAIGN__DETAIL:
	{
		url:'/user/get/campaign_by_id',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	UPDATE__NEGATIVE__KEYWORD:
	{		
		url:'/user/update/negative_keywords',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	UPDATE__NEGATIVE__TARGETING:
	{
		url:'/user/update/negative_targeting',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__RULES__BASE:
	{
		url:'/user/create/rules',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	GET__RULES__BASE:
	{
		url:'/user/get/rules',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	CREATE__STRATEGY:
	{
		url:'/user/create/strategy',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	GET__STRATEGY:
	{
		url:'/user/get/strategy',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	APPLY__INTO__CAMPAIGN:
	{
		url:'/user/apply/strategy',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	DIS_APPLY__INTO__CAMPAIGN:
	{
		url:'/user/disapply/strategy',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	},
	GET__CAMPAIGN__NOT__APPLY__STRATEGY:
	{
		url:'/user/get-campaign/not-strategy',
		method: HttpMethods.GET,
		roles:AUTHENTICATED_ROLES
	},
	EDIT__STRATEGY:
	{
		url:'/user/edit/strategy',
		method: HttpMethods.POST,
		roles:AUTHENTICATED_ROLES
	}
}


export interface ListingApiPagingParams {
	sort: string | number;
	page: number;
	descendant: boolean;
}


export function encodeListingApiPagingParams(api: WebApi, params: ListingApiPagingParams): object {
	return api.method === HttpMethods.GET ? {
		paging_sort: params.sort,
		paging_page: params.page,
		paging_desc: params.descendant
	} : params;
}


export interface UserInfo {
	id?: number;
	username: string;
	fullname: string;
	password?: string;
	role?: Roles;
	enabled?: boolean;
	
	creation_time?: string;
	last_login_time?: string;
	last_update_time?: string;
}


export enum USER__LIST__SORT_KEYS {
	USERNAME,
	FULLNAME,
	CREATION_TIME,
	LAST_LOGIN_TIME,
	LAST_UPDATE_TIME,
}


export interface NotificationInfo {
	id?: number;
	seen: boolean;
	content: string;
	creation_time: string;
	action_url: string;
}
export interface CampaignInfor
{
    profileId: number;
	budget: number;
	budgetType:string;
	campaignId:string;
	percentage:number;
	strategy:string;
	endDate:string;
	name:string;
	startDate:string;
	state:string;
	targetingType:string;
	placement:string;
}
export interface CampaignData {
	Campaigns: string;
	Impressions: number;
	Clicks:number,
	Spend:number,
	CPC:number,
	Sales:number,
	ACOS:number,
	ROAS:number,	
	
}
export interface UploadData {
	Campaigns: string;
	Impressions: number;
	Clicks: number;
	'Spend(USD)': number;
	'CPC(USD)': number;
	'Sales(USD)': number;
	ACOS: number;
	ROAS: number;
	Orders:number;
	CampaignId:string;
	'Campaign ID':string;
	'Campaign Name':string;
	'Daily Budget':string;
	'Start Date':string;
	'Sales':number;
	'Spend':number;
	 'CPC':number;
	 'Bidding Strategy':string;
	 'End Date':string,
	 Entity:string,
	 'Ad Group Name':string,
	 'Ad Group ID':number,
	 'ASIN (Informational only)':string,
	 SKU:string,
	 'Ad Group Default Bid':number,
	 Placement:string,
	 Percentage:number,
	 'Keyword Text':string,
	 'Bid':string,
	 'Ad ID':number,
	 'Keyword ID':string,
	 'Match Type':string,
	 'Product Targeting ID':string,
	 'Portfolio ID':string,
	 'State':string,
}
export interface UploadAsin
{
	'Product Name':string,
	'Merchant SKU':string,
	'ASIN':string,
}
