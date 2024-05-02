import type { Message } from '../chat';

export type ApiMessages = {
	success: boolean;
	data: Message[];
	error?: string;
};
