import { useState, createContext, useContext, ReactNode, useEffect, useRef } from "react";
import { fetchApi } from './api';
import { API, ErrorCodes, Roles, UserInfo, WebApi } from '../common/common';
import useBroadcastChannel from "./broadcastChannel";


const BROADCAST_MESSAGE_TYPE = 'auth-changed';


interface AuthContextInfo {
	userInfo: UserInfo | null;
	sessionLoaded: boolean;
	login: (username: string, password: string, rememberLogin: boolean) => void;
	logout: () => void;
	recheckSession: () => void;
	hasApiPermission: (api: WebApi) => boolean;
}


const AuthContext = createContext<AuthContextInfo>({
	userInfo: null,
	sessionLoaded: false,
	login: () => {},
	logout: () => {},
	recheckSession: () => {},
	hasApiPermission: () => false
});

export const useAuth = () => useContext(AuthContext);




export function AuthProvider({children}: {children: ReactNode}) {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [sessionLoaded, setSessionLoaded] = useState<boolean>(false);

	const broadcastChannel = useBroadcastChannel<UserInfo | null>();
	broadcastChannel.onMessage(BROADCAST_MESSAGE_TYPE, ui => setUserInfo(ui));

	const setUserInfoAndBroadcast = (ui: UserInfo | null) => {
		setUserInfo(ui);
		broadcastChannel.postMessage(BROADCAST_MESSAGE_TYPE, ui);
	}

	// React.StrictMode renders the DOM twice on dev server, so use this flag to avoid the quietReload to be sent twice
	const loginReqSent = useRef(false);

	const contextValue: AuthContextInfo = {
		userInfo,
		sessionLoaded,

		login: async (username: string, password: string, rememberLogin: boolean) => {
			const res = await fetchApi(API.USER__LOGIN, { username, password, remember_login: rememberLogin });
			if (res) setUserInfoAndBroadcast(res.user_info);
		},

		logout: async () => {
			const res = await fetchApi(API.USER__LOGOUT);
			if (res) setUserInfoAndBroadcast(null);
		},

		recheckSession: async () => {
			const res = await fetchApi(API.USER__LOGIN, null, { quiet: true });
			setUserInfoAndBroadcast(res ? res.user_info : null);
			setSessionLoaded(true);
			return res;
		},
		
		hasApiPermission: (api: WebApi) => api.roles.includes(userInfo?.role ?? Roles.UNAUTHENTICATED)
	}

	useEffect(() => {
		// quietly restore user session on page reload
		if (!loginReqSent.current) {
			loginReqSent.current = true;
			contextValue.recheckSession();
		}
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <AuthContext.Provider value={contextValue}>
		{children}
	</AuthContext.Provider>
}

