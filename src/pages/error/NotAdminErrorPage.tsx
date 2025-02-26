import ErrorPage, { ErrorLevels } from "./ErrorPage";

// eslint-disable-next-line import/no-anonymous-default-export
export default function() {
	return <ErrorPage level={ErrorLevels.ERROR}>
		Trang chỉ dành cho quản trị viên.
	</ErrorPage>
}