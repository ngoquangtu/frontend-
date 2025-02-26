import { useEffect, useState } from "react";
import Page from "../components/Page";
import { API, getRoleName, Roles, UserInfo } from "../common/common";
import { DateTime } from "luxon";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/api";
import { useAuth } from "../hooks/auth";
import { faEdit, faKey, faList, faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UpdateUserInfoDialog, UpdateUserPasswordDialog } from "../components/User";
import NoPermissionErrorPage from "./error/NoPermissionErrorPage";
import { toast } from "react-toastify";
import Placeholder from "../components/Placeholder";
import { TextLink } from "../components/Common";
import { InfoList } from "../components/InfoList";


// eslint-disable-next-line import/no-anonymous-default-export
export default function() {
	const { userInfo } = useAuth();
	const { id } = useParams() as { id: string };
	const [user, setUser] = useState<UserInfo | null>(null);
	const [openUpdateUserInfoDialog, setOpenUpdateUserInfoDialog] = useState<boolean>(false);
	const [openUpdateUserPasswordDialog, setOpenUpdateUserPasswordDialog] = useState<boolean>(false);
	const callApi = useApi();

	const canEditUser = userInfo?.role === Roles.SYSTEM_ADMIN || userInfo?.id === user?.id;

	useEffect(() => {
		callApi(API.USER__GET, { id }).then(ret => ret && setUser(ret.info));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (userInfo?.role !== Roles.SYSTEM_ADMIN && userInfo?.id !== +id)
		return <NoPermissionErrorPage />

	const operationButtons = [];
	if (user) {
		if (userInfo?.role && [Roles.SYSTEM_ADMIN].includes(userInfo.role)) {
			operationButtons.push(
				<Link to="/admin/users" className="btn btn-outline btn-accent mr-2" key="list">
					<FontAwesomeIcon icon={faList} fixedWidth={true} />
				</Link>
			);
		}

		if (canEditUser) {
			operationButtons.push(
				<button type="button" className="btn btn-outline btn-accent mr-2" key="edit" onClick={() => setOpenUpdateUserInfoDialog(true)}>
					<FontAwesomeIcon icon={faEdit} fixedWidth={true} />
					Sửa thông tin
				</button>
			);

			operationButtons.push(
				<button type="button" className="btn btn-outline btn-accent mr-2" key="pwd" onClick={() => setOpenUpdateUserPasswordDialog(true)}>
					<FontAwesomeIcon icon={faKey} fixedWidth={true} />
					Đổi mật khẩu
				</button>
			);
		}

		if (user.id !== userInfo.id && userInfo.role === Roles.SYSTEM_ADMIN) {
			operationButtons.push(
				<button type="button" className={`btn ${user?.enabled ? 'btn-error' : 'btn-success'} mr-2`} key="lock"
					onClick={async () => {
						if (!user) return;

						const ret = await callApi(API.USER__ENABLE, {
							id: user.id,
							enabled: !user.enabled,
						});

						if (ret) {
							setUser({
								...user,
								enabled: !user.enabled
							} as UserInfo);
						}
					}}
				>
					<FontAwesomeIcon icon={user.enabled ? faLock : faLockOpen} fixedWidth={true} />
					{user.enabled ? 'Khoá' : 'Mở khoá'}
				</button>
			);
		}
	}

	return <Page title={`Thông tin tài khoản:${user ? ` ${user.username}` : ''}`}>
		{canEditUser && <UpdateUserInfoDialog id={+id} show={openUpdateUserInfoDialog} handleClose={() => setOpenUpdateUserInfoDialog(false)}
			onSuccess={(newInfo: UserInfo) => {
				toast('Đã cập nhật thông tin tài khoản.');
				
				setUser({
					...user,
					...newInfo
				});
			}} />}
		{canEditUser && <UpdateUserPasswordDialog id={+id} show={openUpdateUserPasswordDialog} handleClose={() => setOpenUpdateUserPasswordDialog(false)}
			onSuccess={() => {
				toast('Đã thay đổi mật khẩu.');
			}} />}

		{operationButtons.length > 0 && <div className="mt-4 mb-4">{operationButtons}</div>}

		{user ? <InfoList list={[
			{key: 'Họ tên', value: user.fullname},
			{key: 'Nhóm', value: <TextLink to={{pathname: '/admin/users', search: `?role=${user.role}`}}>{getRoleName(user.role as Roles)}</TextLink>},
			{key: 'Thời gian tạo', value: DateTime.fromISO(user.creation_time as string).toFormat('dd-MM-yyyy')},
			{key: 'Lần sửa cuối', value: user.last_update_time ? DateTime.fromISO(user.last_update_time).toFormat('dd-MM-yyyy') : null},
			{key: 'Đăng nhập cuối', value: user.last_login_time ? DateTime.fromISO(user.last_login_time).toFormat('dd-MM-yyyy') : null},
		]} /> : <Placeholder />}
	</Page>
}

