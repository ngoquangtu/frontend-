import { ReactNode } from "react";
import { Roles } from "../common/common";
import { useAuth } from "../hooks/auth";
import NoPermissionErrorPage from "../pages/error/NoPermissionErrorPage";
import Placeholder from "./Placeholder";


// eslint-disable-next-line import/no-anonymous-default-export
export default function(
	{ title, children, roles = Roles.UNAUTHENTICATED }:
	{
		title: ReactNode | string | undefined,
		children: ReactNode,
		roles?: Roles | Roles[]
	})
{
	const {userInfo, sessionLoaded} = useAuth();

	if (!sessionLoaded) return <Placeholder />;

	if (!Array.isArray(roles)) roles = [roles];
	if (!roles.includes(Roles.UNAUTHENTICATED) && (!userInfo?.role || !roles.includes(userInfo?.role)))
		return <NoPermissionErrorPage />

	return <>
		<div>
			{children}
		</div>
	</>
}
