import { useState } from "react";

import Page from "../../components/Page";
import { API, Roles } from "../../common/common";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CreateUserDialog, UserList } from "../../components/User";
import { useAuth } from "../../hooks/auth";
import { useNavigate, useSearchParams } from "react-router-dom";


// eslint-disable-next-line import/no-anonymous-default-export
export default function() {
	const { userInfo } = useAuth();
	const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	return <Page title="Quản lý tài khoản">
		{userInfo?.role === Roles.SYSTEM_ADMIN && <>
			<div className="mt-4 mb-4">
				<button className="btn btn-outline btn-accent" onClick={() => setOpenCreateUser(true)}>
					<FontAwesomeIcon icon={faUser} />
					Tạo tài khoản
				</button>
			</div>
			<CreateUserDialog show={openCreateUser}
				handleClose={() => setOpenCreateUser(false)}
				onSuccess={newId => navigate(`/profile/${newId}`)}
			/>
		</>}

		<UserList api={API.USER__LIST} additionalRequestData={Object.fromEntries(searchParams)} />
	</Page>
}
