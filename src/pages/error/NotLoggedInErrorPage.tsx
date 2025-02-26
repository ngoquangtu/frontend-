import ErrorPage, { ErrorLevels } from "./ErrorPage";

// eslint-disable-next-line import/no-anonymous-default-export
export default function() {
	return <ErrorPage level={ErrorLevels.ERROR}>
		Bạn chưa đăng nhập.
	</ErrorPage>
}