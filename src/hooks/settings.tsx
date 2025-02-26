import { useEffect, useState } from "react";
import { API, ErrorCodes } from "../common/common";
import { fetchApi, useApi } from "./api";



interface SystemSettingItem {
	key: string;
	value: string;
}


const settingCache: Map<string, string> = new Map();


export async function getSettings(keys: string[]): Promise<Map<string, string> | null> {
	const cachedKeys = keys.filter(k => settingCache.has(k));
	const uncachedKeys = keys.filter(k => !settingCache.has(k));

	const map = new Map();
	cachedKeys.forEach(k => map.set(k, settingCache.get(k)));

	if (uncachedKeys.length > 0) {
		const ret = await fetchApi(API.SETTINGS__GET, { keys: uncachedKeys });
		if (ret?.error.code !== ErrorCodes.OK || !ret.list) return null;

		ret.list.forEach((item: SystemSettingItem) => {
			map.set(item.key, item.value);
			settingCache.set(item.key, item.value);
		});
	}

	return map;
}


export async function getSetting(key: string): Promise<string | null> {
	if (settingCache.has(key)) return settingCache.get(key) ?? null;

	const ret = await fetchApi(API.SETTINGS__GET, { keys: [key] });
	if (ret?.error.code !== ErrorCodes.OK || !ret.list) return null;

	const value = ret.list[0].value;

	settingCache.set(key, value);
	return value;
}



export function useNumberSetting(key: string) {
	const [value, setValue] = useState<number | null>(null);

	useEffect(() => {
		getSetting(key).then(value => value && setValue(+value));
		// eslint-disable-next-line
	}, []);

	return value;
}


export function useStringSetting(key: string) {
	const [value, setValue] = useState<string | null>(null);

	useEffect(() => {
		getSetting(key).then(value => value && setValue(value));
		// eslint-disable-next-line
	}, []);

	return value;
}


export function useBooleanSetting(key: string) {
	const [value, setValue] = useState<boolean | null>(null);

	useEffect(() => {
		getSetting(key).then(value => value && setValue(value === '1'));
		// eslint-disable-next-line
	}, []);

	return value;
}

