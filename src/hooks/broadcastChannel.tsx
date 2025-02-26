import * as config from '../inc/config';

import { useRef } from "react";



export default function useBroadcastChannel<ValueType>() {
	const broadcastChannel = useRef({
		listeners: [] as ({type: string, callback: (payload: ValueType) => void})[],
		channel: new BroadcastChannel(config.BROADCAST_CHANNEL_NAME)
	});

	broadcastChannel.current.channel.onmessage = (event) => {
		broadcastChannel.current.listeners.forEach(({ type, callback }) => {
			if (type === event.data?.type) callback(event.data.payload);
		})
	}

	return {
		postMessage: (type: string, payload?: ValueType) => {
			broadcastChannel.current.channel.postMessage({ type, payload });
		},

		onMessage: (type: string, callback: (payload: ValueType) => void) => {
			broadcastChannel.current.listeners.push({ type, callback });
		}
	}
}