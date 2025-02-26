
import { toast } from 'react-toastify';
import { WebApi, ErrorCodes, HttpMethods } from '../common/common';
import { useAuth } from './auth';
import { errorCode2Msg } from '../inc/utils';


export async function fetchJson(url: string, options: any = {}) {
	try {
		const res = await fetch(process.env.REACT_APP_BASE_URL + '/api' + url, {
			...options,
			credentials: 'include'
		});
		const json = await res.json();

		if (json.error.code !== ErrorCodes.OK) {
			if (!options.quiet) toast(`Lỗi: ${json.error.msg ?? errorCode2Msg(json.error.code)}`);
			if (!options.keepInfoOnError) return null;
		}

		return json;

	} catch(err) {
		if (!options.quiet) toast('Lỗi: Không tải được dữ liệu.');
		return null;
	}
}


export function getApi(api: WebApi, data: any = null, options: any = {}) {
	return fetchJson(api.url + (data ? '?' + new URLSearchParams(data) : ''), {
		...options,
		method: HttpMethods.GET
	});
}


export function postApi(api: WebApi, data: any = null, options: any = {}) {
	return fetchJson(api.url, {
		...options,
		method: HttpMethods.POST,
		headers: {
			'Content-Type': 'application/json',
			...(options?.headers ?? {})
		},
		body: data ? JSON.stringify(data) : null
	});
}


export function fetchApi(api: WebApi, data: any = null, options: any = {}) {
	return api.method === HttpMethods.GET ? getApi(api, data, options) :
		api.method === HttpMethods.POST ? postApi(api, data, options) :
		null;
}


export function useApi() {
	const { recheckSession } = useAuth();

	return async (api: WebApi, data: any = null, options: any = {}) => {
		const res = await fetchApi(api, data, {
			...options,
			keepInfoOnError: true
		});
		if (!res) return null;

		if (res.error.code === ErrorCodes.USER_NOT_LOGGED_IN) recheckSession();

		return res.error.code === ErrorCodes.OK ? res : null;
	};
}
