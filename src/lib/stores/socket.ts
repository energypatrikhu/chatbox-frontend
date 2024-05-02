import { writable, type Writable } from 'svelte/store';
import { type Socket } from 'socket.io-client';

const socket: Writable<Socket> = writable();
export default socket;
