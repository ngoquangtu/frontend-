import { DateTime } from "luxon";
import { ErrorCodes } from "../common/common";

export function errorCode2Msg(err: ErrorCodes): string {
	return {
		[ErrorCodes.OK]: 'Không có lỗi.',
		[ErrorCodes.USER_NOT_LOGGED_IN]: 'Chưa đăng nhập.',
		[ErrorCodes.NO_PERMISSION]: 'Không có quyền thực hiện tác vụ.',
		[ErrorCodes.WRONG_USERNAME_OR_PASSWORD]: 'Sai tên đăng nhập hoặc mật khẩu.',
		[ErrorCodes.WRONG_OLD_PASSWORD]: 'Mật khẩu cũ không đúng.',
		[ErrorCodes.USERNAME_IN_USE]: 'Tên đăng nhập đã được sử dụng.',
		[ErrorCodes.INVALID_PASSWORD]: 'Mật khẩu không hợp lệ.',
		[ErrorCodes.INVALID_PARAMETERS]: 'Tham số sai',
		[ErrorCodes.INTERNAL_ERROR]: 'Lỗi không xác định.',
		[ErrorCodes.INVALID_UPLOAD_FILE_TYPE]: 'Loại file tải lên không hợp lệ.',
		[ErrorCodes.PAGE_OUT_OF_RANGE]: 'Số trang không đúng.',
		[ErrorCodes.DATABASE_ERROR]: 'Lỗi cơ sở dữ liệu.',
	}[err];
}



export function arrayRange(start: number, stop: number, step: number = 1) {
    return Array.from(
	    { length: (stop - start) / step + 1 },
	    (value, index) => start + index * step
    );
}



export function formatSQLDateTime(value: string | null | undefined, format: string) {
	if (value === null || value === undefined) return null;
	return DateTime.fromISO(value).toFormat(format);
}

export function formatSQLDate(value: string | null | undefined, format: string) {
	if (value === null || value === undefined) return null;
	return DateTime.fromISO(value).toFormat(format);
}



let uniqueValue = 1;

export function makeUniqueNumber(): number {
	return uniqueValue++;
}



export async function base64DataUrl2Blob(b64DataUrl: string): Promise<Blob> {
	const res = await fetch(b64DataUrl);
	return await res.blob();
}

