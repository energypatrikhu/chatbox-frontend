import type { Socket } from 'socket.io-client';
import { get, type Writable } from 'svelte/store';

export default function handleSocket(_socket: Writable<Socket>) {
	const socket = get(_socket);

	socket.on('connect', () => {
		console.log('connected');
	});
}
