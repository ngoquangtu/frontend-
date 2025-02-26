import { useState } from "react";
import useBroadcastChannel from "./broadcastChannel";

const BROWSER_STORAGE_UPDATE_MESSAGE = 'BROWSER_STORAGE_UPDATE_MESSAGE';


enum BrowserStorageTypes {
	LOCAL_STORAGE,
	SESSION_STORAGE
}

interface BrowserStorageUpdateMessagePayload<ValueType> {
	key: string;
	value: ValueType;
}

interface BrowserStorageObject {
	data: string;
	expireTime?: Date;
}


function storageByType(type: BrowserStorageTypes) {
	switch(type) {
		case BrowserStorageTypes.LOCAL_STORAGE: return localStorage;
		case BrowserStorageTypes.SESSION_STORAGE: return sessionStorage;
	}

	throw new Error('Invalid storage type');
}


export function useBrowserStorage<ValueType>(
	type: BrowserStorageTypes,
	key: string,
	defaultValue: ValueType,
	encoder?: (value: ValueType) => string,
	decoder?: (value: string) => ValueType,
) : [
	ValueType,
	(value: ValueType, expireDurationSeconds?: number) => void
] {
	let initValue: ValueType = defaultValue;

	const storage = storageByType(type);
	const ls = storage.getItem(key);
	if (ls) {
		const lsObject: BrowserStorageObject = JSON.parse(ls);
		if (!lsObject.expireTime || lsObject.expireTime > new Date()) {
			try {
				initValue = decoder ? decoder(lsObject.data) : JSON.parse(lsObject.data);
			} catch(err) {
				initValue = defaultValue;
			}
		}
	}
	
	const [value, setStateValue] = useState<ValueType>(initValue);
	
	const broadcastChannel = useBroadcastChannel<BrowserStorageUpdateMessagePayload<ValueType>>();

	const setValue = (value: ValueType, expireDurationSeconds?: number) => {
		const lsObject: BrowserStorageObject = {
			data: encoder ? encoder(value) : JSON.stringify(value)
		};

		if (expireDurationSeconds) {
			lsObject.expireTime = new Date();
			lsObject.expireTime.setSeconds(lsObject.expireTime.getSeconds() + expireDurationSeconds);
		}

		storage.setItem(key, JSON.stringify(lsObject));

		broadcastChannel.postMessage(BROWSER_STORAGE_UPDATE_MESSAGE, { key, value });

		setStateValue(value);
	}

	broadcastChannel.onMessage(BROWSER_STORAGE_UPDATE_MESSAGE, payload => {
		if (payload.key !== key) return;
		setStateValue(payload.value);
	})

	return [
		value,
		setValue,
	];
}


export function useLocalStorage<ValueType>(
	key: string,
	defaultValue: ValueType,
	encoder?: (value: ValueType) => string,
	decoder?: (value: string) => ValueType
) {
	return useBrowserStorage(BrowserStorageTypes.LOCAL_STORAGE, key, defaultValue, encoder, decoder);
}

export function useSessionStorage<ValueType>(
	key: string,
	defaultValue: ValueType,
	encoder?: (value: ValueType) => string,
	decoder?: (value: string) => ValueType
) {
	return useBrowserStorage(BrowserStorageTypes.SESSION_STORAGE, key, defaultValue, encoder, decoder);
}
