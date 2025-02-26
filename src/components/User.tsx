import { Link } from "react-router-dom";
import { API, AUTHENTICATED_ROLES, encodeListingApiPagingParams, getRoleName, Roles, SettingKeys, USER__LIST__SORT_KEYS, UserInfo, WebApi } from "../common/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { DynamicList, SortSettings } from "./List";
import { useEffect, useState } from "react";
import { useApi } from "../hooks/api";
import { useAuth } from "../hooks/auth";
import { ModalFormInput, ModalFormNumberValueSelect, ModalWithForm } from "./Modal";
import { formatSQLDateTime } from "../inc/utils";
import { useStringSetting } from "../hooks/settings";


export function UserList({api, additionalRequestData = {}}: {
	api: WebApi,
	additionalRequestData?: object
}) {
	const [page, setPage] = useState<number>(0);
    const [sortSettings, setSortSettings] = useState<SortSettings>({ key: USER__LIST__SORT_KEYS.USERNAME, descendant: false });

	const callApi = useApi();
	const dateTimeFormat = useStringSetting(SettingKeys.PRINT_DATETIME_FORMAT);
	
	return <DynamicList<UserInfo>
		fetchDataHandler={async () => {
			const reqData = {
				...encodeListingApiPagingParams(api, {
					page: page,
					sort: sortSettings.key,
					descendant: sortSettings.descendant
				}),
				...additionalRequestData
			};

			const ret = await callApi(api, reqData);
			return ret ? {
				itemCount: ret.item_count,
				pageData: ret.list
			} : null;
		}}

		itemRenderer={user => {
			const statusClassName = user.enabled ? 'text-accent' : 'text-gray-800';

			return <Link className="block bg-white-900 hover:bg-gray-100 rounded-lg mt-2 p-4" to={`/profile/${user.id}`} key={user.id}>
				<div>
					<h3 className="font-bold">
						{user.username}
						<FontAwesomeIcon icon={faCircle} className={`ml-2 h-3 w-3 ${statusClassName}`} />
					</h3>
					<div>Họ tên: {user.fullname}</div>
					<div>Nhóm: {getRoleName(user.role as Roles)}</div>
					<div>Thời gian tạo: {formatSQLDateTime(user.creation_time, dateTimeFormat ?? '') ?? '-'}</div>
					<div>Lần sửa cuối: {formatSQLDateTime(user.last_update_time, dateTimeFormat ?? '') ?? '-'}</div>
					<div>Đăng nhập cuối: {formatSQLDateTime(user.last_login_time, dateTimeFormat ?? '') ?? '-'}</div>
				</div>
			</Link>
		}}

		currentPage={page}
		setCurrentPage={setPage}

		sortable={true}
		sortOptions={[
			{ key: USER__LIST__SORT_KEYS.USERNAME, title: 'Tên đăng nhập' },
			{ key: USER__LIST__SORT_KEYS.FULLNAME, title: 'Tên đầy đủ' },
			{ key: USER__LIST__SORT_KEYS.CREATION_TIME, title: 'Thời gian tạo', descendant: true },
			{ key: USER__LIST__SORT_KEYS.LAST_LOGIN_TIME, title: 'Lần đăng nhập cuối', descendant: true },
			{ key: USER__LIST__SORT_KEYS.LAST_UPDATE_TIME, title: 'Lần sửa cuối', descendant: true },
		]}
		currentSortSettings={sortSettings}
		setCurrentSortSettings={setSortSettings}

		filterable={false}
	/>
}




export function CreateUserDialog({ show, handleClose, onSuccess } : {
	show: boolean,
	handleClose: () => void,
	onSuccess?: (userId: number) => void
}) {
	const callApi = useApi();

	return <ModalWithForm title='Tạo tài khoản' submitBtnTitle='Tạo' show={show} handleClose={handleClose}
		formikConfig={{
			initialValues: {
				username: '',
				password: '',
				password2: '',
				fullname: '',
				role: Roles.NORMAL_USER,
			},

			validate: values => {
				const errors: any = {};

				if (values.username.trim() === '') errors.username = 'Chưa điền tên đăng nhập.';
				if (values.password.trim() === '') errors.password = 'Chưa điền mật khẩu.';
				if (values.password2.trim() === '') errors.password2 = 'Chưa điền lại mật khẩu xác nhận.';
				else if (values.password !== values.password2) errors.password2 = 'Mật khẩu xác nhận lại không khớp.';
				if (values.fullname.trim() === '') errors.fullname = 'Chưa điền tên đầy đủ.';

				return errors;
			},

			onSubmit: async (values, { setSubmitting }) => {
				setSubmitting(true);

				const ret = await callApi(API.USER__CREATE, {
					username: values.username,
					password: values.password,
					fullname: values.fullname,
					role: values.role,
				});

				if (ret) {
					if (onSuccess) onSuccess(ret.user_id);
					handleClose();
				}

				setSubmitting(false);
			}
		}}
	>
		{formik => <>
			<ModalFormInput formik={formik} size="input-sm" name="username" label="Tên đăng nhập" />
			<ModalFormInput formik={formik} size="input-sm" name="fullname" label="Tên đầy đủ" />
			<ModalFormInput formik={formik} type="password" size="input-sm" name="password" label="Mật khẩu" />
			<ModalFormInput formik={formik} type="password" size="input-sm" name="password2" label="Mật khẩu (xác nhận lại)" />
		</>}
	</ModalWithForm>
}



export function UpdateUserInfoDialog({ id, show, handleClose, onSuccess } : {
	id: number,
	show: boolean,
	handleClose: () => void,
	onSuccess: (newInfo: UserInfo) => void
}) {
	const callApi = useApi();
	const { userInfo } = useAuth();

	const canChangeRole = userInfo?.role === Roles.SYSTEM_ADMIN && userInfo.id !== id;

	const [initialValues, setInitialValues] = useState({
		username: '',
		fullname: '',
		...(canChangeRole && { role: Roles.NORMAL_USER })
	})

	useEffect(() => {
		callApi(API.USER__GET, { id }).then(data => data && setInitialValues({
			username: data.info.username,
			fullname: data.info.fullname,
			...(canChangeRole && { role: data.info.role })
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <ModalWithForm title="Sửa thông tin tài khoản" submitBtnTitle="Sửa" show={show} handleClose={handleClose} initialValues={initialValues}
		formikConfig={{
			initialValues,

			validate: values => {
				const errors: any = {};

				if (values.username.trim() === '') errors.username = 'Chưa điền tên đăng nhập.';
				if (values.fullname.trim() === '') errors.fullname = 'Chưa điền tên đầy đủ.';

				return errors;
			},

			onSubmit: async (values, { setSubmitting }) => {
				setSubmitting(true);

				const ret = await callApi(API.USER__UPDATE_INFO, {
					id: id,
					username: values.username,
					fullname: values.fullname,
					...(canChangeRole && { role: values.role })
				});

				if (ret) {
					if (onSuccess) onSuccess({
						username: values.username,
						fullname: values.fullname,
						...(canChangeRole && { role: values.role })
					})

					handleClose();
				}

				setSubmitting(false);
			}
		}}
	>
		{formik => <>
			<ModalFormInput formik={formik} size="input-sm" name="username" label="Tên đăng nhập" />
			<ModalFormInput formik={formik} size="input-sm" name="fullname" label="Tên đầy đủ" />

			{canChangeRole &&
				<ModalFormNumberValueSelect formik={formik} size="select-md" name="role" label="Nhóm tài khoản">
					{AUTHENTICATED_ROLES.map(r => <option value={r} key={r}>{getRoleName(r)}</option>)}
				</ModalFormNumberValueSelect>}
		</>}
	</ModalWithForm>
}



export function UpdateUserPasswordDialog({ id, show, handleClose, onSuccess } : {
	id: number,
	show: boolean,
	handleClose: () => void,
	onSuccess: () => void
}) {
	const { userInfo } = useAuth();
	const callApi = useApi();

	const needOldPassword = userInfo?.id === id;

	return <ModalWithForm title="Đổi mật khẩu" submitBtnTitle="Đổi" show={show} handleClose={handleClose}
		formikConfig={{
			enableReinitialize: true,

			initialValues: {
				...(needOldPassword && {oldPassword: ''}),
				newPassword: '',
				newPassword2: '',
			},

			validate: values => {
				const errors: any = {};

				if (needOldPassword && values.oldPassword?.trim() === '') errors.oldPassword = 'Chưa điền mật khẩu cũ.';
				if (values.newPassword.trim() === '') errors.newPassword = 'Chưa điền mật khẩu mới.';
				if (values.newPassword2.trim() === '') errors.newPassword2 = 'Chưa điền mật khẩu mới lại.';
				else if (values.newPassword !== values.newPassword2) errors.newPassword2 = 'Mật khẩu xác nhận lại không khớp.';

				return errors;
			},

			onSubmit: async (values, { setSubmitting }) => {
				setSubmitting(true);

				const ret = await callApi(API.USER__UPDATE_PASSWORD, {
					id,
					...(needOldPassword && {old_password: values.oldPassword}),
					new_password: values.newPassword,
				});

				if (ret) {
					if (onSuccess) onSuccess();
					handleClose();
				}

				setSubmitting(false);
			}
		}}
	>
		{formik => <>
			{/* {userInfo?.role !== Roles.SYSTEM_ADMIN &&
				} */}
			<ModalFormInput formik={formik} size="input-sm" type="password" name="oldPassword" label="Mật khẩu cũ" />
			<ModalFormInput formik={formik} size="input-sm" type="password" name="newPassword" label="Mật khẩu mới" />
			<ModalFormInput formik={formik} size="input-sm" type="password" name="newPassword2" label="Mật khẩu mới (xác nhận lại)" />
		</>}
	</ModalWithForm>
}

